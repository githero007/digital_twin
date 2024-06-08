const express = require('express');
const app = express();
const cors = require("cors");
const axios = require('axios');

app.use(express.json());
app.use(cors());

// Replace with actual sensor data or a data fetching mechanism
let sensorData = {
    ac: 0,
    people: 0,
    light: 0,
    door: 0
};

// Function to send sensor data to NodeMCU
async function sendDataToNodeMCU() {
    try {
        const response = await axios.post('http://192.168.154.137:3000/update', sensorData);
        console.log('Data sent successfully to ESP8266:', response.data);
    } catch (error) {
        console.error('Error sending data to ESP8266:', error);
    }
}
app.get('/', async (req, res) => {

    const { ac = sensorData.ac, people = sensorData.people, light = sensorData.light, door = sensorData.door } = req.body;
    sensorData = { ac, people, light, door };
    res.status(200).json(sensorData);
})
// Update sensor data periodically (adjust interval as needed)
setInterval(sendDataToNodeMCU, 500); // Send data every 5 seconds

app.post('/update', async (req, res) => {
    const { ac = sensorData.ac, people = sensorData.people, light = sensorData.light, door = sensorData.door } = req.body;

    sensorData = { ac, people, light, door };

    // Send the updated data back in the response
    res.status(200).json(sensorData);

    // Optionally, send the updated data to NodeMCU again here (if immediate notification is necessary)
    //sendDataToNodeMCU(); // Uncomment this line if needed
});

// Route for NodeMCU to fetch data on demand (optional)
app.get('/data', (req, res) => {
    res.status(200).json(sensorData);
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});