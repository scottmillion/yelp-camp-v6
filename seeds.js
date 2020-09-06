const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require("./models/comment");
const faker = require('faker');

const data = [
  {
    // "name": "Salmon Creek",
    "name": faker.name.findName(),
    "image": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    // "description": "Come see wild animals, fresh rivers, and streams here at Salmon Creek."
    "description": faker.lorem.sentences()
  },
  {
    "name": "Tallgreen Highlands",
    "image": "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
    "description": "Dare to be brave? Tallgreen Highlands has bears, jaguars, and anything you can imagine that wouldn't let you sleep well. Les' sko!"
  },
  {
    "name": "Green Hills",
    "image": "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",
    "description": "Who needs blue or white or yellow? We got nothin' but green here."
  },
  {
    "name": "Coconino National Forest",
    "image": "https://live.staticflickr.com/4567/37514240304_1a744f1fce_z.jpg",
    "description": "If you've never seen the moon before, this is where it can be basked in!"
  },
  {
    "name": "Thungutti Campground",
    "image": "https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/new-england-national-park/thungutti-campground/thunhgutti-campground-01.jpg",
    "description": "Don't be fooled by the name, this place is off the charts. Hiking, fishing, camping, and lots of sun!"
  }
];

function seedDB() {
  // REMOVE ALL CAMPGROUNDS
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("removed campgrounds!");
      // ADD A FEW CAMPGROUNDS
      data.forEach((seed) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err);
          } else {
            console.log("added a campground");
            // ADD A FEW COMMENTS
            Comment.create(
              {
                text: faker.lorem.sentences(),
                author: faker.name.findName()
              }, (err, comment) => {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
              }
            );

          }
        });
      });
    }
  });


}

module.exports = seedDB;