import { TypographyOptions } from '@material-ui/core/styles/createTypography';

export const createTypography = (): TypographyOptions => ({
  fontFamily: 'var(--cds-global-typography-font-family)',
  body1: {
    letterSpacing: 'var(--cds-global-typography-body-letter-spacing)',
    lineHeight: 'var(--cds-global-typography-body-line-height)',
    fontSize: 'var(--cds-global-typography-body-font-size)',
    fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
  },
  body2: {
    letterSpacing: 'var(--cds-global-typography-body-letter-spacing)',
    lineHeight: 'var(--cds-global-typography-body-line-height)',
    fontSize: 'var(--cds-global-typography-body-font-size)',
    fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
  },
  caption: {
    letterSpacing: 'var(--cds-global-typography-caption-letter-spacing)',
    lineHeight: 'var(--cds-global-typography-caption-line-height)',
    fontSize: 'var(--cds-global-typography-caption-font-size)',
    fontWeight: 'var(--cds-global-typography-caption-font-weight)' as any,
  },
  button: {
    boxShadow: 'none',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  overline: {
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: '11px',
  },
  h1: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '1.6rem',
    fontWeight: 200,
    lineHeight: '1.5em',
    letterSpacing: '-0.0156em',
  },
  h2: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '1.4rem',
    fontWeight: 200,
    lineHeight: '1.7143em',
    letterSpacing: '-0.017857em',
  },
  h3: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '1.1rem',
    fontWeight: 200,
    lineHeight: '1.0909em',
    letterSpacing: '-0.013636em',
  },
  h4: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '0.9rem',
    fontWeight: 200,
    lineHeight: '1.333333em',
    letterSpacing: '-0.011111em',
  },
  h5: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '0.8rem',
    fontWeight: 400,
    lineHeight: '1.5em',
    letterSpacing: '-0.0125em',
  },
  h6: {
    fontFamily:
      'var(--cds-global-typography-header-font-family, "Clarity City", "Avenir Next", sans-serif)',
    fontSize: '0.7rem',
    fontWeight: 500,
    lineHeight: '1.5em',
    letterSpacing: '-0.03125em',
  },
  subtitle1: {
    fontSize: 'var(--cds-global-typography-font-size-2)',
    fontWeight: 400,
    lineHeight: '1.5rem',
    // letterSpacing: '-0.03125em',
  },
  subtitle2: {
    fontSize: 'var(--cds-global-typography-font-size-3)',
    fontWeight: 400,
    lineHeight: '1.5em',
    // letterSpacing: '-0.03125em',
  },
});
