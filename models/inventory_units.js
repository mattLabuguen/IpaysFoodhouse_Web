const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryUnitsSchema = new Schema(
    {
        "unitArray":{
            type: Array,
            required: true
        },
    }, {timestamps: true}
);

const InventoryUnitsData = mongoose.model('inventory_units', inventoryUnitsSchema);
module.exports = InventoryUnitsData;