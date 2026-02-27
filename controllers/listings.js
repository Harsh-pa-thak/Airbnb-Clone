const Listing = require("../models/listing.js");
module.exports.index =async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/listings", { listings});
};    