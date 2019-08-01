// CRUD operations - Create, Read, Update and Delete

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectID();

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  } 

  const db = client.db(databaseName);

  // db.collection('users').insertOne({
  //   name: 'Martin',
  //   age: 27
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   } 
  
  //   console.log(result.ops);
  // })

  // db.collection('users').insertMany([
  //   {
  //     name: 'Martina',
  //     age: 27
  //   }, 
  //   { 
  //     name: 'Teodora',
  //     age: 26 
  //   }
  //  ] , (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   } 
  
  //   console.log(result.ops);
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'description A',
  //     completed: true
  //   }, 
  //   { 
  //     description: 'description B',
  //     completed: true
  //   }, 
  //   { 
  //     description: 'description C',
  //     completed: true
  //   }
  //  ] , (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   } 
  
  //   console.log(result.ops);
  // })
  
  // db.collection('users').insertOne({
  //   _id: id,
  //   name: 'Viktor',
  //   age: 27
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert user');
  //   } 
  
  //   console.log(result.ops);
  // })

  // db.collection('users').findOne( { name: 'Teodora' }, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(user);
  // })

  // db.collection('users').findOne( { name: 'Viktor' }, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(user);
  // })

  // db.collection('users').findOne( { _id: new ObjectID("5d39f8403f59a6334cdbc69d") }, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(user);
  // })

  // db.collection('users').find({ age: 27 }).toArray((error, users) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(users);
  // })

  // db.collection('users').find({ age: 27 }).count((error, count) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log('Total count: ', count);
  // })

  // db.collection('tasks').findOne( { _id: new ObjectID("5d39fba728faf919d8b7fe73") }, (error, task) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(task);
  // })

  // db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
  //   if (error) {
  //     return console.log('Unable to find user');
  //   } 
  
  //   console.log(tasks);
  // })

  // db.collection('users').updateOne(
  //   { _id: new ObjectID("5d39f8403f59a6334cdbc69d")
  // }, {
  //   // $set: {
  //   //   name: 'Ivana',
  //   //   age: 22
  //   // }
  //   $inc: { age: 1 }
  // }).then(user => {
  //   console.log(user);
  // }).catch(error => {
  //   console.log(error);
  // })

  // db.collection('tasks').updateMany(
  // { 
  //   completed: true 
  // }, {
  //   $set: {
  //     completed: false
  //   }
  // }).then(tasks => {
  //   console.log(tasks);
  // }).catch(error => {
  //   console.log(error);
  // })

  db.collection('users').deleteMany({
    age: 27
  }).then(users => {
    console.log(users);
  }).catch(error => {
    console.log(error);
  })
});