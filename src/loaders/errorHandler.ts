const logger = require('./logger');

class ErrorHandler {
  public handleError(error: Error): void {
    console.log(error);
    //console.log("logger", logger);
    //logger.log("info", "test message %s", "my string");
    logger.error(error);
    // await fireMonitoringMetric(error);
    // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
  }
}
export const errorHandler = new ErrorHandler();
