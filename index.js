const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const CustomError= require("./utils/customError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https://images.unsplash.com; style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;"
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

app.get("/listings", (req, res) => {
  Listing.find({})
    .then((list) => {
      res.render("listings/listings", { listings: list });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/listing-detail/:id", (req, res) => {
  const id = req.params.id;

  Listing.findById(id)
    .then((listing) => {
      res.render("listings/listing-detail", { listing });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/newListing", (req, res) => {
  res.render("listings/newListing");
});

app.post("/listings", wrapAsync(async (req, res,next) => {
    const {
    title,
    description,
    price,
    location,
    country,
    imageUrl,
  } = req.body;

  const newListing = new Listing({
    title: title,
    description: description,
    image: imageUrl,
    price: price,
    location: location,
    country: country,
  });

  await newListing.save();
  res.redirect("/listings");
}));

app.get("/editListings/:id", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  res.render("listings/editListing", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    price,
    location,
    country,
    imageUrl,
  } = req.body;

  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: imageUrl,
    price,
    location,
    country,
  });

  res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res) => {
  const id = req.params.id;

  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
