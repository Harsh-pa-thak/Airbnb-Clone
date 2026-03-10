const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});
const storage = CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Wanderlust',
        allowed_formats:['jpeg', 'png', 'jpg']
    }
});
module.exports = {cloudinary, storage};
