const express = require('express');
const app = express();

const get = require('http');
const path = require('path');

const bodyParser = require('body-parser');  
const convert = require('convert-units');

const MenuItemData = require('./models/menu_list');
const MenuCategoryData = require('./models/menu_categories');

const InventoryItemsData = require('./models/inventory_items');
const InventoryCategoriesData = require('./models/inventory_categories');
const InventoryUnitsData = require('./models/inventory_units');

const InventoryLogs = require('./models/inventory_logs');

const OrdersData = require('./models/orders');

const mongoose = require('mongoose');
const e = require('express');
const { update } = require('./models/menu_list');
const InventoryLogsData = require('./models/inventory_logs');

const db_uri = "mongodb+srv://ipay:p4$$w0rd@ipaysfoodhousedb.2hpwq.mongodb.net/InventoryDB?retryWrites=true&w=majority"
    
mongoose.connect(db_uri, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false }).then((result) => console.log("Connected to Inventory DB")).catch((err) => console.log("error: " + err));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.get('/', function (req, res){
    res.render('index', {pageTitle: "Home"});
})

//Go to order entry menu and get menu list and category data.
app.get('/order_entry', function (req,res){
    MenuCategoryData.find().then(result =>{
        var categoryData = result;
        MenuItemData.find().then(result =>{
            res.render('order_entry', {pageTitle: "Order Entry", menuData: result, categories: categoryData});
            }).catch(error =>{
                console.log("View Table Error: " + error);
            });
    }).catch(error =>{
        console.log("Get Categories Error: " + error);
    });
});
//Go to menu management page and get menu list and category data.
app.get('/menu_management', function (req, res){
    res.render('index', {pageTitle: "Menu Management"});
});
//Go to inventory management page and get inventory list and category data.
app.get('/inventory_management', function (req, res){
    res.render('index', {pageTitle: "Inventory Management"});
});
//Pending kitchen order tickets page
app.get('/pending_kot', function (req,res){
    res.render('index', {pageTitle: "Kitchen Order Tickets"});
})
//Completed kitchen order tickets page
app.get('/completed_kot', function (req,res){
    res.render('index', {pageTitle: "Cooked K.O.T."});
})
//Completed kitchen order tickets page
app.get('/order_management', function (req,res){
    res.render('index', {pageTitle: "Order List"});
})
//Completed kitchen order tickets page
app.get('/inventory_logs', function (req,res){
    res.render('index', {pageTitle: "Inventory Logs"});
})

// MENU MANAGEMENT REQUESTS

//Get menu list data.
app.get('/menu_list', function(req, res){
    MenuItemData.find().then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Menu Items Error: " + error);});
});
//Get active menu list data.
app.get('/active_menu_list', function(req, res){
    MenuItemData.find({menuStatus: true}).then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Active Menu Items Error: " + error);});
});
//Get menu category data.
app.get('/menu_category', function(req, res){
    MenuCategoryData.find().then(result =>{
        res.send(result);
    }).catch(error =>{console.log("Get Categories Error: " + error);});
});
//Get recipe of a menu item.
app.get('/getRecipe', function(req, res){
    MenuItemData.find({ _id:  req.query.id}).then(result=>{
        res.send(result[0]["menuRecipe"]);
    });
});
//Search through menu list.
app.get('/search_menu', function(req,res){
    MenuItemData.find({ menuName: { $regex : new RegExp(req.query.value, "i") }}).then(result=>{
        res.send(result);
    });
});
//Add new menu item to menu list.
app.post('/addMenuItem', function(req,res){
    console.log(req.body);
    const menuItem = new MenuItemData(req.body);
    menuItem.save().then(result =>{
        console.log("Added: " + result);
        res.redirect('/menu_management');
    }).catch(error => {console.log(error)});
});
//Remove selected menu items from menu list.
app.post('/removeMenuItem', function(req,res){
    console.log(req.body.toBeRemoved);
    for(id of req.body.toBeRemoved){
        MenuItemData.deleteOne({_id: id}).then(result =>{
            console.log("Deleted: " + result["menuName"]);
        }).catch(error=>{console.log("Delete Error: " + error)});
    };
    res.redirect("/menu_management");
});
//Edit selected menu item
app.post('/editMenuItem', function(req, res){
    console.log(req.body);
    var editedData = req.body.toBeEditedItem;
    var editID = req.body.toBeEditedID;

    MenuItemData.findOneAndUpdate({_id: editID}, editedData, {new: true}).then(result =>{
        console.log("Edited: " + result);
        res.redirect('/menu_management');
    });
    
});
//Edit Menu Categories
app.post('/editMenuCategory', function(req,res){    
    var newCategories = req.body.editedCategories;
    console.log(newCategories);

    MenuCategoryData.updateMany({}, { $set: { categoryArray: newCategories }}).then(result =>{
        console.log(result);
        res.redirect('/menu_management');
    });
});
//Update the status of a menu item.
app.post('/updateStatus', function(req,res){
    var selectedID = req.body.updateID;
    var currentStatus = req.body.updateStatus; // Returning a string instead of a boolean.

    if(currentStatus == "true") currentStatus = false;
    else if(currentStatus == "false") currentStatus = true;

    MenuItemData.findOneAndUpdate({_id: selectedID}, { menuStatus: currentStatus }, {new: true}).then(result =>{
        res.redirect('/menu_management');
    });
});
//Edit recipe of menu item.
app.post('/editRecipe', function(req, res){
    console.log(req.body.recipeArray);
    MenuItemData.findOneAndUpdate({_id: req.body.itemID}, { menuRecipe: req.body.recipeList , menuStatus: false}, {new: true}).then(result =>{
        console.log(result);
        res.redirect('/menu_management');
    });

});

