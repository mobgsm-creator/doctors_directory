from PIL import Image
import os

INPUT_DIR = r"C:\Users\agney\Downloads\treatments"
OUTPUT_DIR = r"C:\Users\agney\Downloads\treatments\webp"
QUALITY = 85

os.makedirs(OUTPUT_DIR, exist_ok=True)

for file in os.listdir(INPUT_DIR):
    if file.lower().endswith((".jpg", ".jpeg", ".png")):
        input_path = os.path.join(INPUT_DIR, file)
        output_path = os.path.join(
            OUTPUT_DIR,
            os.path.splitext(file)[0] + ".webp"
        )

        img = Image.open(input_path).convert("RGB")
        img.save(output_path, "WEBP", quality=QUALITY, method=6)

        print(f"Converted: {file} → {output_path}")
