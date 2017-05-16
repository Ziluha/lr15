module.exports = (Sequelize, sequelize) => {
    return sequelize.define('payments', {
        domain:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        userId: Sequelize.STRING
    });
}