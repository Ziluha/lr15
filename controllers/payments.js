'use strict';
const express = require('express');
var output = require('../output');

module.exports = (paymentsServices)=>{
    const router = express.Router();

    router.get('/payments', (req, res) => {
        paymentsServices.getPayments(req, res).then((payments) => {
            output.sendMessage(req, res, payments);
        });
    });
    router.post('/payments', (req, res) => {
        paymentsServices.pay(req, res).then((payments) => {
            output.sendMessage(req, res, payments);
        });
    });
    router.delete('/payments/:domain', (req, res) => {
        paymentsServices.del(req, res).then((domain) => {
            output.sendMessage(req, res, domain);
        });
    });
    return router;
}