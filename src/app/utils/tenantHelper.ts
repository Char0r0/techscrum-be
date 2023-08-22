import config from '../config/app';

export const isLocalHostAndNoConnectedTenant = (host: string) => {
  if (host === '') {
    return false;
  }
  const hasConnectedTenant = config.connectTenantOrigin && config.connectTenantOrigin !== '';
  return host.includes('localhost') && !hasConnectedTenant;
};