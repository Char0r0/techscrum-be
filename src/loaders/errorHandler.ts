const logger = require('./logger');

class ErrorHandler {
  public handleError(error: Error): void {
    logger.error(error);
    // await fireMonitoringMetric(error);
    // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
  }
}
export const errorHandler = new ErrorHandler();
