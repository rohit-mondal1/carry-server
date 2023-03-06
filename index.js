const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const path = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// mongodb connoting

const uri = `mongodb+srv://carryserver:${process.env.USER_PASSWORD}@carry.amhc1ak.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  client.close();
});

async function run() {
  try {
    const database = client.db("carrydatabse");
    const categories = database.collection("categories");
    const user = database.collection("user");
    const product = database.collection("product");
    const bookings = database.collection("booking");

// ****************************************************************************
    app.get("/products/:name", async (req, res) => {
      const names = req.params.name;
      const query = { category: names };
      const result = await product.find(query).toArray();
      res.send(result);
    });
    app.get("/categories", async (req, res) => {
      const result = await categories.find({}).toArray();
      res.send(result);
    });
    //my products get
    app.get("/myProducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await product.find(query).toArray();
      res.send(result);
    });
    // user get my db
    app.get("/users", async (req, res) => {
      const email = req.query.gmail;
      const query = { email: email };
      const result = await user.find(query).toArray();
      res.send(result);
    });
    // user get my db
    app.get("/booking", async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const query = { email: email };
      const result = await bookings.find(query).toArray();
      res.send(result);
    });



    // *************************************************************************
    // user post my db
    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await user.insertOne(data);
      res.send(result);
    });
    // products post my db
    app.post("/product", async (req, res) => {
      const data = req.body;
      const result = await product.insertOne(data);
      res.send(result);
    });
    // booking post my db
    app.post("/booking", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await bookings.insertOne(data);
      res.send(result);
    });



    // *****************************************************************************************
    // delete post
    app.delete("/products/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await product.deleteOne(query);
      res.send(result);
    });
























































  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("okkkk");
});

app.listen(path, () => {
  console.log(`ima run on port ${path}`);
});
