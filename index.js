const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// middlewars
app.use(cors());
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Hello World!')
})


const uri = "mongodb+srv://mydbuser602:i9OH7K4Ty7IQmTuI@cluster0.v2tgv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("productsDb");
        const productsCollection = database.collection("products");

        // GET API
        app.get('/products', async (req,res)=>{
            const cursor = productsCollection.find({})
            const products = await cursor.toArray()
            res.send(products)
        })

        // POST API
        app.post('/products', async (req,res)=>{
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.json(result)
        })

        // const pro = {name: 'phone', price: 210};
        // const result = await productsCollection.insertOne(pro);
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('hitting the server')
//   client.close();
// });

app.listen(port, ()=>{
    console.log(`App is listening from the port of ${port}`);
})