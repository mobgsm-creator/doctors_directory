INPUT_FILE = "build-logs.txt"
OUTPUT_FILE = "clean_logs.txt"

KEYWORDS = [
    "parseList",
    "Error occurred prerendering page",
]

def extract_errors(input_path: str, output_path: str) -> None:
    with open(input_path, "r", encoding="utf-16", errors="ignore") as infile, \
         open(output_path, "w", encoding="utf-16") as outfile:

        capturing = False

        for line in infile:
            if any(keyword in line for keyword in KEYWORDS[1:]):
                outfile.write(line)



if __name__ == "__main__":
    extract_errors(INPUT_FILE, OUTPUT_FILE)
    print(f"Filtered logs written to '{OUTPUT_FILE}'")
