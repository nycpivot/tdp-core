import { BackendPluginInterface } from '@tpb/core-backend';
import { CustomPermissionPolicy } from './CustomPermissionPolicy';
import { PermissionPolicySurface } from '@tpb/plugin-permission-backend';

export const CustomPermissionPolicyPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(PermissionPolicySurface, surface => {
      surface.set(new CustomPermissionPolicy());
    });
  };