// INVENTORY MANAGEMENT REQUESTS

// Get inventory list
app.get('/inventory_list', function(req, res){
    InventoryItemsData.find().then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Inventory Items Error: " + error);});
});
// Get inventory search list
app.get('/search_inventory', function(req, res){
    InventoryItemsData.find({ inventoryItemName: { $regex : new RegExp(req.query.value, "i") }}).then(result=>{
        console.log(result);
        res.send(result);
    });
});
// Get inventory categories
app.get('/inventory_categories', function(req, res){
    InventoryCategoriesData.find().then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Inventory Catgories Error: " + error);});
})
// Get inventory units
app.get('/inventory_units', function(req, res){
    var massUnits = [];
    var volumeUnits = [];
    var miscUnits = [];
    for(item of convert().list('mass')) {
        if(!(item["abbr"] == "t" || item["abbr"] == "mcg" || item["abbr"] == "mt")) massUnits.push(item);
    }

    for(item of convert().list('volume')) {
        if(!(item["abbr"] == "mm3" || item["abbr"] == "cm3" || item["abbr"] == "m3" || item["abbr"] == "km3" || item["abbr"] == "in3" || 
        item["abbr"] == "ft3" || item["abbr"] == "yd3" || item["abbr"] == "cl" || item["abbr"] == "dl" || item["abbr"] == "kl" || item["abbr"] == "krm" ||
        item["abbr"] == "tsk" || item["abbr"] == "msk" || item["abbr"] == "kkp" || item["abbr"] == "kanna" || item["abbr"] == "glas"))
        volumeUnits.push(item);
    };

    miscUnits.push({abbr: 'pkg', measure: 'miscellaneous', singular: 'Package', plural: 'Packages'});
    miscUnits.push({abbr: 'pcs', measure: 'miscellaneous', singular: 'Piece', plural: 'Pieces'});

    res.send({mass: massUnits, volume: volumeUnits, misc: miscUnits});
})
// Stock in new items
app.post('/stockInInvoice', function (req,res){ 
    req.body.stockInItems.forEach(function(item, i){
        const newInventoryItem = new InventoryItemsData(item);
        var today = new Date();
        const stockInLog = new InventoryLogs({
            inventoryLogDate: today,
            inventoryItemName: item["inventoryItemName"],
            inventoryItemUnitMeasure: item["inventoryItemUnitMeasure"],
            inventoryItemAmount: item["inventoryItemEnding"],
            inventoryLogReason: "Stock-in new item. [Inventory Management]",
        });
        
        stockInLog.save().then(result=>{console.log("Log:", result)});

        newInventoryItem.save().then(result =>{
            console.log("Added: " + result);
            stockInLog.save().then(result=>{console.log("Log:", result)});
            res.redirect('/inventory_management');
        }).catch(error => {console.log(error)});
    });
});
// Manually stock out items with pieces/packages as units.
app.post('/outgoingMisc', function(req, res){
    var itemName = req.body.itemName;
    var itemQuantity = req.body.itemQuantity;
    var reason = req.body.reason;

    InventoryItemsData.findOne({inventoryItemName: itemName}).then(result =>{
        var used = parseFloat(result["inventoryItemUsed"]) + parseFloat(itemQuantity);
        var ending = parseFloat(result["inventoryItemEnding"]) - parseFloat(itemQuantity);
        var itemAmount = parseFloat(ending) / parseFloat(result["inventoryItemUnitQuantity"]);

        InventoryItemsData.findOneAndUpdate({_id: result["_id"]},{
            inventoryItemAmount: itemAmount,
            inventoryItemUsed: used,
            inventoryItemEnding: ending,
        }, {new:true})
        .then(result =>{
            var today = new Date();

            const stockInLog = new InventoryLogs({
                inventoryLogDate: today,
                inventoryItemName: itemName,
                inventoryItemUnitMeasure: result["inventoryItemUnitMeasure"],
                inventoryItemAmount: parseFloat(itemQuantity) * -1,
                inventoryLogReason: reason + " [Inventory Management]",
            });

            stockInLog.save().then(result=>{console.log("Log:", result)});

            res.redirect('/inventory_management');
        });
    });
});
// Manually stock out items with standardized units.
app.post('/outgoingUnits', function(req,res){
    var itemName = req.body.itemName;
    var itemQuantity = req.body.itemQuantity;
    var itemMeasure = req.body.itemMeasure;
    
    InventoryItemsData.findOne({inventoryItemName: itemName}).then(result =>{
        var converted = parseFloat(convert(itemQuantity).from(itemMeasure).to(result["inventoryItemUnitMeasure"]));
        var used = parseFloat(result["inventoryItemUsed"]) + converted;
        var ending = parseFloat(result["inventoryItemEnding"]) - parseFloat(itemQuantity);
        var itemAmount = parseFloat(ending) / parseFloat(result["inventoryItemUnitQuantity"]);

        InventoryItemsData.findOneAndUpdate({_id: result["_id"]},{
            inventoryItemAmount: itemAmount,
            inventoryItemUsed: used,
            inventoryItemEnding: ending,
        }, {new: true}).then(result =>{
            var today = new Date();

            const stockInLog = new InventoryLogs({
                inventoryLogDate: today,
                inventoryItemName: itemName,
                inventoryItemUnitMeasure: result["inventoryItemUnitMeasure"],
                inventoryItemAmount: converted  * -1,
                inventoryLogReason: reason + " [Inventory Management]",
            });

            stockInLog.save().then(result=>{console.log("Log:", result)});
            res.redirect('/inventory_management');
        });
    });
});
// Restock an already existing item.
app.post('/restockItems', function(req, res){
    var itemName = req.body.itemName;
    var itemAmount = req.body.itemAmount;

    InventoryItemsData.findOne({inventoryItemName: itemName}).then(result =>{
        var newStock = parseFloat(result["inventoryItemUnitQuantity"]) * parseFloat(itemAmount);
        var used = parseFloat(result["inventoryItemUsed"]) - parseFloat(newStock);
        var ending = parseFloat(result["inventoryItemEnding"]) + parseFloat(newStock);
        var newAmount = parseFloat(result["inventoryItemAmount"]) + parseFloat(itemAmount);

        InventoryItemsData.findOneAndUpdate({_id: result["_id"]}, {
            inventoryItemAmount: newAmount,
            inventoryItemUsed: used,
            inventoryItemEnding: ending,
        }, {new: true}).then(result =>{
            var today = new Date();
            const stockInLog = new InventoryLogs({
                inventoryLogDate: today,
                inventoryItemName: itemName,
                inventoryItemUnitMeasure: result["inventoryItemUnitMeasure"],
                inventoryItemAmount: newStock,
                inventoryLogReason: "Restocked " + item["inventoryItemName"] + ". [Inventory Management]",
            });
            
            stockInLog.save().then(result=>{console.log("Log:", result)});
            res.redirect('/inventory_management');
        });
    });
})
// Check if an item is in stock
app.get('/checkInStock', function (req,res){
    InventoryItemsData.findOne({inventoryItemName: req.query.name}).then(result=>{
        if(result == null) res.send(false);
        else res.send(true);
    });
})
// Check if item has remaining stock
app.get('/remainingStock', function (req,res){
    InventoryItemsData.findOne({inventoryItemName: req.query.name}).then(result=>{
        var outgoingStock;
        if(req.query.measure == "pcs" || req.query.measure == "pkg") {
            outgoingStock = parseFloat(req.query.quantity);
        }
        else outgoingStock = parseFloat(convert(req.query.quantity).from(req.query.measure).to(result["inventoryItemUnitMeasure"]));
        
        if(outgoingStock > parseFloat(result["inventoryItemEnding"])) res.send(false);
        else if(outgoingStock <= 0) res.send(false);
        else res.send(true);
    });
})
// Get unit measures list.
app.get('/unitMeasure', function(req, res){
    var massUnits = [];
    var volumeUnits = [];

    if(convert().describe(req.query.measure)["measure"] == "mass"){
        for(item of convert().list('mass')) if(!(item["abbr"] == "t" || item["abbr"] == "mcg" || item["abbr"] == "mt")) massUnits.push(item)
        res.send(massUnits);
    }else if(convert().describe(req.query.measure)["measure"] == "volume"){
        for(item of convert().list('volume')) {
            if(!(item["abbr"] == "mm3" || item["abbr"] == "cm3" || item["abbr"] == "m3" || item["abbr"] == "km3" || item["abbr"] == "in3" || 
            item["abbr"] == "ft3" || item["abbr"] == "yd3" || item["abbr"] == "cl" || item["abbr"] == "dl" || item["abbr"] == "kl" || item["abbr"] == "krm" ||
            item["abbr"] == "tsk" || item["abbr"] == "msk" || item["abbr"] == "kkp" || item["abbr"] == "kanna" || item["abbr"] == "glas"))
            volumeUnits.push(item);
        };
        res.send(volumeUnits);
    }
});
// Edit the Inventory Categories list.
app.post('/editInventoryCategory', function(req, res){
    var newCategories = req.body.editedCategories;
    console.log(newCategories);

    InventoryCategoriesData.updateMany({}, { $set: { categoryArray: newCategories }}).then(result =>{
        console.log(result);
        res.redirect('/inventory_management');
    });
});


