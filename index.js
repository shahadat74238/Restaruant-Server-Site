const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const app = express();
var cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 3002;

// restaurant
// Rza75iA4GTsao151

// ---------- Middleware ----------
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxghft2.mongodb.net/?retryWrites=true&w=majority`;

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
    const usersCollection = client.db("restaurant").collection("users"); 
    const menusCollection = client.db("restaurant").collection("menus"); 
    const reviewsCollection = client.db("restaurant").collection("reviews"); 
    const cartsCollection = client.db("restaurant").collection("carts"); 

    // ------------ menu ---------------
    app.get("/api/v1/menus", async(req, res) => {
      const result = await menusCollection.find().toArray();
      res.send(result);
    });
    // ----------------reviews -------------------
    app.get("/api/v1/reviews", async(req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    // ---------------- carts --------------------
    app.post("/api/v1/carts", async(req, res) => {
      const cartsItem = req.body;
      const result = await cartsCollection.insertOne(cartsItem)
      res.send(result);
    })

   app.get("/api/v1/carts", async(req, res) => {
    const email = req.query.email;
    const query = {email: email}
    const result = await cartsCollection.find(query).toArray();
    res.send(result);
   })

   app.delete("/api/v1/carts/:id", async (req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await cartsCollection.deleteOne(query);
    res.send(result);
   });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
