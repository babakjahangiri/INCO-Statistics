const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const { queryPlan1 , queryGetApplicants } = require('./services/queryMaker');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './static')));
app.locals.siteName = 'INCO Statistics';

const uri = process.env.DB_CONNECTION_STRING;
const dbName = process.env.DB_NAME;
const client = mongo.MongoClient(uri, { useUnifiedTopology: true });

let getCountPlan1London;
let getCountPlan1Manchester;
let getCountPlan1Total;

client.connect(async (err, db) => {
  if (err) throw err;
  const dbo = db.db(dbName);

  await dbo
    .collection('students')
    .aggregate(queryPlan1(['London']))
    .forEach((x) => (getCountPlan1London = x.count));
  await dbo
    .collection('students')
    .aggregate(queryPlan1(['Manchester']))
    .forEach((x) => (getCountPlan1Manchester = x.count));
  await dbo
    .collection('students')
    .aggregate(queryPlan1(['London', 'Manchester']))
    .forEach((x) => (getCountPlan1Total = x.count));

    //  console.log(getCountPlan1London);
    // console.log(getCountPlan1Manchester);
    // console.log(getCountPlan1Total);

  app.use('/', (_req, res) => res.render('layout', {
    pageTitle: 'Report',
    template: 'index',
    stats1_London: getCountPlan1London,
    stats1_Manchester: getCountPlan1Manchester,
    stats1_Total: getCountPlan1Total,
  }));
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
