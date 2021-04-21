const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuCategoriesSchema = new Schema(
    {
        "categoryArray":{
            type: Array,
            required: true
        },
    }, {timestamps: true}
);

const MenuCategoryData = mongoose.model('menu_categories', menuCategoriesSchema);
module.exports = MenuCategoryData;