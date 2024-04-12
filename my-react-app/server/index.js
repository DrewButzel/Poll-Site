//lots of this server code is from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/message', (req, res) => {
  const data = { message: 'Hello from Node.js backend!' };
  res.json(data);
});
app.post("/loginRequest",(req, res) => {
  console.log("data received u: "+req.username+"p: "+req.password);
  res.json({success: true,user_id:1});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});