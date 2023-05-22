const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// ===> //
// app.use(cors());
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekliqp2.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const ShopByCategoryCollection = client.db('toyWorld').collection('ShopByCategory');
    const userToyCollection = client.db('toyWorld').collection('userToy');

    app.get('/ShopByCategory', async (req, res) =>{
        const cursor = ShopByCategoryCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/userToy', async(req, res) =>{
      const user = req.body;
      console.log('add toy', user);
      const result = await userToyCollection.insertOne(user)
      res.send(result)
    })

    app.get('/userToy', async(req, res) =>{
      const cursor = userToyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
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


app.get('/', (req, res) =>{
    res.send('toy is running')
})

app.listen(port,()=>{
    console.log(`toy server is running on port: ${port}`)
})
