declare namespace Express {
  interface Request {
    dbConnection: any;
    dataConnectionPool: any;
    userConnection: any;
    tenantId: string | null;
  }
}
