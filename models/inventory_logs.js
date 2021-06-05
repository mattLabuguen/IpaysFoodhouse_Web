const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryLogsSchema = new Schema(
    {
        "inventoryLogDate":{
            type: Schema.Types.Date,
            required: true
        },
        "inventoryItemName":{
            type: String,
            required: true,
        },
        "inventoryItemUnitMeasure":{
            type: String,
            required: true,
        },
        "inventoryItemAmount":{
            type: Schema.Types.Decimal128,
            required: true,
        },
        "inventoryLogReason":{
            type: String,
            required: true,
        },
    }, {timestamps: true}
);

const InventoryLogsData = mongoose.model('inventory_logs', inventoryLogsSchema);
module.exports = InventoryLogsData;