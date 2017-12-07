const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://demo:demo@ds133136.mlab.com:33136/monsoon-eye', (err, database)=>{
  if (err) return console.log(err)
  db = database

  app.listen(process.env.PORT || 3000, ()=>{
      console.log('Listening on 3000')
  })
})

// express.js parsing setup methods
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

// READ IN CRUD
app.get('/', (req, res) => {
	db.collection('storms').find().toArray((err, result) => {
		if(err) return console.log(err)
		res.render('index.ejs', {storms: result})
	})
})

// CREATE IN CRUD
app.post('/storms', (req, res) => {
	db.collection('storms').save({name: req.body.name, date: req.body.date, title: req.body.title, category: req.body.category, message:"", board: req.body.board}, (err, result) =>{
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// UPDATE IN CRUD
app.put('/storms', (req, res) => {
  db.collection('storms')
  .findOneAndUpdate({title: req.body.title, category:req.body.category},{
    $set:{
      message:req.body.message
    }
  },{
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// DELETE IN CRUD
app.delete('/storms', (req, res) => {
  db.collection('storms').findOneAndDelete({name: req.body.name}, (err, result) =>{
    if(err) return res.send(500,err)
    res.send('Idea deleted!')
  })
})
