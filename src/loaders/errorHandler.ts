import { Response } from "express";
const logger = require("./logger");

class ErrorHandler {
  public handleError(error: Error, responseStream: Response): void {
    //console.log("logger", logger);
    //logger.log("info", "test message %s", "my string");
    logger.error(error);
    // await fireMonitoringMetric(error);
    // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
  }
}
export const errorHandler = new ErrorHandler();
