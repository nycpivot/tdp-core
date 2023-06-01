import {
  BackendPluginInterface,
  BackendPluginSurface,
  PluginEnvironment,
} from '@tpb/core-backend';
import { Router } from 'express';
import {
  createRouter,
  Preparers,
  Generators,
  Publisher,
} from '@backstage/plugin-techdocs-backend';
import Docker from 'dockerode';
import { DockerContainerRunner } from '@backstage/backend-common';

const createPlugin = () => {
  return async (env: PluginEnvironment): Promise<Router> => {
    const preparers = await Preparers.fromConfig(env.config, {
      logger: env.logger,
      reader: env.reader,
    });

    // Docker client (conditionally) used by the generators, based on techdocs.generators config.
    const dockerClient = new Docker();
    const containerRunner = new DockerContainerRunner({ dockerClient });

    // Generators are used for generating documentation sites.
    const generators = await Generators.fromConfig(env.config, {
      logger: env.logger,
      containerRunner,
    });

    // Publisher is used for
    // 1. Publishing generated files to storage
    // 2. Fetching files from storage and passing them to TechDocs frontend.
    const publisher = await Publisher.fromConfig(env.config, {
      logger: env.logger,
      discovery: env.discovery,
    });

    // checks if the publisher is working and logs the result
    await publisher.getReadiness();

    return await createRouter({
      preparers,
      generators,
      publisher,
      logger: env.logger,
      config: env.config,
      discovery: env.discovery,
      cache: env.cache,
    });
  };
};

export const TechdocsBackendPlugin: BackendPluginInterface = () => surfaces =>
  surfaces.applyTo(BackendPluginSurface, surface => {
    surface.addPlugin({
      name: 'techdocs',
      pluginFn: createPlugin(),
    });
  });
