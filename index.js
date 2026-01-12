const express= require('express');
const app = express();
const port = 8080;
const main = require('./dbConnection');
const listingModel = require('./models/listing');
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

app.get('/sampleListing',async (req,res)=>{
    let sampleListing = new listingModel({
        title: "Beautiful Beach House",
        description: "A lovely beach house with stunning ocean views.",
        image: "",
        price: 250,
        location: "Malibu",
        country: "USA"
    });
    await sampleListing.save();
    res.send("Sample listing saved to database");
    
})

app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});