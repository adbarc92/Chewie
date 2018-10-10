"use strict";
/* eslint quotes: ["error", "double", { "allowTemplateLiterals": true }] */

module.exports = {
  "local": {
    "provider": "local",
    "module": "passport-local",
    "usernameField": "username",
    "passwordField": "password",
    "authPath": "api/users/local",
    "callbackHTTPMethod": "post",
    "successRedirect": "/auth/account",
    "failureRedirect": "/local",
    "failureFlash": true,
    "setAccessToken": true
  },
  "github": {
    "provider": "github",
    "module": "passport-github",
    "strategy": "OAuth2Strategy",
    "clientID": process.env.GITHUB_CLIENT_ID1,
    "clientSecret": process.env.GITHUB_CLIENT_SECRET1,
    "callbackURL": process.env.GITHUB_CALLBACK_URL,
    "authPath": "/auth/github",
    "callbackPath": "/auth/github/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email", "profile"],
    "failureFlash": true,
    "setAccessToken": true
  },
  "github-link": {
    "provider": "github",
    "module": "passport-github",
    "strategy": "OAuth2Strategy",
    "clientID": process.env.GITHUB_CLIENT_ID2,
    "clientSecret": process.env.GITHUB_CLIENT_SECRET2,
    "callbackURL": "/link/github/callback",
    "authPath": "/link/github",
    "callbackPath": "/link/github/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email", "profile"],
    "link": true,
    "failureFlash": true,
    "setAccessToken": true
  },
  "google-login": {
    "provider": "google",
    "module": "passport-google-oauth",
    "strategy": "OAuth2Strategy",
    "clientID": process.env.GOOGLE_CLIENT_ID1,
    "clientSecret": process.env.GOOGLE_CLIENT_SECRET1,
    "callbackURL": "/auth/google/callback",
    "authPath": "/auth/google",
    "callbackPath": "/auth/google/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email", "profile"],
    "failureFlash": true,
    "setAccessToken": true
  },
  "google-link": {
    "provider": "google",
    "module": "passport-google-oauth",
    "strategy": "OAuth2Strategy",
    "clientID": process.env.GOOGLE_CLIENT_ID2,
    "clientSecret": process.env.GOOGLE_CLIENT_SECRET2,
    "callbackURL": "/link/google/callback",
    "authPath": "/link/google",
    "callbackPath": "/link/google/callback",
    "successRedirect": "/auth/account",
    "failureRedirect": "/login",
    "scope": ["email", "profile"],
    "link": true,
    "failureFlash": true,
    "setAccessToken": true
  }
}
