const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://nnennandukwe:in3rd101@ds133136.mlab.com:33136/monsoon-eye', (err, database)=>{
  if (err) return console.log(err)
  db = database

  app.listen(process.env.PORT || 3000, ()=>{
      console.log('Listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
	db.collection('storms').find().toArray((err, result) => {
		if(err) throw err
		res.render('index.ejs', {storms: result})
	})

})

app.post('/storms', (req, res) => {
	db.collection('storms').save({date: req.body.date, title: req.body.title, category: req.body.category, message:""}, (err, result) =>{
    if (err) throw err
    
  })

})
