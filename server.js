// using express
const express = require('express');

//when we call express, we are creating a new express app
// we store it in the "app variable"
const app = express(); 

// declare router
const router = express.Router();

//requiring mongoose 
const mongoose = require('mongoose');

// you can use any database, if it doesn't exist it will create one
mongoose.connect('mongodb://localhost/updog');

// importing the model from pet.js
const Pet = require('./models/pet.js')

const bodyParser = require('body-parser');

app.use(bodyParser.json());

// variable to host port numbers
// process: whenever you run your own node app, you can a process id
// env: where you configure your environments
const port = process.env.PORT || 8080

// setting up middleware
// changes the request as it comes through
app.use(express.static('public'));

router.route('/')
    .get((req,res) => {
        res.json({
            message: 'Success'
        })
    })

router.route('/pets')
    .get((req, res) => {
        Pet.find({}, (err, docs) => {
            if (err) {
                res.status(400)
                    .json({
                        message: "Errorrrrr"
                    })
                return;
            }
            res.status(200)
                .json(docs)
        })
    })
    .post((req, res) => {
        const body = req.body;
        const pet = new Pet();
        pet.name = body.name;
        pet.description = body.description;
        pet.photo = body.photo;
        pet.score = 0;

        pet.save((err, doc) => {
            if (err) {
                res.status(400)
                    .json({message: "Errorr"})
                return;
            }
            res.status(200)
                .json(doc)
        });
    })

router.route('/pets/:pet_id')
    .get((req,res) => {
        const petId = req.params.pet_id;
        console.log(petId);
        Pet.findById(petId, (err, doc) => {
            if (err) {
                res.status(400)
                .json({
                    message: 'Error'
                })
                return;
            }
            res.status(200)
            .json(doc)
        })
    })    
    .put((req, res) => {
        const petId = req.params.pet_id;
        Pet.findById(petId, (err, doc) => {
            if (err) {
                res.status(400)
                .json({
                    message: 'Error'
                })
                return;
            }
            
            Object.assign(doc, req.body, { score: doc.score + 1 })
            doc.save((err, saveddoc) => {
                if (err) {
                    res.status(400)
                    .json({
                        message: 'Error'
                    }) 
                    return;
                }
                res.status(200)
                    .json(saveddoc)
            })

        })
    })
    .delete((req, res) => {
        const petId = req.params.pet_id;
        Pet.findByIdAndRemove(petId, (err, doc) => {
            if (err) {
                res.status(400)
                .json({
                    message: 'Error'
                })
                return;
            }
            
            res.status(200)
                .json(doc)
        })
    })

app.use('/api', router);

app.listen(port);