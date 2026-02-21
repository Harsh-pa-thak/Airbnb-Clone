const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const CustomError= require("./utils/customError.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const session = require("express-session");
const { date } = require("joi");

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
    "default-src 'self'; img-src 'self' https:; style-src 'self' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;"
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
const sessionOptions={
  secret:"abcdefghijklmnopqrsdjdfhgu",
  resave:false,
  saveUninitialized:true,
  
  cookie:{
    httpOnly:true,
    expireDate: date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }  
}
app.use(session(sessionOptions));




app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", require("./routes/listings.js"));
app.use("/listings/:id/reviews", require("./routes/reviews.js"));

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
