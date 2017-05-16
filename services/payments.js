'use strict';
module.exports = (payments, users, domains)=>{
    return{
        pay:pay,
        getPayments:getPayments,
        del:del
    }
    function pay(req, res){
        return new Promise((resolve, reject)=>{
            users.findOne({where:{login:req.body.login}}).then((user)=>{
                if(user)
                    domains.findOne({where:{name:req.body.domain}}).then((domain)=>{
                        if(domain)
                            payments.create({
                                domain:req.body.domain,
                                userId:req.body.login
                            }).then((success)=>{
                                resolve({success:true, message:'Domain purchased'});
                            });
                        else resolve({success:false, message:'Domain not found'});
                    });
                else resolve({success:false, message:'User not found'});
            });
        });
    }
    function getPayments(req, res){
        var ofs = 0, lmt = 10;
        if (req.query.offset)
            ofs = parseInt(req.query.offset);
        if (req.query.limit)
            lmt = parseInt(req.query.limit);
        return new Promise((resolve, reject)=>{
            payments.findAndCountAll({offset:ofs, limit:lmt, raw:true}).then((payments)=>{ 
                var data = {data:payments.rows, meta:{limit:lmt, offset:ofs, all:payments.count}};
                resolve(data);
            });
        });
    }
     function del(req, res){
        return new Promise((resolve, reject)=>{
            payments.destroy({
                where:{
                    domain:req.params.domain
                }
            }).then((payment)=>{
                if(payment)
                    resolve({success:true, message:'User deleted'});
                else 
                    resolve({success:false, message:'User wasn\'t deleted'})
            });
        });
    }
}