'use strict';
var promise = require('bluebird');
var needle = promise.promisifyAll(require('needle'));

module.exports = (domains)=>{
    return{
        checkDomain:checkDomain,
        regDomain:regDomain,
        getDomains:getDomains,
        delDomains:delDomains
    }
    function checkDomain(req,res){
        return new Promise((resolve, reject)=>{
            var str;
            if (req.body.domain)
                str = req.body.domain;
            else if(req.params.domain)
                str = req.params.domain;
            needle.getAsync('https://api.domainr.com/v2/status?domain='+str+'&client_id=fb7aca826b084569a50cfb3157e924ae',
                {headers:{'Origin':'https://www.namecheap.com'}}).then((result)=>{
                if(result.body.status[0]){
                if(result.body.status[0].summary == 'inactive' || result.body.status[0].summary == 'premium')
                    domains.findAll({where:{
                        name:str
                    }}).then((existing)=>{
                        if (existing.length == 0)
                            resolve({name:str, success:true, message:'Domain is unique'});
                        else resolve({name:str, success:false, message:'Domain exists in DB'});
                    });
                else resolve({name:str, success:false, message:'Domain exists on site'});
                }
                else resolve({name:str, success:false, message:'Something wrong with domain'});
            });
        });
    }
    function regDomain(req, res){
        return new Promise((resolve, reject)=>{
            checkDomain(req,res).then((result)=>{
                if (result.success)
                    domains.create({
                        name:req.body.domain
                    }).then((status)=>{
                        resolve({success:true, message:'Domain successfully registered'})
                    });
                else resolve(result);
            });
        });
    }     
    function getDomains(req, res){
       var ofs = 0, lmt = 10;
        if (req.query.offset)
            ofs = parseInt(req.query.offset);
        if (req.query.limit)
            lmt = parseInt(req.query.limit);
        return new Promise((resolve, reject)=>{
            domains.findAndCountAll({offset:ofs, limit:lmt, raw:true}).then((domains)=>{ 
                var data = {data:domains.rows, meta:{limit:lmt, offset:ofs, all:domains.count}};
                resolve(data);
            });
        });
    }
    function delDomains(req, res){
        return new Promise((resolve, reject)=>{
            domains.destroy({where:{
                name:req.params.domain
            }}).then((result)=>{
                if (result)
                    resolve({success:true, message:'Domain deleted from DB'});
                else resolve({success:false, message:'Domain wasn\'t deleted'})
            });
        })
    }
}