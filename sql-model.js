'use strict';

const mysql = require('mysql2/promise');

const config = require('./config.json');

// SQL Unit functions --------------------------------------------------------------------------------------

// Returns all units from the Unit table ordered alphabetically.
async function listUnits() {
  console.log('listUnits called');
  const sql = await init();
  const query = 'SELECT * FROM Unit ORDER BY unitName';
  const [rows] = await sql.query(query);
  return rows;
}

// Enters a Unit into the Unit table.
async function insertUnit(unitName) {
  console.log('insertUnit called');
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO Unit SET ? ;', { unitName });
  await sql.query(insertQuery);
}

// SQL Session functions ------------------------------------------------------------------------------------

// Returns all sessions from the Session table ordered by weeks and then by session type so that lectures will
// be at the top.
async function listSessions() {
  console.log('listSessions called');
  const sql = await init();

  const query = 'SELECT * FROM Session ORDER BY sessWeek, sessType';
  const [rows] = await sql.query(query);
  return rows;
}

// Enters a session into the Session table.
async function insertSession(unitName, sessWeek, sessType, sessCoord, sessTopic, sessDesc, sessHmwk, sessDate) {
  console.log('insertSession called');
  const sql = await init();
  const insertQuery = sql.format('INSERT INTO Session SET ? ;', { unitName, sessWeek, sessType, sessCoord, sessTopic, sessDesc, sessHmwk, sessDate });
  await sql.query(insertQuery);
}

// Updates a session in the Session table with new data, session identified by ID.
async function updateSession(sessId, unitName, sessWeek, sessType, sessCoord, sessTopic, sessDesc, sessHmwk, sessDate) {
  console.log('updateSession called');
  const sql = await init();
  const updateQuery = sql.format('UPDATE Session SET ? WHERE sessId = ? ;', [{sessId, unitName, sessWeek, sessType, sessCoord, sessTopic, sessDesc, sessHmwk, sessDate}, sessId]);
  console.log(updateQuery);
  await sql.query(updateQuery);
}

// Removes session from the Session table, identified by ID.
async function deleteSession(session) {
  console.log('deleteSession called');
  const sql = await init();
  const deleteQuery = sql.format('DELETE FROM Session WHERE sessId = ? ;', session);
  await sql.query(deleteQuery);
}

// SQL Connection functions ----------------------------------------------------------------------------------------

// Create one connection to the database.
let sqlPromise = null;

async function init() {
  if (sqlPromise) return sqlPromise;

  sqlPromise = newConnection();
  return sqlPromise;
}

async function shutDown() {
  if (!sqlPromise) return;
  const stashed = sqlPromise;
  sqlPromise = null;
  await releaseConnection(await stashed);
}

async function newConnection() {
  const sql = await mysql.createConnection(config.mysql);

  // Handle unexpected errors by just logging them.
  sql.on('error', (err) => {
    console.error(err);
    sql.end();
  });

  return sql;
}

async function releaseConnection(connection) {
  await connection.end();
}


// For debugging, logs unhandled promise rejections.
process.on('unhandledRejection', console.error);


// Exports all functions so can be called by the server.
module.exports = {
  listSessions: listSessions,
  insertSession: insertSession,
  updateSession: updateSession,
  deleteSession: deleteSession,
  listUnits: listUnits,
  insertUnit: insertUnit,
  shutDown: shutDown
};