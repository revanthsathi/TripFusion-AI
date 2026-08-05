const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    hotel: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Hotel",

        default: null

    },

    destination: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Destination",

        default: null

    }

}, {

    timestamps: true

});

module.exports = mongoose.model(

    "Favorite",

    favoriteSchema

);