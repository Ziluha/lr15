'use strict';
const easyxml = require('easyxml');
var serializer = new easyxml({
    singularize:true,
    rootElement:'response',
    dataFormat:'ISO',
    manifest:true
});
exports.sendMessage = (req, res, data)=>{
    switch(req.get("Content-type")){
        case 'application/xml':
            res.setHeader('Content-type', 'application/xml');
            res.end(serializer.render(data));
            break;
        default:
            res.setHeader('Content-type', 'application/json');
            res.json(data);
            break;
    }
}

exports.removeRoot = (req, res, next)=>{
    var obj;
    if (req.get('Content-type') == 'application/xml'){
        for(var props in req.body)
            obj = req.body[props];
        req.body = obj;
    }
    next();
}