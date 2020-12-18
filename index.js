const express = require('express');
const mongo = require('mongodb');
const path = require('path');
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'INCO Statistics';

const uri = process.env.DB_CONNECTION_STRING;
const db = process.env.DB_NAME;
const client = mongo.MongoClient(uri,{useUnifiedTopology: true});



//Total applicant Approved step 1 OR approved step 2 
//Submitted on September 2019 (they could have registered any time before) so the date may change in the future
// Step status Approved 
var fromDate = new Date("2019/11/1");
const searchObject = {
  $and: [
  {$or:
  [{'stepId' : '5cb8a846fbf8e118bb0e9e55'},{'stepId' : '5cb8a88efbf8e118bb0e9e56'}]
  },
  {'status' : 'Approved'},
  {'updatedAt': {"$gte": fromDate}}
  ]
};





client.connect((err, db) => {
  if (err) throw err;
  const dbo = db.db("CYFDevDB");

  console.log("connected");

  dbo.collection("applicant_progresses").countDocuments(searchObject, (err, result) => {
  if (err) throw err;
  const TotalApplicant1 = result

app.use('/', (req,res) => {
  return res.render('layout', {
    pageTitle : 'Report',
    template : 'index',
    TotalApplicant1: TotalApplicant1
  });
})

});


});  




const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});