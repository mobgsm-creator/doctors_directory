const fs = require('fs');

// Read treatments page file
const pageContent = fs.readFileSync('src/app/treatments/[slug]/page.tsx', 'utf-8');

// Find the treatment_content object
const startMarker = 'const treatment_content:Record<string, string>  = {';
const startIndex = pageContent.indexOf(startMarker);

if (startIndex === -1) {
  console.error('Could not find treatment_content');
  process.exit(1);
}

// Find the closing brace (matching the opening brace)
let braceCount = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex + startMarker.length - 1; i < pageContent.length; i++) {
  const char = pageContent[i];

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
  console.error('Could not find end of treatment_content');
  process.exit(1);
}

// Extract just the object
const objStr = pageContent.substring(startIndex + startMarker.length - 1, endIndex);

// Now parse it - this is valid object syntax
// But values are JSON strings, so we need to parse them
let parsedTreatments = {};

// Use Function constructor instead of eval (safer)
try {
  const createObject = new Function('return ' + objStr);
  const rawTreatments = createObject();

  // Parse each JSON string value
  for (const [key, value] of Object.entries(rawTreatments)) {
    try {
      parsedTreatments[key] = JSON.parse(value);
      console.log(`Parsed: ${key}`);
    } catch (e) {
      console.error(`Failed to parse ${key}:`, e.message);
      parsedTreatments[key] = value; // Keep as is
    }
  }
} catch (e) {
  console.error('Failed to parse treatment_content object:', e.message);
  process.exit(1);
}

// Write to public/treatments.json
fs.writeFileSync('public/treatments.json', JSON.stringify(parsedTreatments, null, 2), 'utf-8');

console.log('\nMigration complete!');
console.log(`Total treatments: ${Object.keys(parsedTreatments).length}`);
console.log('\nTreatment keys:', Object.keys(parsedTreatments).slice(0, 5), '...');
