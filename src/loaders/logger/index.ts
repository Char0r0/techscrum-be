import { buildDevLogger } from './winston/devLogger';
import { buildProdLogger } from './winston/prodLogger';
import { Logger } from 'winston';

let logger: Logger;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

export { logger };
