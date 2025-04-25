const axios = require('axios');

const API_URL = 'http://localhost:3000'; // Sesuaikan dengan URL API kamu
const SUCCESS_ENDPOINT = '/api/hello';
const FAILURE_ENDPOINT = '/api/fail';

const sendRequest = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`);
    console.log(`Response from ${endpoint}:`, response.status, response.data);
  } catch (error) {
    console.error(`Error while hitting ${endpoint}:`, error.message);
  }
};

// Function to send requests every 10 seconds (or sesuaikan intervalnya)
const startSendingRequests = () => {
  setInterval(() => {
    // Simulate a success request to /api/hello
    sendRequest(SUCCESS_ENDPOINT);
  }, 10000); // 10 seconds

  setInterval(() => {
    // Simulate a failure request to /api/fail
    sendRequest(FAILURE_ENDPOINT);
  }, 5000); // 20 seconds
};

// Start sending requests
startSendingRequests();
