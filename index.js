const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
const listingSchema = require('./schema.js').listingSchema;
const reviewSchema = require('./schema.js').reviewSchema;
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

const validate =(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let em = error.details.map(el=>el.message).join(",");
    throw new CustomError(em,400);
  }else{
    next();
  }
}
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new CustomError(msg, 400);
  } else {
    next();
  }
};

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

app.get("/listings/newListings", (req, res) => {
  res.render("listings/newListing");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/listing-detail", { listing });
}));

app.post("/listings", validate, wrapAsync(async (req, res,next) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  res.render("listings/editListing", { listing });
}));

app.put("/listings/:id",validate, wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndUpdate(id, {...req.body}); 
  res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));
app.post('/listings/:id/reviews',validateReview,wrapAsync(async (req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  listing.reviews.push(review);
  await review.save();
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
 
}))

app.delete('/listings/:id/reviews/:reviewId',wrapAsync(async (req,res)=>{
  let {id , reviewId} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));

app.all(/.*/, (req, res, next) => {
  next(new CustomError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("errors", { err });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
