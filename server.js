const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongoDb = require("./database/connection");
const routes = require("./routes");
const validate = require("../util/validation");
const userController = require("../controllers/user");

const app = express();
const PORT = process.env.PORT || 3000;
const CALLBACK_URL = 'http://localhost:3000/github/callback';

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
}));
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Passport Configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.use("/", routes);

// Landing Page
app.get("/", (req, res) => {
    res.send(req.session.user ? `logged in as ${req.session.user.displayName}` : "logged out");
});

// GitHub Callback Route
app.get("/github/callback", passport.authenticate("github", { failureRedirect: "/api-docs", session: false }), (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
});

// MongoDB Connection and Server Start
mongoDb.initDB((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    }
});
