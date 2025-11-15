const path = require('path');
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'dev_secret'],
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  httpOnly: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, cb) => {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
    const user = {
      id: profile.id,
      email,
      name: profile.displayName || '',
      picture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      provider: 'google'
    };
    cb(null, user);
  }
));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

app.post('/auth/logout', (req, res) => {
  req.logout(() => {});
  req.session = null;
  res.status(204).end();
});

app.get('/api/me', (req, res) => {
  if (req.user) return res.json(req.user);
  res.status(401).json({ ok: false });
});

app.use(express.static(path.join(__dirname)));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '1.html')));

const port = process.env.PORT || 3000;
app.listen(port);