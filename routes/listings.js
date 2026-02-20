const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const listingSchema = require('../schema.js').listingSchema;
const reviewSchema = require('../schema.js').reviewSchema;
const CustomError= require("../utils/customError.js");

const validate =(req,res,next)=>{
  let {error}= listingSchema.validate(req.body);
  if(error){
    let em = error.details.map(el=>el.message).join(",");
    throw new CustomError(em,400);
  }else{
    next();
  }
}

router.get("/", (req, res) => {
  Listing.find({})
    .then((list) => {
      res.render("listings/listings", { listings: list });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/newListings", (req, res) => {
  res.render("listings/newListing");
});

router.get("/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/listing-detail", { listing });
}));

router.post("/", validate, wrapAsync(async (req, res,next) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect("/listings");
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);

  res.render("listings/editListing", { listing });
}));

router.put("/:id",validate, wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndUpdate(id, {...req.body}); 
  res.redirect("/listings");
}));

router.delete("/:id", wrapAsync(async (req, res) => {
  const id = req.params.id;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

module.exports = router;