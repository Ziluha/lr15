'use strict';
var express = require('express');
var output = require('../output');

module.exports = (domainsServices)=>{
    var router = express.Router();

    router.post('/domains', (req, res)=>{
        domainsServices.regDomain(req,res).then((result)=>{
            output.sendMessage(req, res, result);
        });
    });
    router.get('/domains/:domain', (req, res)=>{
        domainsServices.checkDomain(req,res).then((result)=>{
            output.sendMessage(req, res, result);
        });
    });
     router.get('/domains', (req, res)=>{
        domainsServices.getDomains(req,res).then((result)=>{
            output.sendMessage(req, res, result);
        });
    });
     router.delete('/domains/:domain', (req, res)=>{
        domainsServices.delDomains(req,res).then((result)=>{
            output.sendMessage(req, res, result);
        });
    });
    
    return router;
}