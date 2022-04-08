// Make a connection with mangoose 
const mongoose = require('mongoose');
const cities = require("./cities");
const { places, descriptors } = require("./dataHelpers");

const CampGround = require("../models/campground");
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED !");
})

//pass the array and return the random number from the array
const sample = array => array[Math.floor(Math.random() * array.length)]

// Delete many, it will first delete all the data then 50x pick a random number 
// to get a city, name, state and location. then we pick random descriptor in a random place for the title 
// then save it to db
const dataDB = async () => {
    await CampGround.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000Cities = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 25) + 10;
        const camp = new Campground({
            location: `${cities[random1000Cities].city}, ${cities[random1000Cities].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0ODMyNTF8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=60",
            description: "Soy sauce salt miso butter roasted pork slices flavoured oil yuzu seasoned egg corn ground black pepper lard Tokyo, Asahikawa chopped onions bamboo slices scallions spinach Hakata pork cubes leek toasted sesame seeds nori, abura soba chilli Sapporo minced garlic ramen burger soy milk bean sprouts Yokohama wood ear mushroom vinegar. Soy sauce scallions yuzu butter Sapporo abura soba ramen burger chilli Hakodate curry nori Wakayama, roasted pork slices chicken stock spinach lard Asahikawa Hakata Kumamoto Yokohama miso salt, chopped onions Tokushima toasted sesame seeds pork bones seasoned egg ginger corn spicy bean paste ground black pepper leek.",
            price
        })
        await camp.save();
    }
}

//close the database
dataDB().then(() => {
    mongoose.connection.close();
})