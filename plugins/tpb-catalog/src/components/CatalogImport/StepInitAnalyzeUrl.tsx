import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import {
  FormHelperText,
  Grid,
  TextField,
  CircularProgress,
  Button,
} from '@material-ui/core';
import React, { ComponentProps, useCallback, useState } from 'react';
import {
  AnalyzeResult,
  catalogImportApiRef,
} from '@backstage/plugin-catalog-import';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const NextButton = (
  props: ComponentProps<typeof Button> & { loading?: boolean },
) => {
  const { loading, ...buttonProps } = props;
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button
        color="primary"
        variant="contained"
        {...buttonProps}
        disabled={props.disabled || props.loading}
      />
      {props.loading && (
        <CircularProgress size="1.5rem" className={classes.buttonProgress} />
      )}
      {props.loading}
    </div>
  );
};

/**
 * A helper that converts the result of a render('name', opts) to make it compatible with material-ui.
 *
 * See also https://github.com/react-hook-form/react-hook-form/issues/4629#issuecomment-815840872
 * TODO: ESBACK-229 - remove when updating to material-ui v5 (https://github.com/mui-org/material-ui/pull/23174)
 *
 * @param renderResult - the result of a render('name', opts)
 */
export function asInputRef(renderResult: UseFormRegisterReturn) {
  const { ref, ...rest } = renderResult;
  return {
    inputRef: ref,
    ...rest,
  };
}

// the configuration of the stepper
export type ImportFlows =
  | 'unknown'
  | 'single-location'
  | 'multiple-locations'
  | 'no-location';

// result of the prepare state
export type PrepareResult =
  | {
      type: 'locations';
      locations: Array<{
        exists?: boolean;
        target: string;
        entities: CompoundEntityRef[];
      }>;
    }
  | {
      type: 'repository';
      url: string;
      integrationType: string;
      pullRequest: {
        url: string;
      };
      locations: Array<{
        target: string;
        entities: CompoundEntityRef[];
      }>;
    };

type FormData = {
  url: string;
};

type Props = {
  onAnalysis: (
    flow: ImportFlows,
    url: string,
    result: AnalyzeResult,
    opts?: { prepareResult?: PrepareResult },
  ) => void;
  disablePullRequest?: boolean;
  analysisUrl?: string;
};

/**
 * A form that lets the user input a url and analyze it for existing locations or potential entities.
 *
 * @param onAnalysis is called when the analysis was successful
 * @param analysisUrl a url that can be used as a default value
 * @param disablePullRequest if true, repositories without entities will abort the wizard
 */
export const StepInitAnalyzeUrl = ({
  onAnalysis,
  analysisUrl = '',
  disablePullRequest = false,
}: Props) => {
  const errorApi = useApi(errorApiRef);
  const catalogImportApi = useApi(catalogImportApiRef);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {
      url: analysisUrl,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleResult = useCallback(
    async ({ url }: FormData) => {
      setSubmitted(true);

      try {
        const analysisResult = await catalogImportApi.analyzeUrl(url);

        switch (analysisResult.type) {
          case 'repository':
            if (
              !disablePullRequest &&
              analysisResult.generatedEntities.length > 0
            ) {
              onAnalysis('no-location', url, analysisResult);
            } else {
              setError("Couldn't generate entities for your repository");
              setSubmitted(false);
            }
            break;

          case 'locations': {
            if (analysisResult.locations.length === 1) {
              onAnalysis('single-location', url, analysisResult, {
                prepareResult: analysisResult,
              });
            } else if (analysisResult.locations.length > 1) {
              onAnalysis('multiple-locations', url, analysisResult);
            } else {
              setError('There are no entities at this location');
              setSubmitted(false);
            }
            break;
          }

          default: {
            const err = `Received unknown analysis result of type ${
              (analysisResult as any).type
            }. Please contact the support team.`;
            setError(err);
            setSubmitted(false);

            errorApi.post(new Error(err));
            break;
          }
        }
      } catch (e: any) {
        setError(e?.data?.error?.message ?? e.message);
        setSubmitted(false);
      }
    },
    [catalogImportApi, disablePullRequest, errorApi, onAnalysis],
  );

  return (
    <form onSubmit={handleSubmit(handleResult)}>
      <TextField
        {...asInputRef(
          register('url', {
            required: true,
            validate: {
              httpsValidator: (value: any) =>
                (typeof value === 'string' &&
                  value.match(/^http[s]?:\/\//) !== null) ||
                'Must start with http:// or https://.',
            },
          }),
        )}
        fullWidth
        id="url"
        label="Repository URL"
        helperText="Enter the full path to your entity file to start tracking your component"
        margin="normal"
        variant="outlined"
        error={Boolean(errors.url)}
        required
      />

      {errors.url && (
        <FormHelperText error>{errors.url.message}</FormHelperText>
      )}

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Grid container spacing={0}>
        <NextButton
          disabled={Boolean(errors.url) || !watch('url')}
          loading={submitted}
          type="submit"
        >
          Analyze
        </NextButton>
      </Grid>
    </form>
  );
};
