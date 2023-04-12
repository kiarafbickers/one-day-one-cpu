const express = require('express');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = 3001;
const TOTAL_HASHES_PER_DAY = 864000;
const INTERVAL_IN_MILLISECONDS = 1000; // 1 second interval for CPU usage data collection
const CPU_USAGE_DATA_FILE_PATH = './data/cpu-usage.json';

// Keep track of the number of hashes computed so far
let hashesSoFar = 0;

// Compute SHA256 hashes using one core of CPU per day
setInterval(() => {
  crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
  hashesSoFar++;
  if (hashesSoFar >= TOTAL_HASHES_PER_DAY) {
    hashesSoFar = 0;
  }
}, INTERVAL_IN_MILLISECONDS);

// Route for retrieving CPU usage data
app.get('/api/cpu-usage-data', (req, res) => {
  const currentTime = new Date();
  const startTime = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));
  const timeLabels = [];
  const cpuUsageData = [];

  // Read historical CPU usage data from file
  fs.readFile(CPU_USAGE_DATA_FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading CPU usage data file: ${err}`);
      res.sendStatus(500);
      return;
    }

    const cpuUsageArray = JSON.parse(data);

    // Trim CPU usage data to last 24 hours
    const trimmedCpuUsageArray = cpuUsageArray.filter((usage) => {
      return new Date(usage.time) >= startTime;
    });

    // Generate time labels and CPU usage data for last 24 hours
    for (const usage of trimmedCpuUsageArray) {
      timeLabels.push(usage.time);
      cpuUsageData.push(usage.cpuUsage);
    }

    // Send CPU usage data as response
    res.send({ cpuUsageData, labels: timeLabels });
  });
});

// Save CPU usage data to file once per minute
setInterval(() => {
  const currentTime = new Date();
  const cpuUsage = hashesSoFar / TOTAL_HASHES_PER_DAY;
  const cpuUsageObject = { time: currentTime.toISOString(), cpuUsage };

  // Append CPU usage data to file
  fs.appendFile(CPU_USAGE_DATA_FILE_PATH, JSON.stringify(cpuUsageObject) + '\n', (err) => {
    if (err) {
      console.error(`Error writing CPU usage data file: ${err}`);
    }
  });
}, 60000);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
