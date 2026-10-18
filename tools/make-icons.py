# Draws the app icon (a little table on a brown background) as PNG files.
# Pure Python, no extra packages:  python tools/make-icons.py
import struct
import zlib
from pathlib import Path

BG = (138, 75, 42)      # brown, same as theme_color
WOOD = (251, 247, 241)  # cream table


def table_pixel(x, y):
    """x, y in 0..1. Returns True where the table is drawn.
    Everything stays inside the central 80 % so the icon survives a round mask."""
    top = 0.25 <= x <= 0.75 and 0.40 <= y <= 0.47
    legs = (0.31 <= x <= 0.36 or 0.64 <= x <= 0.69) and 0.47 <= y <= 0.70
    plate = (x - 0.5) ** 2 / 0.12 ** 2 + (y - 0.37) ** 2 / 0.035 ** 2 <= 1 and y <= 0.40
    return top or legs or plate


def png(size):
    rows = []
    for py in range(size):
        row = bytearray([0])  # filter type 0
        for px in range(size):
            row += bytes(WOOD if table_pixel((px + 0.5) / size, (py + 0.5) / size) else BG)
        rows.append(bytes(row))

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(b"".join(rows), 9)) + chunk(b"IEND", b""))


out = Path(__file__).resolve().parent.parent / "icons"
for size in (192, 512):
    (out / f"icon-{size}.png").write_bytes(png(size))
    print(f"icons/icon-{size}.png")
