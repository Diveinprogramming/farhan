const mongoose = require('mongoose');
const connection =mongoose.connect('mongodb://127.0.0.1:27017/userdb')
if(connection){
  console.log('db is connected !');
}else{
    console.log('db connection error');
}