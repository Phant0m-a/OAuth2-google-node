const express = require('express');
const app = express();

// dependencies
const session = require('express-session');
const passport = require('passport');
// 
require('./utils/auth');

// log middle-ware
function isLoggedIn(req, res, next) {
    req.user ? next() : res.status(401).send({ success: false, message: 'user not logged in!' });
}

app.use(session({ secret: 'b3f84vc2j7k5lh12cf8', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/',async (req,res)=>{
  try {
	  res.send("<h1>Welcome to OAuth2.0</h1><br><a href='/auth/google'>authenticate with google 😋</a>");
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});

app.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));


app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    }));


app.get('/auth/google/success',isLoggedIn, async (req, res) => {
    try {
        res.status(200).send({ success: true, message: 'authentication successful! ',username:`${req.user.displayName }`});
       
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});


app.get('/auth/google/failure', async (req, res) => {
    try {
        res.status(401);
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});


app.get('/classified', isLoggedIn, async (req, res) => {
    try {
        res.status(200).send({ success: true, message: `username:${req.user.displayName}<br>email:${req.user.emails} ` });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
});

app.get('/logout', async(req, res) => {
    try {
        req.logOut();
        req.session.destroy();
        res.send('logged out successfully!');
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
   });
let PORT = process.env.PORT ;
app.listen(PORT ||'5000',()=>{
    console.log('[+] Server started successfully😎');
})