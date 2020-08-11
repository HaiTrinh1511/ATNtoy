//var http = require('http');

const express = require('express');
const engines = require('consolidate');
const app = express();

var bodyParser = require("body-parser");
const { ObjectID } = require('mongodb');
app.use(bodyParser.urlencoded({extended: false}));

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

// npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

app.get('/insert', (req,res)=>{
    res.render('insert');
})

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://haitrinh1511:123456789hai@cluster0.w6pg2.mongodb.net/test"

app.post('/doInsert',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let id = req.body.id;
    // let img = req.body.img;
    let description = req.body.description;
    let newProduct = {name : inputName, price : inputPrice, Id : id, Description : description};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("Product").insertOne(newProduct);
    res.redirect('/');
})

app.get('/',async function(req,res){
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('index',{model:result});
})

app.get('/remove', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("Product").deleteOne({_id:ObjectID(id)});
    res.redirect('/');
})

app.get('/doSearch', async(req,res)=>{
    let name_search = req.query.txtSearch;
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let result = await dbo.collection("Product").find({name : name_search}).toArray();
    res.render('index',{model:result});
});

app.get('/contact', async(req,res)=>{
    res.render('contact');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT);
