const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhfqq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db('delivery');
    const servicesCollection = database.collection('services');

    // GET API
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET Single Service
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    })

    // POST API
    app.post('/itemDelivery', async (req, res) => {
      const service = req.body;
      console.log('hit the post api', service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result)
    });
    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })
    // DELETE API
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/hello', (req, res) => {
  res.send('hello updated here')
})

app.listen(port, () => {
  console.log('Running delivery on port', port);
})