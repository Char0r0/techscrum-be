// const { Request, Response, NextFunction } = require('mongoose');
// const mongoose = require('mongoose');
// const config = require('../../app/config/app');
// const { dataConnectionPool } = require('../utils/dbContext');
// const saas = async (req: any, res: Response, next: NextFunction) => {
//   const tenantId: string = req.params.id?.toString() || '';
//   const url = config.db.replace('techscrumapp', tenantId);
//   if (!dataConnectionPool || !dataConnectionPool[tenantId]) {
//     var dataConnectionMongoose = new mongoose();
//     dataConnectionMongoose.connect(url).then(() => {
//       dataConnectionPool[tenantId] = dataConnectionMongoose;
//       req.dataConnectionPool = dataConnectionPool;
//       return next();
//     });
//   }
// };

// module.exports = { saas };
