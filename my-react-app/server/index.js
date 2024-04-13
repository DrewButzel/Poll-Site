//lots of this server code is from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Owen:PollPass@pollproject.tszgsix.mongodb.net/?retryWrites=true&w=majority&appName=PollProject";
const client = new MongoClient(uri);
const emailRegex= /^[\w!#$%&'*+\/=?^_`{|}~-]+@([\w\-]+(?:\.[\w\-]+)+)$/;


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

async function addUser(username,password,email) {
  try {
    const database = client.db('PollProjDB');
    const users = database.collection('Users');
    await users.insertOne({"username" : username, "password":password,"email":email});
    console.log(username+" with pass: "+password+" and email: "+email+" added to the DB");
  } finally {
    await client.close();
  }
}
app.post("/signupRequest",(req, res) => {
  console.log("data received u: "+req.body.username+" p: "+req.body.password+" e: "+req.body.email);
  let validEmail=false;
  if(match=emailRegex.exec(req.body.email)){
    validEmail=true;
  }
  if(validEmail){
    addUser(req.body.username,req.body.password,req.body.email).catch(console.dir);
    res.json({success: true,username:req.body.username});
  }else{
    res.json({success: false,errorMsg:"invalid Email"});
  }
});
app.post("/loginRequest",(req, res) => {
  console.log("data received u: "+req.body.username+" p: "+req.body.password);
  res.json({success: true,username:req.body.username});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});