
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: 'car-rental-profile-images', // Specify your folder name
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed formats
        transformation: [{ 
            width: 500, 
            height: 500, 
            crop: 'limit',
            gravity: 'face', // Optional: focus on the face
            quality: 'auto:good',
            format: 'jpg' // Default format
        }],

        public_id: (req, file) => {
            const userId = req.user?.id || 'anonymous';
            const timestamp = Date.now();
            return `profile_${userId}_${timestamp}`; // Unique public ID for each upload
        }
    }
})

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 
    } // Limit file size to 5MB
})

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image');
    }
}

module.exports = {
    upload, deleteImage
}