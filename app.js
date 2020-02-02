const express = require('express')
const sql = require('mssql')
const app = express()
const port = 3000


var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function (req, res, next) {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    console.log('LOGGED time=', datetime)
    next();
});

// for localhost BUT ONLY with LOCAL SQL_SERVER_LOGIN 
// N O T  with Windows Authentication!!!
// to create a SQL SERVER LOGIN you can see:
// https://www.youtube.com/watch?v=11Rx35l8Khc
/*const config = {
    user: 'localNir',
    password: '[your pass here]',
    server: 'E440\\SQLEXPRESS', // You can use 'localhost\\instance' to connect to named instance
    database: 'DBUsers',

    options: {
        encrypt: false  // Use this if you're on Windows Azure
    }
}*/

//for the LIVEDNS Server
const config = {
    user: 'site09',
    password: 'Lsas171*',
    server: '185.60.170.14', // You can use 'localhost\\instance' to connect to named instance
    database: 'site09',

    options: {
        encrypt: false  // Use this if you're on Windows Azure
    }
}



app.post('/addFriend', upload.array(), function (req, res, next) {
    let userID = req.body.userID;
    let friendID = req.body.friendID

    sql.connect(config).then(() => {
        return sql.query`INSERT INTO FinalProject_Kasem_FriendsTB (User_ID,Friend_ID,IsFriends) VALUES (${userID},${friendID},${0})`
    }).then(result => {
        sql.close();
        res.send(result.rowsAffected > 0 ? 'Done!' : 'Something wrong happened');
    }).catch(err => {
        console.warn(err);
    });
});


app.put('/acceptAddFriend', upload.array(), function (req, res, next) {
    let userID = req.body.userID;
    let friendID = req.body.friendID

    sql.connect(config).then(() => {
        return sql.query`UPDATE FinalProject_Kasem_FriendsTB SET IsFriends = ${1} WHERE User_ID = ${userID} AND Friend_ID = ${friendID}`
    }).then(result => {
        sql.close();
        res.send(result.rowsAffected > 0 ? 'Done!' : 'Something wrong happened');
    }).catch(err => {
        console.warn(err);
    });
});

app.delete('/deleteFriend', upload.array(), function (req, res, next) {
    let userID = req.body.userID;
    let friendID = req.body.friendID;

    sql.connect(config).then(() => {
        return sql.query`DELETE FROM FinalProject_Kasem_FriendsTB WHERE (User_ID = ${userID} AND Friend_ID = ${friendID}) OR (User_ID = ${friendID} AND Friend_ID = ${userID});`
    }).then(result => {
        sql.close();
        res.send(result.rowsAffected > 0 ? 'Done!' : 'Something wrong happened');
    }).catch(err => {
        console.warn(err);
    });
})

sql.on('error', err => {
    // ... error handler
    console.warn('error=' + err);
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))