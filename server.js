'use static';

// Gets code dependencies.
const express = require('express');
const app = express();
const db = require('./sql-model.js');

// Checks if server started and outputs to the console.
app.listen(8080, (err) => {
  if (!err) console.log('Server started');
  else console.error('error starting server', err);
});

// Calls functions depending on the URL.
app.get('/api/sessions', getSessions);
app.get('/api/units', getUnits);
app.post('/api/addSession', addSession);
app.post('/api/addUnit', addUnit);
app.post('/api/editSession', alterSession);
app.post('/api/removeSession', discardSession);

app.use('/', express.static('front'));

// Server functions ----------------------------------------------------------------------------------------

// Unit functions ------------------------------------------------------------------------------------------

// Returns units passed from the sql-model's listUnits function back to the client.
async function getUnits(req, res) {
  console.log('getUnits called');
  res.send(await db.listUnits());
}

// Passes unitname from the client to the sql-model's insertUnit function.
async function addUnit(req, res) {
  console.log('addUnit called');
  try {
    const unit = req.query.unit;
    const addStatus = await db.insertUnit(unit);
    res.send(addStatus);
  }
  catch (error) {
    res.send('addUnit failed');
  }
}

// Session functions ---------------------------------------------------------------------------------------

// Returns sessions passed from the sql-model's listSessions function back to the client.
async function getSessions(req, res) {
  console.log('getSessions called');
  res.send(await db.listSessions());
}

// Passes session values from the client to the sql-model's insertSession function.
async function addSession(req, res) {
  console.log('addSession called');
  try {
    const unit = req.query.unit;
    const week = req.query.week;
    const type = req.query.type;
    const coord = req.query.coord;
    const topic = req.query.topic;
    const desc = req.query.desc;
    const hmwk = req.query.hmwk;
    const date = req.query.date;
    const addStatus = await db.insertSession(unit, week, type, coord, topic, desc, hmwk, date);
    res.send(addStatus);
  }
  catch (error) {
    res.send('addSession failed');
  }
}

// Passes the updated values of a session to the sql-model's updateSession function.
async function alterSession(req, res) {
  console.log('alterSession called');
  try {
    const id = parseInt(req.query.id);
    const unit = req.query.unit;
    const week = req.query.week;
    const type = req.query.type;
    const coord = req.query.coord;
    const topic = req.query.topic;
    const desc = req.query.desc;
    const hmwk = req.query.hmwk;
    let date = req.query.date;
    // Next two lines used as the date output formatting is different than the input formatting.
    let dateParts = date.split('/');
    let dateObj = new Date(dateParts[2], dateParts[1], dateParts[0]);

    const addStatus = await db.updateSession(id, unit, week, type, coord, topic, desc, hmwk, dateObj);
    res.send(addStatus);
  }
  catch (error) {
    res.send('alterSession failed');
  }
}

// Passes the id of a session to the sql-model's deleteSession function.
async function discardSession(req, res) {
  console.log('discardSession called');
  try {
    const session = parseInt(req.query.id);
    const addStatus = await db.deleteSession(session);
    res.send(addStatus);
  }
  catch (error) {
    res.send('discardSession failed');
  }
}