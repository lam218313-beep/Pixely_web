"""Magnific scenes (devices with a chroma-green screen) -> clean photo + screen mask + screen box,
plus a still with a real Partners capture already inside (for no-JS / reduced motion / sharing).
Sources: media-src/escenas/*.webp (generated in Magnific). Run: python3 scripts/escenas.py"""
import json, os
import numpy as np
from PIL import Image, ImageFilter

SRC = 'media-src/escenas'
OUT = 'public/media/escenas'
CAPS = os.environ.get('PARTNERS', '../pixely/frontend')
STILL = {  # which real capture fills each screen in the still version
    'escena-celular-1': 'app/e2e-vitrina/m-validar.png',
    'escena-celular-2': 'app/e2e-vitrina/m-mercado.png',
    'escena-dueno-1': 'app/e2e-vitrina/m-idea.png',
    'escena-dueno-2': 'app/e2e-vitrina/m-inicio.png',
    'escena-laptop': 'layout/e2e-vitrina/d-planificacion-2.png',
}
os.makedirs(OUT, exist_ok=True)
boxes = {}
for name in sorted(STILL):
    im = Image.open(f'{SRC}/{name}.webp').convert('RGB')
    a = np.asarray(im).astype(np.float32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    excess = G - np.maximum(R, B)
    # Screen = strongly green. Soft edge from how green each pixel is.
    alpha = np.clip((excess - 40) / 70, 0, 1)
    hard = excess > 80
    ys, xs = np.nonzero(hard)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
    alpha[y0 + 3:y1 - 2, x0 + 3:x1 - 2] = np.maximum(alpha[y0 + 3:y1 - 2, x0 + 3:x1 - 2], hard[y0 + 3:y1 - 2, x0 + 3:x1 - 2])
    # Despill: the green glow on hands and bezels goes neutral.
    spill = excess > 0
    a[..., 1] = np.where(spill, np.maximum(R, B) + np.clip(excess, 0, None) * 0.15, G)
    clean = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    mask = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    W, H = im.size
    boxes[name] = {'w': W, 'h': H, 'x': round(x0 / W * 100, 3), 'y': round(y0 / H * 100, 3),
                   'sw': round((x1 - x0 + 1) / W * 100, 3), 'sh': round((y1 - y0 + 1) / H * 100, 3)}
    # Still: the capture fills the screen width, sitting at the bottom (status-bar area stays dark).
    cap = Image.open(f'{CAPS}/{STILL[name]}').convert('RGB')
    sw, sh = x1 - x0 + 1, y1 - y0 + 1
    ch = round(cap.height * sw / cap.width)
    cap = cap.resize((sw, ch), Image.LANCZOS)
    screen = Image.new('RGB', (sw, sh), (10, 10, 12))
    screen.paste(cap, (0, sh - ch) if ch <= sh else (0, 0))
    full = Image.new('RGB', (W, H), (10, 10, 12)); full.paste(screen, (x0, y0))
    still = Image.composite(full, clean, mask)
    big = 1600 if W >= H else 1200
    for img, tag in ((clean, ''), (still, '-still')):
        for w in (big, big // 2):
            r = img.resize((w, round(H * w / W)), Image.LANCZOS)
            r.save(f'{OUT}/{name}{tag}-{w}.webp', quality=82)
            r.save(f'{OUT}/{name}{tag}-{w}.jpg', quality=82, optimize=True, progressive=True)
    # Front: what sits in front of the screen inside its box (hands, bezel, glare), with the screen cut out.
    # Laid over the live walk-through instead of masking it: a static image is far cheaper than a mask.
    box = (x0, y0, x1 + 1, y1 + 1)
    front = clean.crop(box).convert('RGBA')
    front.putalpha(Image.fromarray(255 - np.asarray(mask.crop(box))))
    fw = round(sw * big / W)
    front.resize((fw, round(sh * big / W)), Image.LANCZOS).save(f'{OUT}/{name}-frente.webp', quality=88, method=6)
    print('✓', name, boxes[name])
json.dump(boxes, open('src/ui/escenas.json', 'w'), indent=2)
