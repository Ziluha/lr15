'use strict';
module.exports = (Sequelize, config) => {
    const options = {
        host: config.host,
        dialect: config.dialect,
        logging: false,
        dialectOptions: config.dialectOptions,
        define: {
            timestamps: true,
            paranoid: true,
            defaultScope: {
                where: {
                    deletedAt: { $eq: null }
                }
            }
        }
    };

    const sequelize = new Sequelize(config.name, config.user, config.password, options); 
    const User = require('../models/users')(Sequelize, sequelize);
    const Domain = require('../models/domains')(Sequelize, sequelize);
    const Payment = require('../models/payments')(Sequelize, sequelize);
    return {
        domains: Domain,
        users: User,
        payments: Payment,
        sequelize: sequelize
    };
};