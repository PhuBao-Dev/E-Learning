const mongoose = require('mongoose')

async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/F8Education');
        // await mongoose.connect('mongodb+srv://admin:123@sneakerjeeps.vk6bp.mongodb.net/ver1');
        console.log("Successfully Connected");
    } catch (error) {
        console.log("Failure Connected!!!!");
        
    }
}

module.exports = {connect}