import {
  BackendCatalogSurface,
  BackendPluginInterface,
} from '@tpb/core-backend';
import { Router } from 'express';

export const HelloWorldBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyTo(BackendCatalogSurface, surface => {
    surface.addRouterBuilder(async () => {
      const router = Router();
      router.get('/hello', async (_req, res) => {
        const now = new Date();
        return res.json({
          date: now.toISOString(),
        });
      });

      return router;
    });
  });
