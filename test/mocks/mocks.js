'use strict'

module.exports = class Mock{
    data;
    constructor(){
        this.data = [];
    }
    async create(val){
        if(findOne(val) == -1){
            this.data.push(val);
            return val;
        }
        else return -1;
    }
    async findAll(val){
        
    }
    async findOne(val){
        return data.find((i) => i === val)
    }
    async findCountAll(){

    }
    async destroy(val){

    }
}