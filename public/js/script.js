function parseChartData(chartData) {
  const labels = chartData.labels.map((timestamp) => new Date(timestamp).toLocaleTimeString());
  const cpuUsageData = chartData.cpuUsageData.map((cpuUsage) => (cpuUsage * 100).toFixed(2));
  return { labels, cpuUsageData };
}

async function fetchChartData() {
  const response = await fetch('/api/cpu-usage-data');
  const chartData = await response.json();
  return parseChartData(chartData);
}

async function displayChart() {
  const chartData = await fetchChartData();

  const ctx = document.getElementById('cpu-usage-chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: '% CPU Usage',
        data: chartData.cpuUsageData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 100
        },
        x: {
          title: {
            display: true,
            text: 'Time of Day'
          }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  displayChart();
});
