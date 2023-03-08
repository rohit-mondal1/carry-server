const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const path = process.env.PORT || 8000;

const stripe = require("stripe")(
  `${process.env.STRIPE_SK}`
);


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
    //  report get
    app.get("/report", async (req, res) => {
      const result = await product.find({report : "report"}).toArray();
      res.send(result);
    });
    // AdvertisingProduct
    app.get('/advertisingProduct', async(req , res)=>{
      const result = await product.find({}).limit(3).toArray()
      res.send(result)
    })
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

    // all buyers
    app.get('/allBuyers' , async(req , res)=>{
      const query= {type : "Buyer"}
      const result = await user.find(query).toArray()
      res.send(result)
    })
    // all Seller
    app.get('/allSeller' , async(req , res)=>{
      const query= {type : "Seller"}
      const result = await user.find(query).toArray()
      res.send(result)
    })



    // *************************************************************************
    // user post my db
    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await user.insertOne(data);
      res.send(result);
      // const getuser = await user.find({}).toArray();
      // for (let dat of getuser) {
      //   if (dat?.email === data?.email) {
      //     return res.send();
      //   } else {
      //     const result = await user.insertOne(data);
      //     res.send(result);
      //   }
      // }
      // const vry = {email : data.email};
      // const result = await user.insertOne(data);
      // res.send(result);
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
    // reportadedItems post my db
    app.post("/reportadedItems", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await report.insertOne(data);
      res.send(result);
    });



    // *****************************************************************************************
    // delete products admin
    app.delete("/productsReport/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await product.deleteOne(query);
      res.send(result);
    });
    // delete products seller
    app.delete("/products/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await product.deleteOne(query);
      res.send(result);
    });

    // delete order
    app.delete("/Order/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await bookings.deleteOne(query);
      res.send(result);
    });
    // delete users
    app.delete("/users/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await user.deleteOne(query);
      res.send(result);
    });
    // delete report
    app.delete("/report/:id", async (req, res) => {
      const ids = req.params.id;
      const query = { _id: new ObjectId(ids)};
      const result = await report.deleteOne(query);
      res.send(result);
    });

    //******************************************************************************************** */

    // user update 
    app.put('/update/:id' , async(req , res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const option = {upsert : true}
      const updateUser ={
        $set :{
          verify : "verify"
        }
      }
      const result = await user.updateOne(filter ,updateUser ,option )
      res.send(result)
    })
    // verify products  card  user
    app.put('/userupdat' , async(req , res)=>{
      const gmail = req.query.email;
     
      const filter = {email : gmail}
      const option = {upsert : true}
      const updateUser ={
        $set :{
          verify : "verify"
        }
      }
      const result = await product.updateMany(filter ,updateUser ,option )
      res.send(result)
    })
    // report products  card  user
    app.put('/postreop' , async(req , res)=>{
      const ids = req.query.id;
      const filter = {_id : new ObjectId(ids)}
      const option = {upsert : true}
      const updateUser ={
        $set :{
          report : "report"
        }
      }
      const result = await product.updateMany(filter ,updateUser ,option )
      res.send(result)
    })
    // update payment
    app.put('/booking/:id' , async(req , res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const option = {upsert : true}
      const updateUser ={
        $set :{
          payment : "paid"
        }
      }
      const result = await bookings.updateOne(filter ,updateUser ,option )
      res.send(result)
    })


// ************************************************************************************
// payment sistema 

app.post("/create-payment-intent", async (req, res) => {
  const product = req.body;
  const amount = parseInt(product.price) * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    payment_method_types: ["card"],
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
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
