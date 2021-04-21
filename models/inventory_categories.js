const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryCategoriesSchema = new Schema(
    {
        "categoryArray":{
            type: Array,
            required: true
        },
    }, {timestamps: true}
);

const InventoryCategoriesData = mongoose.model('inventory_categories', inventoryCategoriesSchema);
module.exports = InventoryCategoriesData;