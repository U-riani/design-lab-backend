const express = require('express');
const { getAboutUs, createAboutUs, updateAboutUs } = require('../controllers/aboutUsController');
const { handleImageUpload } = require('../midllewares/imageMiddleware');

const router = express.Router();

router.get('/', getAboutUs);


router.post('/', handleImageUpload,  createAboutUs);


router.patch('/', handleImageUpload, updateAboutUs)


module.exports = router;