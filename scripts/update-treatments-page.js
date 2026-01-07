const fs = require('fs');

const content = fs.readFileSync('src/app/treatments/[slug]/page.tsx', 'utf-8');

// Find treatment content start and end
const startMarker = 'const treatment_content:Record<string, string>  = {';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Start marker not found');
  process.exit(1);
}

// Find end (matching brace)
let braceCount = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex + startMarker.length - 1; i < content.length; i++) {
  const char = content[i];

  if (escapeNext) {
    escapeNext = false;
    continue;
  }

  if (char === '\\') {
    escapeNext = true;
    continue;
  }

  if (char === '"' && !escapeNext) {
    inString = !inString;
    continue;
  }

  if (!inString) {
    if (char === '{') braceCount++;
    if (char === '}') {
      braceCount--;
      if (braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
}

if (endIndex === -1) {
  console.error('End marker not found');
  process.exit(1);
}

// Create new content without treatment_content object
const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = before + 'import treatment_content from "../../../../public/treatments.json";' + after;

fs.writeFileSync('src/app/treatments/[slug]/page.tsx', newContent, 'utf-8');

console.log('Updated treatments page to use treatments.json');
console.log('Removed treatment_content object');
