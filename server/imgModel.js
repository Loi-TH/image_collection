const mongoose = require("mongoose");

const imgSchema = mongoose.Schema({
    base64: {
        type: String,
        require: [true,"Need Base64"]
    }
},{
    timestamps: true,
})

module.exports = mongoose.model("img", imgSchema);