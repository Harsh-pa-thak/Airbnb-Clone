const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// passport-local-mongoose v9 exposes the plugin under .default when required from CJS
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true 
    }
})
userSchema.plugin(passportLocalMongoose);
    
module.exports = mongoose.model("User",userSchema);
