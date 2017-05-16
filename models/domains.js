module.exports = (Sequelize, sequelize) => {
    return sequelize.define('domains', {  
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        }
    });    
};