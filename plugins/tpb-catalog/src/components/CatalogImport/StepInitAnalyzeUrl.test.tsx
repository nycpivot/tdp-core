import { TestApiProvider as ApiProvider } from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  AnalyzeResult,
  catalogImportApiRef,
} from '@backstage/plugin-catalog-import';
import { StepInitAnalyzeUrl } from './StepInitAnalyzeUrl';

describe('<StepInitAnalyzeUrl />', () => {
  const catalogImportApi: jest.Mocked<typeof catalogImportApiRef.T> = {
    analyzeUrl: jest.fn(),
    submitPullRequest: jest.fn(),
  };

  const errorApi: jest.Mocked<typeof errorApiRef.T> = {
    post: jest.fn(),
    error$: jest.fn(),
  };
  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <ApiProvider
      apis={[
        [catalogImportApiRef, catalogImportApi],
        [errorApiRef, errorApi],
      ]}
    >
      {children}
    </ApiProvider>
  );

  const location = {
    target: 'url',
    entities: [
      {
        kind: 'component',
        namespace: 'default',
        name: 'name',
      },
    ],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders without exploding', async () => {
    const { getByRole } = render(
      <StepInitAnalyzeUrl onAnalysis={() => undefined} />,
      {
        wrapper: Wrapper,
      },
    );

    expect(getByRole('textbox', { name: /Repository/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Repository/i })).toHaveValue('');
  });

  it('should use default analysis url', async () => {
    const { getByRole } = render(
      <StepInitAnalyzeUrl
        onAnalysis={() => undefined}
        analysisUrl="https://default"
      />,
      {
        wrapper: Wrapper,
      },
    );

    expect(getByRole('textbox', { name: /Repository/i })).toBeInTheDocument();
    expect(getByRole('textbox', { name: /Repository/i })).toHaveValue(
      'https://default',
    );
  });

  it('should not analyze without url', async () => {
    const onAnalysisFn = jest.fn();

    const { getByRole } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    try {
      await userEvent.click(getByRole('button', { name: /Analyze/i }));
    } catch {
      return;
    }

    expect(catalogImportApi.analyzeUrl).toHaveBeenCalledTimes(0);
    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze invalid value', async () => {
    const onAnalysisFn = jest.fn();

    const { getByRole, getByText } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'http:/',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(catalogImportApi.analyzeUrl).toHaveBeenCalledTimes(0);
    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
    expect(
      getByText('Must start with http:// or https://.'),
    ).toBeInTheDocument();
  });

  it('should analyze single location', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [location],
    } as AnalyzeResult;

    const { getByRole } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'single-location',
      'https://my-repository',
      analyzeResult,
      { prepareResult: analyzeResult },
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should analyze multiple locations', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [location, location],
    } as AnalyzeResult;

    const { getByRole } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-1',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'multiple-locations',
      'https://my-repository-1',
      analyzeResult,
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze with no locations', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'locations',
      locations: [],
    } as AnalyzeResult;

    const { getByRole, getByText } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-1',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      getByText('There are no entities at this location'),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should analyze repository', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [
        {
          apiVersion: '1',
          kind: 'component',
          metadata: {
            name: 'component-a',
          },
        },
      ],
    } as AnalyzeResult;

    const { getByRole } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-2',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(1);
    expect(onAnalysisFn.mock.calls[0]).toMatchObject([
      'no-location',
      'https://my-repository-2',
      analyzeResult,
    ]);
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze repository without entities', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [],
    } as AnalyzeResult;

    const { getByRole, getByText } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-2',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      getByText("Couldn't generate entities for your repository"),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should not analyze repository if disabled', async () => {
    const onAnalysisFn = jest.fn();

    const analyzeResult = {
      type: 'repository',
      url: 'https://my-repository-2',
      integrationType: 'github',
      generatedEntities: [
        {
          apiVersion: '1',
          kind: 'component',
          metadata: {
            name: 'component-a',
          },
        },
      ],
    } as AnalyzeResult;

    const { getByRole, getByText } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} disablePullRequest />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve(analyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-2',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      getByText("Couldn't generate entities for your repository"),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(0);
  });

  it('should report unknown type to the errorapi', async () => {
    const onAnalysisFn = jest.fn();

    const { getByRole, getByText } = render(
      <StepInitAnalyzeUrl onAnalysis={onAnalysisFn} />,
      {
        wrapper: Wrapper,
      },
    );

    catalogImportApi.analyzeUrl.mockReturnValueOnce(
      Promise.resolve({ type: 'unknown' } as any as AnalyzeResult),
    );

    await userEvent.type(
      getByRole('textbox', { name: /Repository/i }),
      'https://my-repository-2',
    );
    await userEvent.click(getByRole('button', { name: /Analyze/i }));

    expect(onAnalysisFn).toHaveBeenCalledTimes(0);
    expect(
      getByText(
        'Received unknown analysis result of type unknown. Please contact the support team.',
      ),
    ).toBeInTheDocument();
    expect(errorApi.post).toHaveBeenCalledTimes(1);
    expect(errorApi.post.mock.calls[0][0]).toMatchObject(
      new Error(
        'Received unknown analysis result of type unknown. Please contact the support team.',
      ),
    );
  });
});
