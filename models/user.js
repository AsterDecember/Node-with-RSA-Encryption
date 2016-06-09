var mongoose = require('mongoose');
var NodeRSA = require('node-rsa');
var md4 = require('js-md4');

mongoose.connect('mongodb://localhost/nodeauthRSA');

var db=mongoose.connection;

var UserSchema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type: String
    },
    email:{
        type:String
    },
    name:{
        type:String
    },
    passc:{
        type:String
    },
    privatekey:{
        type:String
    },
    publickey:{
        type:String
    },
    hash:{
        type:String
    }
});

var User = module.exports=mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query  = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword,stringPkey, encrypted){
    var keyPrivateString=stringPkey;
    var keypriv=new NodeRSA();
    keypriv.importKey(keyPrivateString,'pkcs1-private-pem');
    keypriv.setOptions({encryptionScheme: 'pkcs1'});

    var passde=keypriv.decrypt(encrypted,'utf8  ');

    if (candidatePassword==passde) {
        console.log('888888888 77777');
        return true;
    }else{
        return false;
    }
}

module.exports.createUser =function(newUser,callback){
    newUser.save(callback);
}