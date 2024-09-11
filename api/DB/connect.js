const mongoose = require('mongoose');

const connect = async () =>{
    try {
        await mongoose.connect(process.env.DB)
        .then(() => console.log('mongoose connect success')
        )
    } catch (error) {
        
        console.log('mongoose connect faild', error);
        
    }
}

module.exports = connect