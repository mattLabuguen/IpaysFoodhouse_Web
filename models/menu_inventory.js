const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema(
    {
        "menuImage": {
            type: String,
            required: true
        },
        "menuCategory":{
            type: String,
            required: true
        },
        "menuName":{
            type: String,
            required: true
        },
        "menuPrice":{
            type: Schema.Types.Decimal128,
            required: true
        },
        "menuStatus": {
            type: Boolean,
            required: true
        },
    }, {timestamps: true}
);


const MenuItemData = mongoose.model('menu_inventory', menuItemSchema);
module.exports = MenuItemData;