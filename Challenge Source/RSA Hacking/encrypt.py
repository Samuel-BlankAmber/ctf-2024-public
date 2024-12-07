from Crypto.Util.number import getPrime, isPrime, bytes_to_long
from math import gcd
from secret import FLAG

p = getPrime(512)
q = p ** 2
n = p * q

e = 65537

flag = bytes_to_long(FLAG)
assert flag < n
flag_encrypted = pow(flag, e, n)

print(f"{n = }")
print(f"{flag_encrypted = }")
