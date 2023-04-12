const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { getData, saveData } = require('./data/data-helper');

const app = express();
const PORT = 3000;
const TOTAL_HASHES_PER_DAY = 864000;

function computeCpuUsageData() {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + (24 * 60 * 60 * 1000));
  const timeLabels = [];
  const cpuUsageData = [];
  let hashesSoFar = 0;

  function computeHashes() {
    crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
    hashesSoFar++;
    if (hashesSoFar >= TOTAL_HASHES_PER_DAY) {
      hashesSoFar = 0;
    }
    const currentTime = new Date();
    const cpuUsage = hashesSoFar / TOTAL_HASHES_PER_DAY;
    timeLabels.push(currentTime.toISOString());
    cpuUsageData.push(cpuUsage);

    if (new Date() < endTime) {
      setTimeout(computeHashes, 0); // Add delay between iterations
    } else {
      const cpuUsageArray = timeLabels.map((time, i) => ({ time, cpuUsage: cpuUsageData[i] }));
      const dataFilePath = path.join(__dirname, 'data', 'cpu-usage.json');
      fs.writeFile(dataFilePath, JSON.stringify(cpuUsageArray), (err) => {
        if (err) {
          console.error(`Error writing CPU usage data file: ${err}`);
        }
      });
    }
  }

  computeHashes();
}

function resetData() {
  fs.unlink(path.join(__dirname, 'data', 'cpu-usage.json'), (err) => {
    if (err) {
      console.error(`Error deleting CPU usage data file: ${err}`);
    } else {
      console.log('CPU usage data file deleted');
    }
  });
}

// Route for computing SHA256 hashes
app.get('/api/hash', (req, res) => {
  const hash = crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
  res.send(hash);
});

// Route for retrieving CPU usage data
app.get('/api/cpu-usage-data', (req, res) => {
  const data = getData();
  res.send(data);
});

// Reset data at the end of each day
setInterval(() => {
  resetData();
  computeCpuUsageData();
}, 24 * 60 * 60 * 1000);

// Check for empty/corrupted CPU usage data file and handle it appropriately
const dataFilePath = path.join(__dirname, 'data', 'cpu-usage.json');
try {
  const cpuUsageArray = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  if (!Array.isArray(cpuUsageArray)) {
    console.error('CPU usage data file is corrupted. Deleting the file and starting fresh.');
    resetData();
  }
  console.log('CPU usage data file contents:');
  console.log(cpuUsageArray);
} catch (err) {
  console.error(`Error reading CPU usage data file: ${err}`);
}

// Compute CPU usage data on server start
computeCpuUsageData();

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
