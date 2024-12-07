from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from random import randint
from secret import FLAG

def encrypt(plaintext, num_times):
    if num_times == 0:
        return plaintext
    key = bytes([randint(0, 255)] * 16)
    cipher = AES.new(key, AES.MODE_ECB)
    return encrypt(cipher.encrypt(plaintext), num_times - 1)

print(encrypt(pad(b"There is no way you will be able to crack this: " + FLAG, 16), 6).hex())
