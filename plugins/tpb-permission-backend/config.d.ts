import { Config as PermissionConfig } from '@backstage/plugin-permission-common/config';

export interface Config extends PermissionConfig {
  adminRefs: string[] | undefined;
}
