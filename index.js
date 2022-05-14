const { application } = require("express");
const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express();

const port = process.env.PORT || 5000;

//missleware

app.use(cors())
app.use(express.json());


//saklain
//KaRSk1eVlNOUOdnE

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qykb2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    const dataCollection = client.db("notesTracker").collection("notes");

    // get api to read all notes
    // http://localhost:5000/notes
    app.get('/notes', async (req, res) => {
      const q = req.query;
      console.log(q);
      const cursor = dataCollection.find(q);
      const result = await cursor.toArray();
      res.send(result);

    });

    // create notesTracker
    //http://localhost:5000/note
    /*
     body {
    "userName": "Sabbir Ahmed",
    "textDate":"Hellow world 2"
          }
    */

    app.post('/note', async (req, res) => {
      const data = req.body;
      console.log("from post API :", data);
      const result = await dataCollection.insertOne(data);
      res.send(result);
    });

    // update notes
    //http://localhost:5000/note/627fbd5e45cdf263b41ec8db
    app.put('/note/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(req.body);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          //...data
          //...req.body
          userName: data.userName,
          textDate: data.textDate
        },
      };

      const result = await dataCollection.updateOne(filter, updateDoc, options);
      //console.log('from put method', id);

      res.send(result);

    });

    // delete notes
    //http://localhost:5000/note/627fbd5e45cdf263b41ec8db

    app.delete('/note/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      res.send(result);
    });

  }
  finally {

  }

}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Notes tracker');
})

app.get('/check', (req, res) => {
  res.send('checked ...');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
