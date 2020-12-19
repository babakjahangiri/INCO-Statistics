const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const { queryPlan1, cityConditionMaker } = require('./services/queryMaker');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'INCO Statistics';

const uri = process.env.DB_CONNECTION_STRING;
const dbName = process.env.DB_NAME;
const client = mongo.MongoClient(uri, { useUnifiedTopology: true });

// const cities = ['London', 'Manchester'];

const cities = [];
const pipelineQp1 = queryPlan1(cities);
console.log(cityConditionMaker(cities));

client.connect((err, db) => {
  if (err) throw err;
  const dbo = db.db(dbName);

  console.log('connected');

  dbo.collection('students').aggregate(pipelineQp1, (err1, result) => {
    if (err1) throw err1;

    let qp1London = 0;
    let qp1Manchester = 0;
    let qp1Total = 0;

    // result.forEach((count) => applicationCount1 = count);
    result.forEach((count) => console.log(count));

    app.use('/', (_req, res) => res.render('layout', {
      pageTitle: 'Report',
      template: 'index',
      queryPlan1_London: qp1London,
      queryPlan1_Manchester: qp1Manchester,
      queryPlan1_Total: qp1Total,
    }));
  });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
