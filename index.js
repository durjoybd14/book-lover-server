const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World !')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghclx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("error", err);
  const bookCollection = client.db("bookLovers").collection("books");


  // get
  app.get('/books', (req, res) => {
    bookCollection.find().toArray((err, result) => {
      res.send(result);
    })
  })

  app.get('/checkout/:id', (req, res) => {
    bookCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  //post
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  })


  //delete
  app.delete('/deleteBook/:id', (req, res) => {
    bookCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);

      })
  })

})

//


client.connect(err => {
  const bookCollection = client.db("bookLovers").collection("checkout");

  // add checkout
  app.post("/addCheckout", (req, res) => {
    const newCheckout = req.body;
    bookCollection.insertOne(newCheckout)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // get by filter 
  app.get('/orders', (req, res) => {
    bookCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


})


client.connect(err => {
  const bookCollection = client.db("bookLovers").collection("orders");

  // add confirm order
  app.post("/confirmOrder", (req, res) => {
    const newOrder = req.body;
    bookCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    console.log(newOrder)
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})