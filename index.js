const express = require('express')
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
  const collection = client.db("barber").collection("order");
  console.log('database connected successfully')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})