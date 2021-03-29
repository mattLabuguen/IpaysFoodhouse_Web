const express = require('express');
const app = express();

const get = require('http');
const path = require('path');

const bodyParser = require('body-parser');  

const MenuItemData = require('./models/menu_inventory');
const mongoose = require('mongoose');

const db_uri = "mongodb+srv://ipay:p4$$w0rd@ipaysfoodhousedb.2hpwq.mongodb.net/InventoryDB?retryWrites=true&w=majority"
    
mongoose.connect(db_uri, { useNewUrlParser: true , useUnifiedTopology: true}).then((result) => console.log("Connected to Menu Inventory DB")).catch((err) => console.log("error: " + err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.get('/', function (req, res){
    res.render('index', {pageTitle: "Home"});
})

app.get('/menu_inventory', function (req, res){
    MenuItemData.find().then(result =>{
        console.log(result);
        res.render('index', {pageTitle: "Menu Inventory", tableData: result});
        }).catch(error =>{
    console.log("View Table Error: " + error);
    });
})

app.get('/ingredients_inventory', function (req, res){
    res.render('index', {pageTitle: "Ingredients Inventory"});
})

app.post('/addNewProduct', function(req,res){
    const menuItem = new MenuItemData({
        menuImage: req.body.menuImage,
        menuCategory: req.body.menuCategory,
        menuName: req.body.menuName,
        menuPrice: parseFloat(req.body.menuPrice),
        menuStatus: false
    });

    menuItem.save().then(result =>{
        console.log("Added: " + result);

        MenuItemData.find().then(result =>{
            console.log(result);
            res.render('index', {pageTitle: "Menu Inventory", tableData: result});
            }).catch(error =>{
        console.log("View Table Error: " + error);
        });
    }).catch(error => {console.log(error)});
})

app.listen(3000);

// mongodb+srv://user:<password>@ipaysfoodhousedb.2hpwq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority