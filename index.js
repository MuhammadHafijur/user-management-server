const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t40z5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("profileDB");
    const profileCollection = database.collection("profiles");

    // post for profiles
    app.post("/profile", async (req, res) => {
      const profile = req.body;
      const result = await profileCollection.insertOne(profile);
      res.send(result);
    });

    // GET api for profile
    app.get("/profile", async (req, res) => {
      const cursor = profileCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // DELETE API
    app.delete("/profile/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await profileCollection.deleteOne(query);
      res.json(result);
    });

    // UPDATE API
    // changing status
    app.put('/status/:id', async (req, res) => {
      const id = req.params.id;
      // console.log('updating.... ', id)
      const status = req.body;
      console.log(status);
      const query = { _id: ObjectId(id) }; // filtering user's object
      const options = { upsert: true }; // update and insert
    

      const updateDoc = { // set data
          $set: status,
      };
      const result = await profileCollection.updateOne(query, updateDoc, options)
      res.json(result)
  })

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log("user management server", port);
});
