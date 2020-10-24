# MUHAHAHA I, the isp, will now apply noise to your file transfer
# You'll never be able to get the flag now ;)

import sys

fname = sys.argv[1]
f = open('./transfered.hbmp', 'wb')

# convert file to int
with open(fname, "rb") as datafile:
    data = int.from_bytes(datafile.read(), 'little')

# convert noise to int
with open("noise.hbmp", "rb") as noisefile:
    noise = int.from_bytes(noisefile.read(), 'little')

# bitflip all the data bits where the corresponding noise bit is a 1
# oh and it's a one liner because xor is cool and all >,<
newdata = data ^ noise

# save new data into file
transferdata = newdata.to_bytes(len(bin(newdata)) // 8, 'little')
f.write(transferdata)
f.close()