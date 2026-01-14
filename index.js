const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.use(express.json());
app.set("view engine", "ejs");
app.set('views',path.join(__dirname,'/views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:8080"
  );
  next();
});

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.get('/listings',(req,res)=>{
  Listing.find({}).then((list)=>{
  res.render('listings',{listings:list});
  console.log(list);
  }
  ).catch((err)=>{
    console.log(err);
  });
  
});

app.get('/newListing',(req,res)=>{
  res.render('newListing');
});
app.post('/listings',async (req,res)=>{
  const {title,description,price,location,country,imageUrl} = req.body;
  const newListing = new Listing({
    title: title,
    description: description,
    image: imageUrl,
    price: price,
    location: location,
    country: country
  });
  
  await newListing.save();
  res.redirect('/listings');
});
app.get("/editListings/:id",async(req,res)=>{
  const id = req.params.id;
  const listing = await Listing.findById(id);
  res.render('editListing',{listing});
});
app.put("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const {title,description,price,location,country,imageUrl} = req.body;

  await Listing.findByIdAndUpdate(id,{
    title,
    description,
    image: imageUrl,
    price,
    location,
    country
  });

  res.redirect('/listings');
});


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});