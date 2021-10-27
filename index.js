const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

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
        
        // UPDATE API
        app.put('/products/:id', async (req, res)=>{
            const id = req.params.id;
            // console.log(req.body);
            const updatedProduct = req.body;
            console.log(updatedProduct)
            const options = { upsert: true };
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                  name: updatedProduct.name,
                  price: updatedProduct.price,
                  quantity: updatedProduct.quantity,
                },
              };
            const result = await productsCollection.updateOne(filter,updateDoc,options);
            console.log(result);
            // const updatedProduct = req.body;
            res.json(result)
        })

        //DELETE API
        app.delete('/products/:id', async (req, res)=>{
            const id = req.params.id;
            console.log('deleting product with an id ', id)
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // UPDATE API
        app.get('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result)
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