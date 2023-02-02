import { BackendPluginInterface } from '@esback/core';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  defaultGroupTransformer,
  defaultOrganizationTransformer,
  defaultUserTransformer,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import { MicrosoftGraphOrgReaderProcessorTransformersSurface } from '@esback/plugin-microsoft-graph-org-reader-processor';

export const MicrosoftGraphOrgReaderProcessorTestTransformersPlugin: BackendPluginInterface =
  () => surfaces => {
    surfaces.applyTo(
      MicrosoftGraphOrgReaderProcessorTransformersSurface,
      microsoftGraphOrgReaderProcessorTransformersSurface => {
        microsoftGraphOrgReaderProcessorTransformersSurface.setUserTransformer(
          async (
            graphUser: MicrosoftGraph.User,
            userPhoto?: string,
          ): Promise<UserEntity | undefined> => {
            const backstageUser = await defaultUserTransformer(
              graphUser,
              userPhoto,
            );

            if (backstageUser) {
              backstageUser.metadata.name = `${backstageUser.metadata.name}-test-user-transformer`;
            }

            return backstageUser;
          },
        );

        microsoftGraphOrgReaderProcessorTransformersSurface.setGroupTransformer(
          async (
            group: MicrosoftGraph.Group,
            groupPhoto?: string,
          ): Promise<GroupEntity | undefined> => {
            const backstageGroup = await defaultGroupTransformer(
              group,
              groupPhoto,
            );

            if (backstageGroup) {
              backstageGroup.metadata.name = `${backstageGroup.metadata.name}-test-group-transformer`;
            }

            return backstageGroup;
          },
        );

        microsoftGraphOrgReaderProcessorTransformersSurface.setOrganizationTransformer(
          async (
            organization: MicrosoftGraph.Organization,
          ): Promise<GroupEntity | undefined> => {
            const backstageOrganization = await defaultOrganizationTransformer(
              organization,
            );

            if (backstageOrganization) {
              backstageOrganization.metadata.name = `${backstageOrganization.metadata.name}-test-organization-transformer`;
            }

            return backstageOrganization;
          },
        );
      },
    );
  };
