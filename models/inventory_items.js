const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryItemSchema = new Schema(
    {
        "inventoryStockInDate":{
            type: Schema.Types.Date,
            required: true
        },
        "inventoryItemName":{
            type: String,
            required: true,
        },
        "inventoryItemSupplier":{
            type: String,
            required: true,
        },
        "inventoryItemCategory":{
            type: String,
            required: true,
        },
        "inventoryItemUnit":{
            type: String,
            required: true,
        },
        "inventoryItemBefore":{
            type: Schema.Types.Decimal128,
            required: true,
        },
        "inventoryItemSold":{
            type: Schema.Types.Decimal128,
            required: false,
        },
        "inventoryItemEnding":{
            type: Schema.Types.Decimal128,
            required: false,
        },
    }, {timestamps: true}
);

const InventoryItemsData = mongoose.model('inventory_items', inventoryItemSchema);
module.exports = InventoryItemsData;