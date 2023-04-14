//Author: Aryan Shah
//Description: This database manager demonstrates the use of database operations including creating/deleting collections and inserting, searching and updating entries.

var MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//set up the database
exports.setup = function () {
    let cbackfunc;
    createdb(cbackfunc);
    createcl(cbackfunc);
};
//create the database
let createdb = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
};

//creates collection
let createcl = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        if (!myDB) {
          console.log("ERROR: Collection undefind. Fix myDB in config file");
          return;
        } 
        var dbo = db.db(myDB);
        dbo.createCollection(mycollection, function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
};

//inserts unique usernames in the database
exports.insertUniqueRec = function (myobj){
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        //finds the record in the database which relates to myObj
        dbo.collection(mycollection).findOne(myobj, function (err, res) {
            if (err) throw err;
            if(res == null){
                //If it is a unique username then insert it into the database
                dbo.collection(mycollection).insertOne(myobj, function (err,res){
                    if(err) throw err;                    
                    db.close();
                })
            }else{
                //username is not unique so close the database
                db.close();
            }
            
        });
    });
}

//update scores in the database
exports.insertScores = function(queryData, newData){
    MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function (err, db){
        if(err) throw err; 
        var dbo = db.db(myDB);
        //find record to update
        dbo.collection(mycollection).findOne(queryData,function (err,res){
            //console.log(res.username)
            //console.log(res.score)
            if(err) throw err;
            //if it doesnt find the username then insert the username
            if(res == null){
                //insert the username if it doesnt exist
                dbo.collection(mycollection).insertOne(queryData, function (err,res){
                    if(err) throw err;
                    //insert the score of the username
                    dbo.collection(mycollection).updateOne(queryData, {$set: newData}, function (err, res) {
                        if (err) throw err;                    
                        db.close();
                    });
                })
            }
            //if the username does not have a score
            else if(res.score === undefined){    
                //update the score     
                dbo.collection(mycollection).updateOne(queryData, {$set: newData},function (err, res) {
                    if (err) throw err;                    
                    db.close();
                });
            }
            //if the username has a lower score make it the new user highscore
            else if(res.score > newData.score){
                dbo.collection(mycollection).updateOne(queryData, {$set: newData},function (err, res) {
                    if (err) throw err;                    
                    db.close();
                });
            }
            else{
                db.close();
                //close the database
            }

        })
    } )
}

//responds with an array with a list of username and highscores
exports.gethighscores = function(callbackFn){
    
    MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, function (err, db){
        if(err) throw err;
        var dbo = db.db(myDB);
        //finds all the records with score property
        dbo.collection(mycollection).find({score : {$exists : true}}).toArray((err,result) =>{
            if(err) throw (err)
            const response = {data : result}
            callbackFn(result)
        })

        
    })

}


//finds all records using a limit (if limit is 0 all records are returned)
exports.findAll = function (limit,callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).find({}).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
};

//deletes all the items from the database collection
exports.deleteCollection = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).drop(function (err, delOK) {
            if (err) throw err;
            if (delOK)
                console.log("Collection deleted");
            db.close();
        });
    });
};


