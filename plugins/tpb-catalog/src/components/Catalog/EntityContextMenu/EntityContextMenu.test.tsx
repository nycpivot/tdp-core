import { EntityProvider } from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import SearchIcon from '@material-ui/icons/Search';
import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { EntityContextMenu } from './EntityContextMenu';

const mockPermissionApi = new MockPermissionApi();

function render(children: React.ReactNode) {
  return renderInTestApp(
    <TestApiProvider apis={[[permissionApiRef, mockPermissionApi]]}>
      <EntityProvider
        entity={{ apiVersion: 'a', kind: 'b', metadata: { name: 'c' } }}
        children={children}
      />
    </TestApiProvider>,
  );
}

describe('ComponentContextMenu', () => {
  it('should call onUnregisterEntity on button click', async () => {
    const mockCallback = jest.fn();

    await render(
      <EntityContextMenu
        onUnregisterEntity={mockCallback}
        entityKind="component"
      />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const unregister = await screen.findByText('Unregister component');
    expect(unregister).toBeInTheDocument();
    fireEvent.click(unregister);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('supports extra items', async () => {
    const extra = {
      title: 'HELLO',
      Icon: SearchIcon,
      onClick: jest.fn(),
    };

    await render(
      <EntityContextMenu
        onUnregisterEntity={jest.fn()}
        UNSTABLE_extraContextMenuItems={[extra]}
        entityKind="component"
      />,
    );

    const button = await screen.findByTestId('menu-button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    const item = await screen.findByText('HELLO');
    expect(item).toBeInTheDocument();
    fireEvent.click(item);

    expect(extra.onClick).toHaveBeenCalled();
  });
});
