const Business = require('../models/business');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const business = await Business.find({});
    res.render('businesses/index', { business })
}

module.exports.renderNewForm = (req, res) => {
    res.render('businesses/new');
}

module.exports.createBusiness = async (req, res, next) => {
    //MAPS PART
    //get the location coordinates using this function: await geocoder.forwardGeocode({query: req.body.business.location, limit: 1}).send() and set that equal to a variable ex: const geoData
    //you can check the result by using res.send(geoData.body.features[0].geometry.coordinates); comment out the rest of the code though.

    // const geoData = await geocoder.forwardGeocode({query: req.body.business.location, limit: 1}).send();
    // res.send(geoData.body.features[0].geometry.coordinates);

    
    const business = new Business(req.body.business);

    //now set the business.geometry equal to geoData.body.features[0].geometry
    //END OF MAPS PART
    business.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    //console.log(business.images);
    business.author = req.user._id;
    console.log('djlfdkjfdlkfwpeorpwoeirwna;ajl;ja;fljd;sjfglkjflsdjflkjfslkfsjlf',req.user._id);
    await business.save();
    req.flash('success', 'Successfully made a new business!');
    res.redirect(`/business/${business._id}`)
}

module.exports.showBusiness = async (req, res,) => {
    const business = await Business.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/business');
    }
    res.render('businesses/show', { business });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id)
    if (!business) {
        req.flash('error', 'Cannot find that business!');
        return res.redirect('/business');
    }
    res.render('businesses/edit', { business });
}

module.exports.updateBusiness = async (req, res) => {
    const { id } = req.params;
    const business = await Business.findByIdAndUpdate(id, { ...req.body.business });
    //HANDLING NEW IMAGES TO ADD TO EXISITNG BUSINESS FROM EDIT BUSINESS FORM IN EDIT.EJS
    //map the new image files from the edit form using req.files.map(f => ({ url: f.path, filename: f.filename })) and set it equal to a const var
    //then push the changes to the db using business.images.push(...variableYouCreated); include the '...' since that is a spread operator
    //then save the changes to the business
    

     //await business.save();
    //HANDLING DELETING IMAGES FROM EXITING BUSINESS FROM DELETE FORM
    //use if statement to see if req.body.deleteImages is not empty. i.e if(req.body.deleteImages)
    // if it is not null, then create a loop to go through the deleteImages array and use "await cloudinary.uploader.destroy(filename)"
    //outside of the loop, update the business with the new changes using this query function await business.updateOne({$pull: {images: { filename: {$in: req.body.deleteImages}}}})
    
    req.flash('success', 'Successfully updated business!');
    res.redirect(`/business/${business._id}`)
}

module.exports.deleteBusiness = async (req, res) => {
    const { id } = req.params;
    await Business.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted business')
    res.redirect('/business');
}