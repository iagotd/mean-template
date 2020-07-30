const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const mailCtrl = require('../mailController/mailCtrl');
const config = require('../config.json');

const db = "mongodb://" + config.mongodb.user + ":" + config.mongodb.pass + "@" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.db;

mongoose.connect(db, err => {
  if (err) {
    console.log("Error: " + err)
  }
  else {
    console.log("Connected to mongodb.")
  }
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }

  let userTypeNumber = getUserTypeFromRequest(req.query.userType)

  if (userTypeNumber === 5) return false

  let payload = jwt.verify(token, 'secretKey' + userTypeNumber)
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}

function verifyTokenFromPost(req, res, next) {

  if (!req.body.token) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.body.token;

  if (!req.body.userType) {
    return res.status(401).send('Unauthorized request')
  }
  let userTypeNumber = getUserTypeFromRequest(req.body.userType)
  if (userTypeNumber > 2 || userTypeNumber < 0) return false

  try {
    let payload = jwt.verify(token, 'secretKey' + userTypeNumber)
    if (!payload) {
      return res.status(401).send('Unauthorized request')
    }
    req.userId = payload.subject
    next()
  } catch (error) {
    console.log("An error has been produced during token verification.");
    return res.status(401).send('Unauthorized request')
  }

}

function getUserTypeFromRequest(userType) {
  console.log("Intenta verificarse un: " + userType)
  switch (userType) {
    case "user": return 2
    case "premium": return 1
    case "admin": return 0
    default: return 5
  }
}

function sendVerifyEmail(userData) {
  const emailToken = jwt.sign(userData.email, "mailSecretKey");
  const confirmUrl = `http://localhost:4200/confirm/${userData.email}/${emailToken}`;
  mailCtrl.sendEmail(userData.email, "verify", confirmUrl);
}

function sendWelcomeEmail(userData) {
  mailCtrl.sendEmail(userData.email, "welcome")
}

function sendResetEmail(userData) {
  mailCtrl.sendEmail(userData.email, "reset")
}

function storeUser(req, res) {
  bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), (errHash, hash) => {
    if (errHash) {
      console.log("Error generating Hash during registration.");
      res.send("Error generating Hash during registration.");
    } else {
      let user = new User({
        email: req.body.email,
        hash: hash,
        userType: 2,
        emailConfirmed: false
      });
      console.log("Saving user to database.")
      user.save((errorSave) => {
        if (errorSave) {
          console.log('Error saving user during registration.')
          res.send('Error saving user during registration.')
        } else {
          sendVerifyEmail(req.body)
          res.status(200).send({})
        }
      })
    }
  });
}

router.get('/', (req, res) => {
  res.send('From API route')
})

router.post('/register', (req, res) => {
  console.log("Starting to register user: " + req.body.email);
  console.log("The password is: " + req.body.password);
  User.findOne({ email: req.body.email }, (error, user) => {
    if (error) {
      console.log("An unexpected error has occured.")
    } else {
      if (user) {
        console.log("Account already registered.")
        res.status(401).send('Account already registered.')
      } else {
        storeUser(req, res);
      }
    }
  });
})

router.post('/confirmation', async (req, res) => {
  try {
    let userData = req.body
    let payload = jwt.verify(userData.token, "mailSecretKey");
    if (!payload) {
      return res.status(401).send('Unauthorized request')
    }

    User.findOne({ email: userData.email }, (error, user) => {
      if (error) {
        console.log("An error has been produced while searching an user.")
        res.status(401).send('An error has been produced while searching an user.')
      } else {
        if (!user) {
          console.log("Invalid email.");
          res.status(401).send('Invalid email.')
        } else if (user.emailConfirmed) {
          console.log("User email already confirmed.");
          res.status(401).send('User email already confirmed.')
        } else {
          user.emailConfirmed = true;
          User.update({ email: userData.email }, user, (error, userUpdated) => {
            if (error) {
              console.log("An error has been produced while confirming an email.");
              res.status(401).send("An error has been produced while confirming an email.");
            } else {
              console.log("User: " + userUpdated.email + " updated correctly");
            }
          })
        }
      }
    })

    console.log("Sending email confirmation email.")
    sendWelcomeEmail(userData)
    req.email = payload.subject
  } catch (e) {
    res.send('Error' + e)
  }
  res.status(200).send({ message: "Account Confirmed." })
})

router.post('/verify-token', verifyTokenFromPost, (req, res) => {
  res.status(200).send();
})

router.post('/login', (req, res) => {
  let userData = req.body

  User.findOne({ email: userData.email }, (error, userDB) => {
    if (error) {
      console.log(error)
    } else {
      if (!userDB) {
        res.status(401).send('Invalid email')
      } else if (!userDB.emailConfirmed) {
        res.status(401).send('Account has not ben activated')
      } else {

        if(bcrypt.compareSync(req.body.password, userDB.hash)) {
          console.log("Correct password.");
          let payload = { subject: userDB._id }
          let token = jwt.sign(payload, 'secretKey2')
          let userType = "user"
          if (userDB.userType === 1) {
            token = jwt.sign(payload, 'secretKey1')
            userType = "premium"
          }
          if (userDB.userType === 0) {
            token = jwt.sign(payload, 'secretKey0')
            userType = "admin"
          }
          res.status(200).send({ token, userType })
        } else {
          console.log("Invalid password")
          res.status(401).send('Invalid password')
        }
      }
    }
  })
})

router.get('/events', verifyToken, (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})

router.get('/premium', verifyToken, (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Auto Expo Special",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})

router.get('/admin', verifyToken, (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Auto Expo Admin",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})

module.exports = router 