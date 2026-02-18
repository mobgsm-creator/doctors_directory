const fs = require('fs');
const path = require('path');

const directory = process.cwd();
const outputFile = path.join(directory, 'output.json');

function isBatchFile(file) {
  return /^batch.*\.json$/i.test(file);
}

function safeReadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn(`Skipping invalid JSON: ${filePath}`);
    return null;
  }
}

function deepMergeSnapshots(target, source) {
  for (const key in source) {
    if (Array.isArray(source[key])) {
      target[key] = (target[key] || []).concat(source[key]);
    } else if (typeof source[key] === 'number') {
      target[key] = (target[key] || 0) + source[key];
    } else if (typeof source[key] === 'boolean') {
      target[key] = target[key] || source[key];
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      target[key] = target[key] || {};
      deepMergeSnapshots(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function merge() {
  const files = fs.readdirSync(directory)
    .filter(isBatchFile)
    .sort();

  if (files.length === 0) {
    console.log('No batch JSON files found.');
    return;
  }

  const merged = {
    numFailedTestSuites: 0,
    numFailedTests: 0,
    numPassedTestSuites: 0,
    numPassedTests: 0,
    numPendingTestSuites: 0,
    numPendingTests: 0,
    numRuntimeErrorTestSuites: 0,
    numTodoTests: 0,
    numTotalTestSuites: 0,
    numTotalTests: 0,
    openHandles: [],
    snapshot: {},
    startTime: null,
    success: true,
    testResults: [],
    wasInterrupted: false
  };

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const data = safeReadJSON(filePath);
    if (!data) return;

    // Aggregate numeric fields
    Object.keys(merged).forEach(key => {
      if (typeof merged[key] === 'number' && typeof data[key] === 'number') {
        merged[key] += data[key];
      }
    });

    // Merge arrays
    if (Array.isArray(data.openHandles)) {
      merged.openHandles.push(...data.openHandles);
    }

    if (Array.isArray(data.testResults)) {
      merged.testResults.push(...data.testResults);
    }

    // Merge snapshot deeply
    if (data.snapshot) {
      deepMergeSnapshots(merged.snapshot, data.snapshot);
    }

    // Preserve earliest start time
    if (typeof data.startTime === 'number') {
      if (!merged.startTime || data.startTime < merged.startTime) {
        merged.startTime = data.startTime;
      }
    }

    // Preserve interruption flag
    if (data.wasInterrupted) {
      merged.wasInterrupted = true;
    }
  });

  // Recalculate success deterministically
  merged.success =
    merged.numFailedTests === 0 &&
    merged.numFailedTestSuites === 0 &&
    !merged.wasInterrupted;

  fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
  console.log(`Merged ${files.length} batch files into output.json`);
}

merge();
