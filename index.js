const express = require('express');
// require cookie-parser.
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
//Require express-ejs-layouts library
const expressLayouts = require('express-ejs-layouts');
// requiring the database module
const db = require('./config/mongoose');

// requiring for passport.js - used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

const sassMiddleware =require('node-sass-middleware');
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


app.use(express.urlencoded());
// telling app to to use cookie-parser - midleware
app.use(cookieParser());

app.use(express.static('./assets'));
//telling our app to use express layouts
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// telling the app to use ejs as the view engine
app.set('view engine', 'ejs');
// directly accesing the ./views folder
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )

}));

app.use(passport.initialize());
app.use(passport.session());

// middleware - check user and set in locals-views
app.use(passport.setAuthenticatedUser);

// use express router
// this router will used for any route functions
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});