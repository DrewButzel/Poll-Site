//lots of this server code is from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Owen:PollPass@pollproject.tszgsix.mongodb.net/?retryWrites=true&w=majority&appName=PollProject";
const client = new MongoClient(uri);
let database;
let users;
let polls;
async function run() {
  console.log("run");
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  database = client.db('PollProjDB');
  users = database.collection('Users');
  polls = database.collection('Polls');
}
const emailRegex= /^[\w!#$%&'*+\/=?^_`{|}~-]+@([\w\-]+(?:\.[\w\-]+)+)$/;
const app = express();
const PORT = 3001;
app.use(cors());
app.use(bodyParser.json());

async function checkDupe(username){
  const query = { username: username };
  const user = await users.findOne(query);
  return user;
}
async function getPassword(username){
  const query = { username: username };
  const user = await users.findOne(query);
  console.log(user.password);
  if(user&&user.password){
    return user.password;
  }else{
    console.log("no user (or no password w associated user)");
    return null;
  }
}
async function addPoll(username,question,options){
  const result= await polls.insertOne({"username":username,"question":question,"options":options,"votedList":{}});
  if(result.acknowledged){
    console.log("Poll created by "+username+" with question "+question);
    const poll = {question:question,options:options,_id:result.insertedId,votedList:{},user:username};
    return {success:true,poll:poll};
  }
  console.log("Poll NOT created by "+username+" with question "+question);
  return {success:false};
}
async function addUser(username,password,email) {
  await users.insertOne({"username" : username, "password":password,"email":email});
  console.log(username+" with pass: "+password+" and email: "+email+" added to the DB");
}
app.post("/signupRequest",async(req, res) => {
  console.log("sign up data received u: "+req.body.username+" p: "+req.body.password+" e: "+req.body.email);
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
  console.log("actual pass: "+pass+" entered pass: "+req.body.password);
  if(pass===req.body.password){
    res.json({success: true,username:req.body.username});
    return;
  }
  res.json({success: false, errorMsg:"incorrect username or password"});
});
app.post("/cpoll", async (req,res)=>{
  const result = await addPoll(req.body.username,req.body.question,req.body.options);
  if(result.success){
    res.json({success: true,errorMsg:"Poll Created!",poll:result.poll});
  }
  else{
    res.json({success: false,errorMsg:"Error: Poll Not Created"});
  }

});
app.post("/voteRequest",async(req,res)=>{
  console.log("checking if"+req.body.username+"has voted on poll "+req.body.pollID);
  let query={};
  query["_id"]=new ObjectId(req.body.pollID);
  query["votedList."+req.body.username]=true;
  const findResult=await polls.findOne(query,{_id:1});
  console.log(findResult);
  if(findResult!==null){
    res.json({votedOn:true});
    return;
  }
  console.log(req.body.username+" is trying to vote \""+req.body.vote+"\" on poll: "+req.body.pollID);
  const id = new ObjectId(req.body.pollID);
  query={_id:id};
  const set = {};
  const inc = {};
  set["votedList."+req.body.username]=true; 
  inc["options."+req.body.vote]=1;
  const update={$set:set,$inc:inc};
  let result=await polls.updateOne(query,update);
  res.json({votedOn:result.acknowledged});
});
app.get("/displayPollsRequest", async(req,res)=>{
  try{
    const cursor = await polls.find(); 
    const foundPolls = [];
    console.log("getting polls");
    while(await cursor.hasNext()){
      foundPolls.push(await cursor.next());
    }
    res.json({success:true,polls:foundPolls});
  }catch{
    res.json({success:false});
  }
});
run().catch(console.dir);