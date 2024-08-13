const mongoose = require('mongoose');
const imgModel = require('../imgModel');
const connectDb = require('../dbConnect');

const clearDataExceptLast = async () => {
    try{
        await connectDb()
        await imgModel.deleteMany();
            console.log('Cleared all data');
    }
    catch(error){
        console.error('Error clearing data:', error);
        process.exit(1);
    }
    finally {
        
        await mongoose.disconnect();
    }
}

clearDataExceptLast();