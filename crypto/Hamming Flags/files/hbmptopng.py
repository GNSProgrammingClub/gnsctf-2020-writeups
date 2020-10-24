from PIL import Image
import sys
from functools import reduce

fname = sys.argv[1]

im = Image.new("RGBA", (110, 8))

bitstream = ""
idx = 0

# convert file to bitstream
with open(fname, "rb") as f:
    bitstream = bin(int.from_bytes(f.read(), 'little'))[2:].rjust(1280, "0")

# take out hamming codes from bitstream
def hamming_to_chunk(chunk):
    final = ''

    for i in range(16):
        if i not in [0, 1, 2, 4, 8]:
            final += chunk[i]

    return final


# split bitstream into chunks and map hamming chunk to normal chunk
hamming_chunks = [bitstream[i : i + 16] for i in range(0, len(bitstream), 16)]
chunks = map(hamming_to_chunk, hamming_chunks)
bitstream = ''.join(chunks)

# put bit stream in image
px_data = im.load()
for j in range(im.size[1]):
    for i in range(im.size[0]):
        px_data[i, j] = (0, 0, 0, int(bitstream[idx]) * 255)
        idx += 1

im.save(fname.rsplit('.', 1)[0] + '.png')