const fs = require('fs');
const crypto = require('crypto');

const TOTAL_HASHES_PER_DAY = 864000;

function getData() {
  const endTime = new Date();
  const startTime = new Date(endTime - (24 * 60 * 60 * 1000));
  const timeLabels = [];
  const cpuUsageData = [];
  let hashesSoFar = 0;

  // Read CPU usage data from file
  const dataFilePath = './data/cpu-usage.json';
  let cpuUsageArray = [];
  try {
    cpuUsageArray = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading CPU usage data file: ${err}`);
  }

  // Remove data older than 24 hours
  cpuUsageArray = cpuUsageArray.filter((d) => {
    const dataTime = new Date(d.time);
    return dataTime >= startTime && dataTime <= endTime;
  });

  // If no data is left, initialize with zeros
  if (cpuUsageArray.length === 0) {
    for (let i = 0; i < 24; i++) {
      const time = new Date(endTime - ((24 - i) * 60 * 60 * 1000)).toISOString();
      cpuUsageArray.push({ time, cpuUsage: 0 });
    }
  }

  // Compute CPU usage data for current hour
  const currentHour = new Date().getHours();
  const currentHourData = cpuUsageArray.find((d) => new Date(d.time).getHours() === currentHour);
  for (let i = 0; i < TOTAL_HASHES_PER_DAY; i++) {
    crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
    hashesSoFar++;
    if (hashesSoFar >= TOTAL_HASHES_PER_DAY) {
      hashesSoFar = 0;
    }
    const currentTime = new Date();
    if (i === TOTAL_HASHES_PER_DAY - 1) {
      const cpuUsage = hashesSoFar / TOTAL_HASHES_PER_DAY;
      if (currentHourData) {
        currentHourData.cpuUsage = cpuUsage;
      } else {
        cpuUsageArray.push({ time: currentTime.toISOString(), cpuUsage });
      }
    }
  }

  // Write CPU usage data to file
  fs.writeFile(dataFilePath, JSON.stringify(cpuUsageArray), (err) => {
    if (err) {
      console.error(`Error writing CPU usage data file: ${err}`);
    }
  });

  // Return time labels and CPU usage data for last 24 hours
  for (let i = 0; i < 24; i++) {
    const time = new Date(endTime - ((24 - i) * 60 * 60 * 1000)).toISOString();
    const data = cpuUsageArray.find((d) => d.time === time);
    timeLabels.push(time);
    cpuUsageData.push(data ? data.cpuUsage : 0);
  }
  return { timeLabels, cpuUsageData };
}

module.exports = { getData };
