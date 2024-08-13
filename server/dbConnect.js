const mongoose = require("mongoose");

const connectDb = async () => {
    try{
        const connect = await mongoose.connect("mongodb+srv://loi:12345@cluster0.c9jloaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;