import {
  processingResult,
  CatalogProcessor,
  CatalogProcessorEmit,
  LocationSpec,
} from '@backstage/plugin-catalog-node';
import { Entity } from '@backstage/catalog-model';

// this processor requires a catalog location of type 'system-x' in your app-config.yaml
//
// catalog:
//   locations:
//     - type: system-x
//       target: "any non empty string"

export class CustomProcessor implements CatalogProcessor {
  getProcessorName(): string {
    return 'custom-processor';
  }

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'system-x') {
      return false;
    }

    const entity: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'custom-processor-entity',
        title: 'Custom Processor Entity',
      },
      spec: {
        type: 'service',
        lifecycle: 'experimental',
        owner: 'guests',
        system: 'esback',
      },
    };

    emit(processingResult.entity(location, entity));

    return true;
  }
}