// ORDER ENTRY REQUESTS

//Send order to K.O.T.
app.post('/sendOrder', function(req,res){
    const orderItem = new OrdersData(req.body);
    orderItem.save().then(result =>{
        res.redirect('/order_entry');
    }).catch(error => {console.log(error)});
});
//Convert units
app.get('/convertUnits', async function(req,res){
    var id = req.query.id;
    var quantity = req.query.quantity;
    var deductionList = [];
    var menuRecipeList;
    var menuPromise = getMenuRecipe(id).then((result) => {return result});

    var getMenuRecipe = async() => {
        var menuItem = await menuPromise;
        return menuItem[0]["menuRecipe"];
    };

    menuRecipeList = await getMenuRecipe();
    for(recipeItem of menuRecipeList){
        var unitMeasure;
        var inventoryPromise = getInventoryItem(recipeItem["itemName"]).then(result => {return result});

        var getInventoryUnitMeasure = async() =>{
            var inventoryItem = await inventoryPromise;
            return inventoryItem[0]["inventoryItemUnitMeasure"];
        }

        unitMeasure = await getInventoryUnitMeasure();
        var converted = parseFloat(convert(recipeItem["itemQuantity"]).from(recipeItem["itemUnit"]).to(unitMeasure)) * quantity; 
        deductionList.push({itemName: recipeItem["itemName"], itemQuantity: converted});
    };

    res.send(deductionList);

    function getMenuRecipe(id){
        var menuPromise = MenuItemData.find({_id:id}).exec();
        return menuPromise;
    }

    function getInventoryItem(name){
        var inventoryPromise = InventoryItemsData.find({inventoryItemName: name}).exec();
        return inventoryPromise;
    }

})
//Check if enough stock
app.get('/checkStock', function(req,res){
    MenuItemData.findOne({_id: req.query.id}).then(result=>{
        var menuItemQuantity = req.query.quantity;
        
        result["menuRecipe"].forEach(function(recipeItem, i){
            var recipeItemName = recipeItem["itemName"];
            var recipeItemUnit = recipeItem["itemUnit"];
            var recipeItemQuantity = recipeItem["itemQuantity"];
        });
    });
});
//Apply the temporary changes to inventory stock.
app.post('/applyTemporary', function(req,res){
    var id =  mongoose.Types.ObjectId(req.body.id);
    var ending = req.body.ending; 
    var used = req.body.used; 
    var amount = req.body.amount;
    var reason = req.body.reason;

    InventoryItemsData.findOne({_id: id, inventoryItemUsed: {$ne: used}}).then(result=>{
        if(result != null){ 
            
            InventoryItemsData.findOneAndUpdate({_id: result["_id"]}, {inventoryItemAmount: amount, inventoryItemEnding: ending, inventoryItemUsed: used}, {new: true}).then(result=>{});
            var today = new Date();
            if(used > result["inventoryItemUsed"]){
                var deduction = result["inventoryItemAmount"] - amount;
                const stockInLog = new InventoryLogs({
                    inventoryLogDate: today,
                    inventoryItemName: result["inventoryItemName"],
                    inventoryItemUnitMeasure: result["inventoryItemUnitMeasure"],
                    inventoryItemAmount: deduction * -1,
                    inventoryLogReason: reason,
                });
                
                stockInLog.save().then(result=>{});
            }else{
                var deduction = amount - result["inventoryItemAmount"];
                const stockInLog = new InventoryLogs({
                    inventoryLogDate: today,
                    inventoryItemName: result["inventoryItemName"],
                    inventoryItemUnitMeasure: result["inventoryItemUnitMeasure"],
                    inventoryItemAmount: deduction,
                    inventoryLogReason: reason,
                });
                
                stockInLog.save().then(result=>{});
            }
        }
    })

})

