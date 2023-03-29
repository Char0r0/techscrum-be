declare namespace Express {
  interface Request {
    dbConnection: any;
    dataConnectionPool: any;
    tenantId: string;
    userConnection: any;
  }
}
