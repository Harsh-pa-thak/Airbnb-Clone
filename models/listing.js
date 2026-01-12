const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true
    },
    image:{
        type : String,
        set: (v)=> v===""?"https://unsplash.com/photos/a-pool-of-water-surrounded-by-rocks-and-trees-zo_udYMcaVc":v
    },
    price:{
        type : Number,
        required : true
    },
    location:{
        type : String
    },
    country:{
        type : String
    }
});
module.exports = mongoose.model('Listing',listingSchema);

