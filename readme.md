# One Day One CPU

One Day One CPU is a service that computes SHA256 hashes using one core of CPU per day, and displays the CPU usage as a vertical bar graph on the front-end. The graph shows the historical CPU usage for the most recent 24-hour period, with the height of the bar representing the percentage of CPU usage at a given point in time. The historical CPU usage data is stored in a file, and the data is reset at the end of each day.

## Running the Service

1. Run `npm install` to install the required dependencies.
2. Run `npm start` to start the server.
3. Open a web browser and navigate to `http://localhost:3000`.

## Usage

- /api/hash computes and returns a SHA256 hash.
- /api/cpu-usage-data returns the historical CPU usage data as an array of time labels and CPU usage percentages.

The front-end of the service displays the CPU usage data as a vertical bar graph.

## Dependencies

This service requires the following dependencies:

- Node.js v10 or higher
- Express.js
- Crypto
- Fs

## License

This project is licensed under the MIT License.

## ChatGPT

This Code was generated with ChatGPT using iterations of this prompt:

'''
This service cpu intensive service should computes SHA256 hashes using one core of CPU per day, and displays the CPU usage as a vertical bar graph on the front-end. The graph will show the historical CPU usage for the most recent 24-hour period, with the height of the bar representing the percentage of CPU usage at a given point in time. The historical CPU usage data will be stored in a file, and the data will be reset at the end of each day.

This is the file structure:

```
app/
├── data/
│   ├── cpu-usage.json
│   └── data-helper.js
├── public/
│   ├── index.html
│   └── style.css
│   └── js/
│   │   └── script.js
└── server.js
README.md
```
