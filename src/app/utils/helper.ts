import { NextFunction } from 'express';
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export const shouldExcludeDomainList = (host: string | undefined) => {
  if (!host) {
    return false;
  }

  const domains = [
    'https://www.techscrumapp.com',
    'https://dev.techscrumapp.com',
    'https://staging.techscrumapp.com',
    'http://localhost:3000',
  ];

  return domains.some((domain) => host.includes(domain));
};

export function removeHttp(url: string | undefined) {
  if (!url) {
    return '';
  }
  return url.replace(/^https?:\/\//, '');
}
