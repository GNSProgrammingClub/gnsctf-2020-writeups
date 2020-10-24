# Episode 2: Attack of the Cipher
Points: 150

## Category
Crypto

## Question
Your question may have looked slightly different.
>I just got a message from the Senate, but I can't seem to find the key! I asked my friend Anakin for it, but he said he didn't like it... Can you help?  `qoh_zsng_wg_gb_kgmr_dfd_ehlhvqc_ybxj_lviw`

## Hints
>Your flag should be in the format gnsCTF{plaintext}
>
>Anakin really wants to find this key, he says he needs it to decode a cipher based on a 26x26 grid? Weird...

## Analysis

The first hint is just to let you know that the plaintext will not have the flag formatting, and you'll have to add it yourself.

The second hint is to clue you in on the cipher: If you do some searching for a cipher with a 26x26 grid, you'll come across the [Vigenère Cipher](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher).

Anakin said he didn't like the key. Anakin is notorious for not liking sand, so sand could be a possibility for the key.

# Solution

Now that we know what cipher it is, the process of getting the flag is straightforward enough. You can either find an online decoder or code a Vigenère decryption yourself, but either way you'll find the flag. 

In terms of the key, most online decoders can automatically figure out the key. However, if you were well-versed in the Star Wars prequels (as mentioned in the analysis), you may know that the key is sand. Ultimately, the key can be found by a decoder anyway, so you didn't *need* to find the key yourself.

### Flag
`gnsCTF{you_want_to_go_home_and_rethink_your_life}`