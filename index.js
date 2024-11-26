const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jheyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const database = client.db("coffeeStore");
    const userCollection = database.collection("userAmin");

    app.get('/coffees', async(req, res)=>{
        const allData = userCollection.find()
        const result = await allData.toArray()
        res.send(result)
    })

    app.get('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await userCollection.findOne(query)
        res.send(result)
    })
    
    app.post('/coffees', async(req, res)=>{
        const coffee = req.body;
        const result = await userCollection.insertOne(coffee)
        res.send(result)
    })

    app.put("/coffees/:id", async(req, res)=>{
        const id = req.params.id;
        const coffee = req.body;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const {name, chef, supplier, taste, category, details, imgPath} = coffee || {}

         const updateDoc = {
            $set: {
              name : name,
              chef: chef,
              supplier: supplier,
              taste : taste,
              category: category,
              details: details,
              imgPath: imgPath
            },
          };

          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send(result)
    })

    app.delete('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id) };
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("Data Loading")
})


app.listen(port, ()=>{
    console.log(`Running Port : ${port}`)
})