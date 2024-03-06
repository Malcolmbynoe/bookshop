import express, { response } from "express";
import {PORT, Mongodburl} from "./config.js"
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
const app = express();

app.use(express.json())

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(Mongodburl, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const booksDB = client.db("myBookshop")
  const booksColl = booksDB.collection("booksCollection")

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

app.get('/', (req, res) => {
    return res.send("hello here");
}
)

app.get('/shop', (req, res) => {
    booksColl.find().toArray()
    .then(response =>{
        console.log(response)
        return res.status(201).send(response)
    })
})

app.get('/shop/:id', (req, res) => {
    booksColl.findOne({_id:new ObjectId(req.params.id)})
    .then(response =>{
        console.log(response)
        return res.status(201).send(response)
    })
    .catch(error =>console.log(error))
})

app.get('/shop/remove/:id', (req, res) => {
    booksColl.deleteOne({_id:new ObjectId(req.params.id)})
    .then(response =>{
        console.log(response)
        return res.status(201).send(response)
    })
    .catch(error =>console.log(error))
})

app.post('/savebook', (req,res) => {
    //req title author price
    //res generated id number
    // const genId = () => {
    //     let bookId = Math.random()
    //     return `{"bookId":"${bookId}"}`
//    }
const data = req.body  
if (!data.title)
        return res.status(500).send("No title found.")
    if (!data.author)
        return res.status(500).send("No author found.")
    if (!data.price)
        return res.status(500).send("No price found.")
    
    booksColl.insertOne(data, (error, response) => {
        if (error){
            console.log("An error occurred!")
            return res.sendStatus(500)
        }
    })
    return res.send(JSON.stringify(data))
})
app.post('/shop/update/:id', (req,res) => {
    //req title author price
    //res generated id number
    // const genId = () => {
    //     let bookId = Math.random()
    //     return `{"bookId":"${bookId}"}`
//    }
const data = req.body  
if (!data.title && !data.author && !data.price)
        return res.status(400).send("No data received.")
    
    booksColl.updateOne({_id:new ObjectId(req.params.id)}, {$set: data.title.author.price}, (error, response) => {
        if (error){
            console.log("An error occurred!")
            return res.sendStatus(500)
        }
    })
    return res.send(JSON.stringify(data))
})
