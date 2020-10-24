from PIL import Image
import sys
from functools import reduce

fname = sys.argv[1]

im = Image.open(fname, 'r')
f = open(fname.rsplit('.', 1)[0] + '.hbmp', "wb")

# turn image into bit stream
px_data = im.load()
bitstream = ''
for j in range(im.size[1]):
    for i in range(im.size[0]):
        bitstream += "1" if px_data[i, j][3] == 255 else "0"

# function that adds hamming codes to chunk (15, 11)
def chunk_to_hamming(chunk):
    hamming_chunk = ''
    
    # Fill hamming chunk using method:
    # a) if its a parity bit, fill it with 0
    # b) if it is not, take one bit from the beginning of the chunk
    idx = 0
    for i in range(16):
        if i in [0, 1, 2, 4, 8]:
            hamming_chunk += "0"
        else:
            hamming_chunk += chunk[idx]
            idx += 1

    chunk_iter = enumerate(hamming_chunk)
    hamming_chunk = [bit for bit in hamming_chunk]

    # I heard 3blue1brown made a video on this recently, it may be useful in understanding this line
    error_loc = reduce(lambda x, y: x ^ y, [0] + [i for (i, bit) in chunk_iter if bit == '1'])
    hamming_codes = [ 1 << idx for idx, bit in enumerate(bin(error_loc)[:1:-1]) if bit == "1" ]

    # Flip parity bits to match data
    for loc in hamming_codes:
        hamming_chunk[loc] = "1"

    return ''.join(hamming_chunk)

# split bitstream into chunks of 11 to fill hamming codes
chunks = [bitstream[i : i + 11] for i in range(0, len(bitstream), 11)]
hamming_chunks = map(chunk_to_hamming, chunks)
bitstream = ''.join(hamming_chunks)

# save bit stream to file
data = int(bitstream, 2).to_bytes(len(bitstream) // 8, 'little')
f.write(data)
f.close()