const mysql = require('mysql');

//Change MySql host, user and password according to system configuarations
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'jobs'
});

//findID inserts the submitted Url into the database
const findID = (url, callback) => {
  connection.query(`INSERT INTO jobs (url) values ("${url}");`, (err, results) => {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

//updateHtml adds the sanitized Html of the webpage to the 'html' field of the corresponding database entry, given the jobID and Html
const updateHtml = (body, id, callback) => {
  connection.query(`UPDATE jobs SET html="${body}" where id=${id};`, (err, results) => {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

//findHtml returns the sanitized Html of the webpage, given the jobId
const findHtml = (id, callback) => {
  connection.query(`SELECT html FROM jobs WHERE id=${id};`, (err, results) => {
    if(err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  findHtml,
  findID,
  updateHtml
};