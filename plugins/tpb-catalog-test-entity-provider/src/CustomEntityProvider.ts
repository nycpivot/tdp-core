import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

export class CustomEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;

  getProviderName(): string {
    return 'custom-entity-provider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    this.run();
    return Promise.resolve(undefined);
  }

  async run(): Promise<void> {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const customEntity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'custom-entity-provider-entity',
        title: 'Custom Entity Provider Entity',
        // these annotations are necessary for the enitity to show up in the catalog
        // normally, an entity provider would fetch entity data from an external source
        // the catalog plugin adds these annotations based on the fetch url
        // we hardcode the entities and their annotations for simplicity
        annotations: {
          'backstage.io/managed-by-location': 'url:https://host/path',
          'backstage.io/managed-by-origin-location': 'url:https://host/path',
        },
      },
      spec: {
        type: 'service',
        lifecycle: 'experimental',
        owner: 'guests',
        system: 'tpb',
      },
    };

    const entities: Entity[] = [customEntity];

    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({ entity })),
    });
  }
}
