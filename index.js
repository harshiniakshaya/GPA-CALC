/*import express from "express";
import bodyParser from "body-parser";


import mongoose from 'mongoose';
import { MongoClient } from 'mongodb'

const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb://127.0.0.1:27017/UG");
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } 
    catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
connectDB();*/

/*const UserSchema = new mongoose.Schema({
    sem: Number,
    subjects : Array
})*/
/*const UserSchema = new mongoose.Schema({
    sno:Number,
    subcode: 
})

const UserModel = mongoose.model("UGCSE",UserSchema)*/

/*
const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    res.render("index.ejs");
});

app.post("/submit",(req,res)=>{
    var name = (req.body["regulation"]+req.body["dept"]).toUpperCase();
    var semester = req.body["sem"];
    console.log(semester);
    try {
        var semester = req.body["sem"];
        console.log(semester);
    
        // MongoDB Node.js Driver code
        const filter = {
          'sem': parseInt(semester)  // Assuming 'sem' is stored as a Number in MongoDB
        };
    
        const client = await MongoClient.connect('mongodb://localhost:27017/');
        const coll = client.db('UG').collection('UGCSE');
        const cursor = coll.find(filter);
        const result = await cursor.toArray();
        await client.close();
    
        console.log(result);
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});*/

import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from 'mongodb';

const connectDB = (department) => {
    return MongoClient.connect(`mongodb://127.0.0.1:27017/UG`);
};

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/submit", (req, res) => {
    try {
        //console.log(req.body);
        var reg = req.body["regulation"].toUpperCase();
        var semester = req.body["sem"];
        //console.log(semester);
        var department = reg+req.body["dept"].toUpperCase();
        //console.log(department);

        connectDB(department)
            .then(client => {
                const filter = {
                    'sem': parseInt(semester, 10)
                };

                const coll = client.db('UG').collection(`UG${department}`);
                const cursor = coll.find(filter);

                return cursor.toArray();
            })
            .then(result => {
                //console.log(JSON.stringify(result));
                //console.log(result[0].subjects);
                //console.log(result[0].subjects[1]);
                res.render("index.ejs",{data: result[0].subjects})
                //res.json(result);
            })
            .catch(err => {
                console.error(err);
                
                res.status(500).json({ error: err.message });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
