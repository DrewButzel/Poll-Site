//lots of this server code is from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Owen:PollPass@pollproject.tszgsix.mongodb.net/?retryWrites=true&w=majority&appName=PollProject";
const client = new MongoClient(uri);


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/message', (req, res) => {
  const data = { message: 'Hello from Node.js backend!' };
  res.json(data);
});

async function run() {
  try {
    const database = client.db('PollProjDB');
    const users = database.collection('Users');
    users.insertOne({"poop" : "pooped"});
    console.log("Pooped");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.post("/loginRequest",(req, res) => {
  console.log("data received u: "+req.body.username+" p: "+req.body.password);
  run().catch(console.dir);
  res.json({success: true,user_id:1});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});