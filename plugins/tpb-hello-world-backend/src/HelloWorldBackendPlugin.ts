import { BackendCatalogSurface, BackendPluginInterface } from '@tpb/core';
import { Router } from 'express';

export const HelloWorldBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyTo(BackendCatalogSurface, surface => {
    surface.addRouterBuilder(() => {
      const router = Router();
      router.get('/hello', async (req, res) => {
        console.log(`in hello router!!! ${req.params}`);
        return res.json({
          message: `hello, time is ${new Date()}`,
        });
      });

      return router;
    });
  });
