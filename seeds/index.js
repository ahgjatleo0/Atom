const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Business = require('../models/business');

mongoose.connect('mongodb://localhost:27017/yelp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Business.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const business = new Business({
            author: '61e641d811d87c7bc68cf6af',
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'serving burgers',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmyux4wg4/image/upload/v1642644890/YelpClone/k2dzrovqz2gxoqzq4mey.jpg',
                    filename: 'YelpClone/k2dzrovqz2gxoqzq4mey'
                },
                {
                    url: 'https://res.cloudinary.com/dmyux4wg4/image/upload/v1642644273/YelpClone/wbjfmlihxhvqyay9caah.png',
                    filename: 'YelpClone/wbjfmlihxhvqyay9caah'
                }
            ]

        });
        //console.log(business);

        await business.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

