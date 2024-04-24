const express = require('express');
const cors =require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express()
const port=process.env.PORT || 5000;
 // middlewar
 app.use(cors());
 app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qucghff.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   const coffeCollection=client.db('coffeDb').collection('coffe')
   const userCollection=client.db('coffeDb').collection('user');
   app.get('/coffe',async(req,res)=>{
      const cursor=coffeCollection.find();
      const result=await  cursor.toArray();
      res.send(result)
   })
   app.get('/coffe/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await coffeCollection.findOne(query);
      res.send(result)
   })
    app.post('/coffe',async(req,res)=>{
      const newCoffe=req.body;
      console.log(newCoffe);
      const result=await coffeCollection.insertOne(newCoffe);
      res.send(result)
    })
    app.put('/coffe/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)}
      const options={upsert:true};
      const uddatedCoffe=req.body;
      // const Coffe={
      //    ${
      //       name:uddatedCoffe.name,
      //       quantity:uddatedCoffe.quantity,supplier:uddatedCoffe.supplier,
      //       test:uddatedCoffe.test,
      //       category:uddatedCoffe.category,
      //       details:uddatedCoffe.details,
      //       photo:uddatedCoffe.photo
      //    }
      // }
      const result=await coffeCollection.updateOne(filter,Coffe,options);
      res.send(result)
    })
    app.delete('/coffe/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await coffeCollection.deleteOne(query);
      res.send(result)
    })
    app.get('/user',async(req,res)=>{
      const cursor=userCollection.find();
      const users=await cursor.toArray()
      res.send(users)
    })
    app.post('/user',async(req,res)=>{
      const user=req.body;
      console.log(user)
      const result=await userCollection.insertOne(user);
      console.log(result);
      res.send(result)
    })
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await userCollection.deleteOne(query);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);



 app.get('/',(req,res)=>{
    res.send('coffe maker is running')
 })
 app.listen(port,()=>{
    console.log(`coffe server is running on port: ${port}`);
 }) 