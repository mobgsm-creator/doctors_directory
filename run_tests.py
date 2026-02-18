import os
import subprocess
import sys
from pathlib import Path

# Configuration
TEST_DIR = Path("src/__tests__")
REPORT_DIR = Path("test-reports")
JEST_PATH = Path("node_modules/jest/bin/jest.js")

NODE_FLAGS = [
    "--expose-gc",
    "--enable-source-maps=false",
    "--max-old-space-size=16384",
]

JEST_FLAGS = [
    "--runInBand",
    "--no-bail",
    "--silent",
    "--coverage=false",
    "--no-cache",
    "--json",
]

def main():
    if not TEST_DIR.exists():
        print(f"Test directory not found: {TEST_DIR}")
        sys.exit(1)

    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    test_files = sorted(TEST_DIR.glob("*.test.*"))

    if not test_files:
        print("No test files found.")
        sys.exit(0)

    for test_file in test_files:
        report_file = REPORT_DIR / f"{test_file.stem}.json"

        command = (
            ["node"] +
            NODE_FLAGS +
            [str(JEST_PATH), str(test_file)] +
            JEST_FLAGS +
            ["--outputFile", str(report_file)]
        )

        print(f"\nRunning: {test_file}")
        print(" ".join(command))

        result = subprocess.run(command)


    print("\nAll test files completed successfully.")

if __name__ == "__main__":
    main()
