const db = require('../models')
const express = require('express');
const router = express.Router();
let authentication = require("./authentication")

// router.route('/signup') 
// // req.body is the information coming from the front-end. Usually it's an object.
// .post(userController.create);    

//this is a sign up route and to create a new user...
router.post("/signup", async function (req, res) {
    //console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    console.log('signing up...')
    console.log(req.body)
    let hashedPassword = await authentication.create(password);

    // Decrypt pasword function
    // after done, then use new variable in password 
    db.User.create({
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        email: email
    }).then(function (user) {
        res.json(`User ${user.firstName} ${user.lastName} created with ${user.email}`);
    }).catch(function (err) {
        console.log(err);
    });
});

//Login Route, Verify User
router.post('/login', (req, res) => {
    let userEmail = req.body.email;
    db.User.findOne({
        email: userEmail
    }).then(function (result) {
        if (result) {
            authentication.verify(req.body.password, function (hash) {
                if (result.password === hash.hash) {
                    req.user = {
                        email: result.email
                    }
                    res.json(result);
                } else {
                    res.json('Incorrect password!');
                }
            })
        } else {
            res.json('No user by that email!')
        }
    }).catch(err => {
        console.log(err)
        res.send(err)
    });
});


//get a random workout

router.get('/api/workout/random', (req, res) => {
    db.Workout.find().then(data => {
        let rand = Math.floor(Math.random() * data.length)
        res.json(data[rand])
    })
})

// router.get('/api/goals', (req,res)=>{
//     res.json()
//     })

//this needs to update user "challenge of the day" everytime that button is pressed
// router.put("")


module.exports = router