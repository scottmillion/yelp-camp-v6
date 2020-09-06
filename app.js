const campground = require('./models/campground');

// APP IMPORTS
const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  seedDB = require('./seeds'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require("./models/user");

// DELETE DATABASE AND LOAD SEED DATA
seedDB();

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASS USER INFO TO EVERY VIEW PAGE
app.use((req, res, next) => {
  // whatever you put in res.locals is available on every view template.
  res.locals.currentUser = req.user;
  next();
});

// MONGOOSE MONGO CONFIG
mongoose.connect('mongodb://localhost:27017/yelp-camp-v6', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

// =====================
// ROUTES
// =====================

// HOME
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX
app.get("/campgrounds", (req, res) => {

  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    }
  });
});

// CREATE 
app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const newCampground = { name, image, description }

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW 
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// SHOW 
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});

// =====================
// COMMENTS ROUTES
// =====================


app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// =====================
// AUTH ROUTES
// =====================

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({ username: req.body.username });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  });
});

// =====================
// LOGIN LOGOUT ROUTES
// =====================

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {

});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
})

// =====================
// CUSTOM MIDDLEWARE
// =====================

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}




// =====================
// SERVER
// =====================

app.listen(3000, (req, res) => {
  console.log("Server running on 3000, sir!");
});