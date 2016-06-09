var express = require('express');
var router = express.Router();
var multer = require('multer');
var NodeRSA = require('node-rsa');
var md4 = require('js-md4');

var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});
router.get('/login',function(req,res,next){
    res.render('login');
});

router.post('/login',function(req,res,next){
    console.log('login!');
    var username=req.body.username;
    var password=req.body.password;

    User.getUserByUsername(username, function(error, user){
        if(error) throw error;
        if(!user){
            return  'Unknown User';
        }
        console.log('88888888888888');
        console.log(user.privatekey);
        console.log(user.passc);
        if(User.comparePassword(password,user.privatekey,user.passc)){
            res.render('login',{
                msg:'exito'
            });
        }else{
            res.render('login',{
                msg:'error'
            });
        }
    });

});

router.post('/register',function(req,res,next){
    console.log(req.body.name);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors: errors
        });
        console.log('Errors');
    } else{
        console.log('No Errors');
        /*var keypublic = new NodeRSA({b: 16});
        var keyPublicString= keypublic.exportKey('public');
        console.log(keyPublicString);*/
        var key = new NodeRSA();
        key.generateKeyPair(1024);
        var keyPublicString= key.exportKey('public');
        var keyPrivateString= key.exportKey('private');
        var pass=key.encrypt(password);//encryptada con llave publica
        console.log('PASWORD encriptada publica:'+pass);
        console.log('PRIVADA :'+keyPrivateString);
        console.log(keyPrivateString);
        console.log(keyPublicString);
        var hash=md4(password);
        keyPrivateString=keyPrivateString.replace('\n','');
        keyPublicString=keyPublicString.replace('\n','');
        console.log('Hash con m4 :'+hash)
        console.log('-------------------\n');
        console.log('que paso shabo 9999999999:'+keyPrivateString);
        console.log('password encriptada publica'+pass);
        console.log('------------\n')
        //console.log(keyPublicString);

        //simulacion de recuperacion de llave de BD


        //var keypriv=new NodeRSA();
        //keypriv.importKey(keyPrivateString,'pkcs1-private-pem');
        //var recheco=keypriv.exportKey();
        //console.log('777777777777777   8888888:'+recheco);
        //keypriv.setOptions({encryptionScheme: 'pkcs1'});
        //var keypub=new NodeRSA(keyPublicString);
        //var rev1= keypriv.exportKey();
        //var rev2= keypub.exportKey('public');
        //console.log('checo llaves privada:'+rev1+' publica:'+rev2);

        //var passde=keypriv.decrypt(pass);
        //console.log('descencriptada:'+passde);


        //encripto publica desecripto privada recien salido de creacion llaves
        /*var crip=key.encrypt(password);
        var decrip=key.decrypt(crip);
        console.log('variable encriptada:'+crip+'desencriptada:'+decrip);*/

        var newUser = new User({
            username:username,
            password:password,
            email:email,
            name:name,
            passc:pass,
            privatekey:keyPrivateString,
            publickey:keyPublicString,
            hash:hash
        });
        User.createUser(newUser,function(err,user){
            if(err){
                throw err;
            }
        console.log(user);
        });
        res.render('Register',{
            keyPublicString:keyPublicString,
            keyPrivateString:keyPrivateString,
            encryptedPass:pass,
            name:name,
            mail:email,
            username:username,
            hash:hash
        });
    }

});
module.exports = router;
