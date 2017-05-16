'use strict';
const express = require('express');
var output = require('../output');

module.exports = (userService)=>{
    const router = express.Router();

    router.post('/users', (req, res) => {
        userService.regUser(req, res).then((message)=>{
            output.sendMessage(req, res, message);
        });
    });
    router.post('/sessions', (req, res) => {
        userService.authUser(req, res).then((message)=>{
            output.sendMessage(req, res, message);
        });
    });
    router.use(userService.checkToken);
    router.get('/users', (req, res) => {
        userService.getAll(req, res).then((message)=>{
            output.sendMessage(req, res, message);
        });
    });
     router.get('/users/:login', (req, res) => {
        userService.getOne(req, res).then((message)=>{
            output.sendMessage(req, res, message);
        });
    });
    router.delete('/users/:login', (req, res) => {
        userService.delUser(req, res).then((message)=>{
            output.sendMessage(req, res, message);
        });
    });
    
    return router;
}