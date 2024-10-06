const mongoose = require('mongoose');

const userEconomySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 500, 
    },
    bank: {
        type: Number,
        default: 0, 
    },
    dailyClaimed: {
        type: Date,
        default: null,
    },
    weeklyClaimed: {
        type: Date,
        default: null,
    },
    monthlyClaimed: {  
        type: Date,
        default: null,
    },
}, { timestamps: true });

const UserEconomy = mongoose.model('UserEconomy', userEconomySchema);

module.exports = UserEconomy;
