const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const categories = require('./data/categories.json')
const news = require('./data/news.json')
app.get('/', (req, res) => {
    res.send('Dragon is running')
});

app.get('/categories', (req, res) => {
    res.send(categories);
    console.log(categories)
})
 console.log(process.env.DB_USER)
 console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxd6utg.mongodb.net/?retryWrites=true&w=majority`;

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
    //await client.connect();
    
    const dragonCollection = client.db("dragon-db").collection("dragon-collection")
    
    app.get('/news', async(req, res) => {
        const cursor = dragonCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/news/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await dragonCollection.findOne(query)
      res.send(result)
    })

    app.get('/categories/:id', (req, res) => {
      const id = parseInt(req.params.id);
      console.log(id)
      if (id === 0){
        res.send(news)
      }
      else{
      const categoryNews = news.filter(n => parseInt(n.category_id) === id);
      res.send(categoryNews)}
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Dragon is running on the port: ${port}`)
})

