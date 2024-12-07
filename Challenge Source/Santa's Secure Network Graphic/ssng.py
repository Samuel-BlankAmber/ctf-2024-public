from PIL import Image
from hashlib import md5

def get_raw_pixel_data(png_path):
    with Image.open(png_path) as img:
        img = img.convert("RGBA")
        width, height = img.size
        pixel_data = list(img.getdata())
    return pixel_data, width, height

class SSNG():
    def __init__(self):
        self._encoded_data = None

    def encode(self, pixel_data, width, height):
        """
        Encodes the pixel data into a SSNG file.
        Structure:
        - 5-byte header
        - 4-byte width
        - 4-byte height
        - Compressed pixel data chunks
        """
        encoded_data = b"SANTA"
        encoded_data += width.to_bytes(4) + height.to_bytes(4)

        CHUNK_SIZE = 97 # My favourite prime number
        chunks = (pixel_data[i:i + CHUNK_SIZE] for i in range(0, len(pixel_data), CHUNK_SIZE))
        for chunk in chunks:
            filtered_chunk = self._apply_compression_filter(chunk)
            compressed_chunk = self._apply_run_length_encoding(filtered_chunk)
            data = b""
            for colour in compressed_chunk:
                for block in colour:
                    count, value = block
                    if value < 0:
                        data += (count ^ 0b10000000).to_bytes(1) + (-value).to_bytes(1)
                    else:
                        data += count.to_bytes(1) + value.to_bytes(1)
                data += b"\x00ELF"
            encoded_data += data + b"\x00XMAS" + md5(data).digest()
        self._encoded_data = encoded_data

    def save(self, file_name):
        if not self._encoded_data:
            raise ValueError("Data has not been encoded yet.")
        with open(file_name, "wb") as f:
            f.write(self._encoded_data)

    def _apply_compression_filter(self, chunk):
        colours = list(zip(*chunk))
        filtered_colours = []
        for colour in colours:
            filtered = [colour[0]]
            for i, value in enumerate(colour[1:]):
                filtered.append(value - colour[i])
            filtered_colours.append(filtered)
        return filtered_colours

    def _apply_run_length_encoding(self, chunk):
        encoded_chunks = []
        for colour in chunk:
            encoded = []
            count = 1
            for i in range(1, len(colour)):
                if colour[i] == colour[i - 1]:
                    count += 1
                else:
                    encoded.append((count, colour[i - 1]))
                    count = 1
            encoded.append((count, colour[-1]))
            encoded_chunks.append(encoded)
        return encoded_chunks

if __name__ == "__main__":
    raw_data, width, height = get_raw_pixel_data("Original.png")
    file = SSNG()
    file.encode(raw_data, width, height)
    file.save("flag.ssng")