// KITCHEN ORDER TICKET MANAGEMENT REQUESTS

//Send an order to database.
app.get('/order_list', function(req, res){
    OrdersData.find().then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Order List Error: " + error);});
});
//Change status of entire order.
app.post('/changeOrderStatus', function(req,res){
    var order = req.body.completeOrder;
    var currentStatus = req.body.status; 

    OrdersData.findOneAndUpdate({_id: order}, { orderStatus: currentStatus }, {new: true}).then(result =>{
        res.redirect('/pending_kot');
    });
})
//Change status of an item.
app.post('/changeOrderItemStatus', function(req,res){
    var orderId = req.body.orderId;
    var itemId = req.body.itemId; 
    var status = req.body.status;

    OrdersData.find({_id: orderId}).then(result =>{
        var updatedOrderDetails = JSON.parse(JSON.stringify(result[0]["orderDetails"]));
        for(item of updatedOrderDetails) if(item["orderItem"]["_id"] == itemId) item["orderItemStatus"] = status;

        OrdersData.findOneAndUpdate({_id: orderId}, { orderDetails: updatedOrderDetails }, {new: true}).then(result =>{
            res.redirect('/pending_kot');
        });
    });
})
//Change order item quantity
app.post('/changeOrderItemQuantity', function(req, res){
    var orderId = req.body.orderId;
    var itemId = req.body.itemId; 
    var quantity = req.body.quantity;


    OrdersData.find({_id: orderId}).then(result =>{
        var updatedOrderDetails = JSON.parse(JSON.stringify(result[0]["orderDetails"]));

        for(item of updatedOrderDetails){
            if(item["orderItem"]["_id"] == itemId){
                if(parseInt(quantity) == parseInt(item["orderQuantity"])) item["orderItemStatus"] = "Cancelled";
                else if(parseInt(quantity) < parseInt(item["orderQuantity"])) item["orderQuantity"] -= quantity;
            }
        }

        OrdersData.findOneAndUpdate({_id: orderId}, { orderDetails: updatedOrderDetails }, {new: true}).then(result =>{
            res.redirect('/pending_kot');
        });
    });
})


//INVENTORY LOGS REQUEST

//Get Inventory Log list
app.get('/logs_list', function(req,res){
    InventoryLogsData.find().then(result=>{
        res.send(result);
    }).catch(error =>{console.log("Get Inventory Logs Items Error: " + error);});
})
//Search log items.
app.get('/search_logs', function(req,res){
    InventoryLogsData.find({ inventoryItemName: { $regex : new RegExp(req.query.value, "i") }}).then(result=>{
        console.log(result);
        res.send(result);
    });
})

app.listen(3000);
