from Crypto.Util.number import getPrime
from secret import FLAG

def xor_bytes(a, b):
  return bytes(x ^ y for x, y in zip(a, b))

def generate_key():
  return getPrime(512)

def encrypt(plaintext, key):
  ciphertext = plaintext
  for _ in range(key):
    ciphertext = xor_bytes(ciphertext, b"SUPER_SECRET_ENCRYPTION_ALGORITHM")
  return ciphertext

# Will take many millions of years to run on a normal computer.
key = generate_key()
flag_encrypted = encrypt(FLAG, key)
print(flag_encrypted.hex())
