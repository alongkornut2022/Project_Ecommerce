const utils = require('util');
const cloudinary = require('cloudinary').v2;

exports.upload = utils.promisify(cloudinary.uploader.upload);
exports.destroy = utils.promisify(cloudinary.uploader.destroy);
