from Crypto.Util.number import getPrime, bytes_to_long
from math import gcd
from secret import FLAG

p = getPrime(512)
q = getPrime(512)
n = p * q

e = 65537

phi = (p-1) * (q-1)
assert gcd(phi, e) == 1

flag = bytes_to_long(FLAG)
assert flag < n
flag_encrypted = pow(flag, e, n)

print(f"{p = }")
print(f"{q = }")
print(f"{flag_encrypted = }")
