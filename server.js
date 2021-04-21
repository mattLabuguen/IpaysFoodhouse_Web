const express = require('express');
const app = express();

const get = require('http');
const path = require('path');

const bodyParser = require('body-parser');  

const MenuItemData = require('./models/menu_inventory');
const MenuCategoryData = require('./models/menu_categories');

const InventoryItemsData = require('./models/inventory_items');
const InventoryCategoriesData = require('./models/inventory_categories');
const InventoryUnitsData = require('./models/inventory_units');

const mongoose = require('mongoose');
const e = require('express');

const db_uri = "mongodb+srv://ipay:p4$$w0rd@ipaysfoodhousedb.2hpwq.mongodb.net/InventoryDB?retryWrites=true&w=majority"
    
mongoose.connect(db_uri, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false }).then((result) => console.log("Connected to Inventory DB")).catch((err) => console.log("error: " + err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.get('/', function (req, res){
    res.render('index', {pageTitle: "Home"});
})

app.get('/orderEntry', function (req,res){

})

//Menu Inventory
app.get('/menu_inventory', function (req, res){
    MenuCategoryData.find().then(result =>{
        var categoryData = result;
        MenuItemData.find().then(result =>{
            res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
            }).catch(error =>{
            console.log("View Table Error: " + error);
        });
    }).catch(error =>{console.log("Get Categories Error: " + error);});
})

app.post('/addNewProduct', function(req,res){
    console.log(req.body);
    const menuItem = new MenuItemData({
        menuImage: req.body.menuImage,
        menuCategory: req.body.menuCategory,
        menuName: req.body.menuName,
        menuPrice: parseFloat(req.body.menuPrice),
        menuStatus: false
    });

    menuItem.save().then(result =>{
        console.log("Added: " + result);
        MenuCategoryData.find().then(result =>{
            var categoryData = result;
            MenuItemData.find().then(result =>{
                res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
                }).catch(error =>{
                console.log("View Table Error: " + error);
            });
        }).catch(error =>{console.log("Get Categories Error: " + error);});
    }).catch(error => {console.log(error)});
})

app.post('/removeProduct', function(req,res){
    console.log(req.body.toBeRemovedItem);
    if(typeof req.body.toBeRemovedItem == "string"){
        MenuItemData.deleteOne({_id: req.body.toBeRemovedItem}).then(result =>{
            console.log("Deleted: " + result);
        }).catch(error=>{console.log("Delete Error: " + error)});
    }else{
        for(itemID of req.body.toBeRemovedItem){
            MenuItemData.deleteOne({_id: itemID}).then(result =>{
                console.log("Deleted Object: " + itemID);
            }).catch(error=>{console.log("Delete Error: " + error)});
        }
    }
    MenuCategoryData.find().then(result =>{
        var categoryData = result;
        MenuItemData.find().then(result =>{
            res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
            }).catch(error =>{
            console.log("View Table Error: " + error);
        });
    }).catch(error =>{console.log("Get Categories Error: " + error);});
})

app.post('/editProduct', function(req, res){
    var editedData = {
        menuImage: req.body.editMenuImage,
        menuCategory: req.body.editMenuCategory,
        menuName: req.body.editMenuName,
        menuPrice: parseFloat(req.body.editMenuPrice),
        menuStatus: false
    };

    var editID = req.body.updateID;

    MenuItemData.findOneAndUpdate({_id: editID}, editedData, {new: true}).then(result =>{
        MenuCategoryData.find().then(result =>{
            var categoryData = result;
            MenuItemData.find().then(result =>{
                res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
                }).catch(error =>{
                console.log("View Table Error: " + error);
            });
        }).catch(error =>{console.log("Get Categories Error: " + error);});
    });
    
});

app.post('/editMenuCategory', function(req,res){    
    var toReplace = req.body.categories;
    console.log(toReplace);
    MenuCategoryData.deleteMany({}).then(result =>{
        console.log("Deleted: " + result);
        const menuCategory = new MenuCategoryData({
            categoryArray: toReplace
        });

        menuCategory.save().then(result =>{
            console.log("Added: " + result);
            MenuCategoryData.find().then(result =>{
                var categoryData = result;
                MenuItemData.find().then(result =>{
                    res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
                    }).catch(error =>{
                    console.log("View Table Error: " + error);
                });
            }).catch(error =>{console.log("Get Categories Error: " + error);});
        }).catch(error => {console.log(error)});

    });
});

app.post('/updateStatus', function(req,res){
    var selectedID = req.body.updateID;
    var currentStatus = req.body.updateStatus; // Returning a string instead of a boolean.

    if(currentStatus == "true") currentStatus = false;
    else if(currentStatus == "false") currentStatus = true;

    MenuItemData.findOneAndUpdate({_id: selectedID}, { menuStatus: currentStatus }, {new: true}).then(result =>{
        MenuCategoryData.find().then(result =>{
            var categoryData = result;
            MenuItemData.find().then(result =>{
                res.render('index', {pageTitle: "Menu Management", tableData: result, categories: categoryData});
                }).catch(error =>{
                console.log("View Table Error: " + error);
            });
        }).catch(error =>{console.log("Get Categories Error: " + error);});
    });
});


//Ingredients Inventory 
app.get('/ingredients_inventory', function (req, res){
    InventoryCategoriesData.find().then(result =>{
        var categoryData = result;
        InventoryUnitsData.find().then(result=>{
            var unitData = result;
            InventoryItemsData.find().then(result =>{
                res.render('index', {pageTitle: "Inventory Management", tableData: result, categories: categoryData, units: unitData});
                }).catch(error =>{
                console.log("View Table Error: " + error);
            });
        })
    });
})

app.post('/stockInInvoice', function (req,res){
    console.log(req.body);
    if(typeof req.body.inventoryName == "string"){
        const inventoryItem = new InventoryItemsData({
            inventoryStockInDate: req.body.inventoryPurchaseDate,
            inventoryItemName: req.body.inventoryName,
            inventoryItemSupplier: req.body.inventorySupplier,
            inventoryItemCategory: req.body.inventoryCategory,
            inventoryItemUnit: req.body.inventoryUnit,
            inventoryItemBefore: req.body.inventoryQuantity
        });

        inventoryItem.save().then(result=>{
            console.log("Added: " + result);
            InventoryCategoriesData.find().then(result =>{
                var categoryData = result;
                InventoryUnitsData.find().then(result=>{
                    var unitData = result;
                    InventoryItemsData.find().then(result =>{
                        res.render('index', {pageTitle: "Inventory Management", tableData: result, categories: categoryData, units: unitData});
                        }).catch(error =>{
                        console.log("View Table Error: " + error);
                    });
                })
            });
        });
    }else{
        var itemArray = [];
        for(i = 0; i < req.body.inventoryName.length; i++){
            itemArray.push({
                inventoryStockInDate: req.body.inventoryPurchaseDate,
                inventoryItemName: req.body.inventoryName[i],
                inventoryItemSupplier: req.body.inventorySupplier[i],
                inventoryItemCategory: req.body.inventoryCategory[i],
                inventoryItemUnit: req.body.inventoryUnit[i],
                inventoryItemBefore: req.body.inventoryQuantity[i]
            });
        }

        InventoryItemsData.insertMany(itemArray).then(result =>{
            console.log("Added: " + result);
            InventoryCategoriesData.find().then(result =>{
                var categoryData = result;
                InventoryUnitsData.find().then(result=>{
                    var unitData = result;
                    InventoryItemsData.find().then(result =>{
                        res.render('index', {pageTitle: "Inventory Management", tableData: result, categories: categoryData, units: unitData});
                        }).catch(error =>{
                        console.log("View Table Error: " + error);
                    });
                })
            });
        }).catch(error=>{console.log("Insert Many Inventory Error: " + error)});
    }

});

app.post('/editInventoryCategory', function(req, res){
    var toReplace = req.body.categories;
    console.log(toReplace);
    InventoryCategoriesData.deleteMany({}).then(result =>{
        console.log("Deleted: " + result);
        const ingredientsCategory = new InventoryCategoriesData({
            categoryArray: toReplace
        });

        ingredientsCategory.save().then(result =>{
            console.log("Added: " + result);
            InventoryCategoriesData.find().then(result =>{
                var categoryData = result;
                InventoryUnitsData.find().then(result=>{
                    var unitData = result;
                    InventoryItemsData.find().then(result =>{
                        res.render('index', {pageTitle: "Inventory Management", tableData: result, categories: categoryData, units: unitData});
                        }).catch(error =>{
                        console.log("View Table Error: " + error);
                    });
                });
            }).catch(error =>{console.log("Get Categories Error: " + error);});
        }).catch(error => {console.log(error)});

    });
});

app.post('/editInventoryUnits', function(req,res){
    var toReplace = req.body.units;
    console.log(toReplace);

    InventoryUnitsData.deleteMany({}).then(result =>{
        console.log("Deleted: " + result);
        const inventoryUnit = new InventoryUnitsData({
            unitArray: toReplace
        });

        inventoryUnit.save().then(result =>{
            console.log("Added: " + result);
            InventoryCategoriesData.find().then(result =>{
                var categoryData = result;
                InventoryUnitsData.find().then(result=>{
                    var unitData = result;
                    InventoryItemsData.find().then(result =>{
                        res.render('index', {pageTitle: "Inventory Management", tableData: result, categories: categoryData, units: unitData});
                        }).catch(error =>{
                        console.log("View Table Error: " + error);
                    });
                });
            }).catch(error =>{console.log("Get Categories Error: " + error);});
        }).catch(error => {console.log(error)});

    });
});

app.listen(3000);
