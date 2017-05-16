'use strict';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
var output = require('../output');

module.exports = (users) => {
    return {
        regUser: regUser,
        authUser: authUser,
        getAll: getAll,
        getOne: getOne,
        delUser: delUser,
        checkToken:checkToken
    };
    function regUser(req, res){
        return new Promise((resolve, reject)=>{
            bcrypt.hash(req.body.password, saltRounds, (err, hash)=>{
                if(err){throw err;}
                users.findOne({
                    where:{login:req.body.login}
                }).then((userExists)=>{
                    if(userExists)
                        output.sendMessage(req, res, {success:false, message:'User with this login exists'});
                    else{
                        users.create({
                            login:req.body.login,
                            password:hash
                        }).then((users)=>{
                            output.sendMessage(req, res, {success:true, message:'User registered', login: req.body.login})
                        });
                    }
                });
            });
        });
    }
    function authUser(req, res){
        return new Promise((resolve, reject)=>{
            users.findOne({
                where:{login:req.body.login}
                }).then((user)=>{
                if(!user)
                    resolve({success:false, message:'User not found'})
                else{
                    bcrypt.compare(req.body.password, user.password, (err, result)=>{
                        if(result){
                            var token = jwt.sign(user.get({plain:true}), 'secretKey', {expiresIn:150000});
                            resolve({success:true, message:'Your token', token: token});
                        }
                        else resolve({success:false, message:'Wrong password'});
                    });
                }
            });
        });
    }
    function getAll(req, res){
        var ofs = 0, lmt = 10;
        if (req.query.offset)
            ofs = parseInt(req.query.offset);
        if (req.query.limit)
            lmt = parseInt(req.query.limit);
        return new Promise((resolve, reject)=>{
            users.findAndCountAll({offset:ofs, limit:lmt, raw:true}).then((users)=>{ 
                var data = {data:users.rows, meta:{limit:lmt, offset:ofs, all:users.count}};
                resolve(data);
            });
        });
    }
    function getOne(req, res){
        return new Promise((resolve, reject)=>{
            users.findOne({
                where:{
                    login:req.params.login
                }
            }).then((user)=>{resolve(user)});
        });
    }
    function delUser(req, res){
        return new Promise((resolve, reject)=>{
            users.destroy({
                where:{
                    login:req.params.login
                }
            }).then((user)=>{
                if(user)
                    resolve({success:true, message:'User deleted'});
                else 
                    resolve({success:false, message:'User wasn\'t deleted'})
            });
        });
    }
    function checkToken(req, res, next){
            var token = req.headers['x-access-token'];
            if (token) {
                jwt.verify(token, 'secretKey', function(err, decoded){
                    if(err){
                        return output.sendMessage(req, res, {success:false, message:'Failed to authenticate token'});
                    }
                    else{
                        req.decoded = decoded;
                        next();
                    }
                });
            }
            else{
                return res.status(403).send({
                    success: false,
                    message: 'No token provided'
                });
            }
        }
}