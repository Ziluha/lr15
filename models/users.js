module.exports = (Sequelize, sequelize) => {
    return sequelize.define('users', {
        login: {
            type: Sequelize.STRING,
            primaryKey: true
        }, 
        password: Sequelize.STRING
    });    
};