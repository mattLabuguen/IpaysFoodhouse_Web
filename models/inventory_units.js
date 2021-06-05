const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryUnitsSchema = new Schema(
    {
        "massUnits":{
            type: Array,
            required: false
        },
        "volumeUnits":{
            type: Array,
            required: false,
        },
        "miscUnits":{
            type: Array,
            required: false
        }
    }, {timestamps: true}
);

const InventoryUnitsData = mongoose.model('inventory_units', inventoryUnitsSchema);
module.exports = InventoryUnitsData;