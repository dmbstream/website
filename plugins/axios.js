import axios from 'axios'

export default axios.create({
  baseURL: process.env.apiUrl,
  auth: {
    username: process.env.apiToken,
  },
  headers: {
    "X-ApiKey": process.env.apiKey,
  },
});
