const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ordersSchema = new Schema(
    {
        "orderDetails":{
            type: Array,
            required: true
        },
        "orderType":{
            type: String,
            required: true
        },
        "orderTotal":{
            type: Schema.Types.Decimal128,
            required: true,
        },
        "orderStatus":{
            type: String,
            required: true,
        },
        "customerDetails":{
            type: Object,
            required: false,
        },
        "discount":{
            type: Object,
            required: false,
        }
    }, {timestamps: true}
);

const OrdersData = mongoose.model('orders', ordersSchema);
module.exports = OrdersData;