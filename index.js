const express = require('express')
const ObjectID = require('mongodb').ObjectID;
const app = express()
const  cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello there! it is working properly')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mk6sw.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("barber").collection("order");
  const orderedCollection = client.db("barber").collection("ordered");
  const reviewCollection = client.db("barber").collection("review");
  const adminCollection = client.db("barber").collection("admin");

  // service data uploaded to the "serviceCollection" database
    app.post('/addServices', (req, res) => {
      const service = req.body
      console.log(service)
      serviceCollection.insertOne(service)
      .then(result => {
        console.log(result.insertedCount > 0)
        res.send(result.insertedCount > 0)
      })

    })

    // order submitted to the "orderedCollection" database
    app.post('/itemOrdered',(req, res) => {
      const item = req.body;
      console.log(item)
      orderedCollection.insertOne(item)
      .then(result => {
        console.log(result.insertedCount > 0)
        res.send(result.insertedCount > 0)
      })
    })
    // All service data showing to the UI
    app.get('/services', (req, res) => {
      serviceCollection.find({id: req.params._id})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    app.get('/book', (req, res) => {
      serviceCollection.find()
      .toArray((err, documents) => {
        res.send(documents)
      })
    })

    //ordered service showing to the order page
    app.get('/ordered',(req, res) => {
      orderedCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  ////review data adding to the database
  app.post('/review', (req, res) => {
    const addReview = req.body;
    reviewCollection.insertOne(addReview)
    .then(result=>{
      console.log(result.insertedCount > 0)
      res.send(result.insertedCount > 0)
    })
  })

  // review showing to the UI
  app.get('/reviews', (req, res) => {
    reviewCollection.find({id: req.params._id})
    .toArray((err, document)=>{
      res.send(document)
    })
  })

  //Adding ADMIN to the database
  app.post('/admin', (req, res)=>{
    const addAdmin = req.body
    adminCollection.insertOne(addAdmin)
    .then(result =>{
      console.log(result.insertedCount > 0)
      res.send(result.insertedCount > 0)
    })
  })
  ///show admin to the UI
  app.get('/showAdmin', (req, res) => {
    adminCollection.find({id: req.params._id})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  // admin
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
})

  // manage inventory 
  app.delete('/deleteItems/:id', (req, res)=>{
    const id = ObjectID(req.params.id);
    serviceCollection.findOneAndDelete({_id: id})
    .then((err, result)=>{
      console.log(result)
      result.deletedCount > 0
    })
  })
  ///checking database connection by this console
  console.log('database connected successfully')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})