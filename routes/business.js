const express = require('express');
const router = express.Router();
const business = require('../controllers/business');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBusiness } = require('../middleware');
const multer = require('multer');
const {storage} =  require('../cloudinary');
const upload = multer({storage});



router.route('/')
    .get(catchAsync(business.index))
    .post(isLoggedIn,  upload.array('image'), validateBusiness, catchAsync(business.createBusiness))

router.get('/new', isLoggedIn, business.renderNewForm)

router.route('/:id')
    .get(catchAsync(business.showBusiness))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBusiness, catchAsync(business.updateBusiness))
    .delete(isLoggedIn, isAuthor, catchAsync(business.deleteBusiness));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(business.renderEditForm))

module.exports = router;
