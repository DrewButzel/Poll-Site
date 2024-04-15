//lots of this server code is from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://Owen:PollPass@pollproject.tszgsix.mongodb.net/?retryWrites=true&w=majority&appName=PollProject";
const client = new MongoClient(uri);

async function run() {
  
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
}


const emailRegex= /^[\w!#$%&'*+\/=?^_`{|}~-]+@([\w\-]+(?:\.[\w\-]+)+)$/;


const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());



async function checkDupe(username){
  
    const database = client.db('PollProjDB');
    const users = database.collection('Users');
    const query = { username: username };
    const user = await users.findOne(query);
    return user;
  
}
async function getPassword(username){
  
    const database = client.db('PollProjDB');
    const users = database.collection('Users');
    const query = { username: username };
    const user = await users.findOne(query);
    console.log(user.password);
    if(user&&user.password){
      console.log("pass: "+user.password);
      return user.password;
    }else{
      console.log("no user (or no password w associated user)");
      return null;
    }
  
}
async function addUser(username,password,email) {
  //try {
    const database = client.db('PollProjDB');
    const users = database.collection('Users');
    await users.insertOne({"username" : username, "password":password,"email":email});
    console.log(username+" with pass: "+password+" and email: "+email+" added to the DB");
  // } finally {
  //   await client.close();
  // }
}
app.post("/signupRequest",async(req, res) => {
  console.log("sing up data received u: "+req.body.username+" p: "+req.body.password+" e: "+req.body.email);
  let validEmail=false;
  if(match=emailRegex.exec(req.body.email)){
    validEmail=true;
  }
  if(validEmail){
    let dupe = await checkDupe(req.body.username);
    if(dupe){
      console.log("dupe");
      res.json({success: false,errorMsg:"account already exists"});
      return;
    }
    addUser(req.body.username,req.body.password,req.body.email).catch(console.dir);
    res.json({success: true,username:req.body.username});
  }else{
    res.json({success: false,errorMsg:"invalid Email"});
  }
});
app.post("/loginRequest",async (req, res) => {
  console.log("login data received u: "+req.body.username+" p: "+req.body.password);
  let pass = await getPassword(req.body.username);
  console.log(pass+" "+req.body.password);
  if(pass===req.body.password){
    res.json({success: true,username:req.body.username});
    return;
  }
  res.json({success: false, errorMsg:"incorrect username or password"});
});

run().catch(console.dir);