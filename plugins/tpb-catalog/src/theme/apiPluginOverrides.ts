import { makeStyles } from '@material-ui/core';

export const apiPluginOverrides = makeStyles(theme => ({
  container: {
    // Swagger UI customizations
    '& .swagger-ui': {
      // Title
      '& .info .title': {
        '& small': {
          top: '0',
          padding: '2px 8px',
          background: 'var(--cds-alias-status-neutral-shade)',
          verticalAlign: 'middle',
        },
        '& small.version-stamp': {
          background: 'var(--cds-alias-status-info)',
        },
        '& pre': {
          color: 'var(--cds-global-color-white)',
          fontSize: theme.typography.fontSize - 3,
        },
      },
      '& .info': {
        '& a.link, & .markdown a': {
          color: theme.palette.primary.main,
          textDecoration: 'underline',
        },
        '& .markdown': {
          // Color code
          '& code': {
            color: theme.palette.primary.main,
          },
        },
        '& .base-url': {
          marginTop: '20px',
          color: 'var(--cds-global-typography-color-400)',
        },
      },
      // Label
      '& label': {
        color: theme.palette.text.primary,
      },
      // Server block
      '& .scheme-container': {
        background: 'none',
        boxShadow: 'none',
        borderRadius: '0',
        padding: '0 0 30px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        maxWidth: '1420px',
        margin: '0 auto 30px',
        '& .servers': {
          display: 'inline',
          marginLeft: '20px',
        },
        '& .wrapper': {
          paddingLeft: '0',
        },
        '& label': {
          '& select': {
            marginLeft: '20px',
          },
        },
        '& .schemes>label': {
          display: 'block',
        },
      },
      // Arrows
      '& .expand-operation, & .models-control, & .opblock-summary-control': {
        fill: theme.palette.text.primary,
      },
      '& .opblock-summary-control .arrow': {
        marginRight: '8px',
      },
      '& .model-box-control:focus, & .models-control:focus, & .opblock-summary-control:focus':
        {
          outline: 'none',
        },
      '&. models-control:focus': {
        outline: 'none',
      },
      '& .model-box-control .model-toggle:after': {
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="${
          theme.palette.type === 'light' ? 'black' : 'white'
        }" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>') 50% no-repeat`,
      },
      // Layout
      '& .opblock': {
        boxShadow: 'none',
        '& .opblock-summary-method': {
          color: theme.palette.common.black,
        },
      },
      // Clear button
      '& .btn-clear': {
        color: theme.palette.text.primary,
      },
      // Modal
      '& .dialog-ux': {
        '& .modal-ux-header': {
          borderColor: theme.palette.divider,
          '& h3': {
            color: theme.palette.text.primary,
          },
          '& .close-modal': {
            fill: theme.palette.text.primary,
          },
        },
        '& .modal-ux-content': {
          color: theme.palette.text.primary,
          '& p, & h4, & h3, & label, & h2, & h5': {
            color: theme.palette.text.primary,
          },
        },
        '& .modal-ux': {
          background: theme.palette.background.default,
          borderColor: theme.palette.divider,
        },
        '& .auth-container': {
          borderColor: theme.palette.divider,
        },
      },
      // Select & Input component
      '& select, & input[type=text]': {
        background: 'none',
        color: 'var(--cds-global-typography-color-400)',
        border: '0 none',
        boxShadow: 'none',
        borderRadius: '0',
        borderBottom: `1px solid var(--cds-alias-object-interaction-color)`,
        cursor: 'pointer',
        fontFamily:
          'var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif)',
        fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
        fontSize: 'var(--cds-global-typography-font-size-3)',
      },
      '& select:hover, & input[type=text]:hover': {
        boxShadow: '0 1px 0 var(--cds-alias-object-interaction-color)',
        borderBottom: `1px solid var(--cds-alias-object-interaction-color)`,
      },
      '& select::placeholder, & input[type=text]::placeholder': {
        fontStyle: 'italic',
        color: 'var(--cds-global-typography-color-200)',
      },
      '& select:focus, & input[type=text]:focus': {
        outline: 'none',
        borderBottom: `1px solid var(--cds-alias-status-info)`,
        boxShadow: `0 1px 0 var(--cds-alias-status-info)`,
      },
      '& select:disabled, & select:disabled:hover, & input[type=text]:disabled, & input[type=text]:disabled:hover':
        {
          borderBottom: `1px solid var(--cds-alias-object-border-color-tint)`,
          boxShadow: `none`,
          color: 'var($cds-alias-status-disabled)',
          cursor: 'not-allowed',
        },
      '& textarea': {
        background: theme.palette.background.default,
        color: 'var(--cds-global-typography-color-400)',
        border: '1px solid var(--cds-alias-object-interaction-color)',
        boxShadow: 'none',
        outline: 'none',
        cursor: 'pointer',
        fontFamily:
          'var(--cds-global-typography-font-family, "Clarity City", "Avenir Next", sans-serif)',
        fontWeight: 'var(--cds-global-typography-body-font-weight)' as any,
        fontSize: 'var(--cds-global-typography-font-size-3)',
      },
      '& textarea:focus': {
        border: `1px solid var(--cds-alias-status-info)`,
        boxShadow: 'none',
        outline: 'none',
      },
      // Input component
      '& select': {
        background: `transparent url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="${
          theme.palette.type === 'light' ? 'black' : 'white'
        }" d="M13.418 7.859a.695.695 0 0 1 .978 0 .68.68 0 0 1 0 .969l-3.908 3.83a.697.697 0 0 1-.979 0l-3.908-3.83a.68.68 0 0 1 0-.969.695.695 0 0 1 .978 0L10 11l3.418-3.141z"/></svg>') right 0px center no-repeat`,
      },
      // Table
      '& table tbody tr td:first-of-type': {
        minWidth: '12em',
      },
      // h3 title
      '& h3.opblock-tag': {
        marginBottom: '12px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '& a.link': {
          color: theme.palette.primary.main,
          textDecoration: 'underline',
        },
      },
      // Divider
      '& .tab li:first-of-type:after': {
        background: theme.palette.divider,
      },
      // Btn
      '& .btn-group': {
        padding: '20px',
      },
      '& .btn': {
        boxShadow: 'none',
        padding: '8px 18px',
        textTransform: 'uppercase',
        fontSize: theme.typography.fontSize - 2,
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
      },
      '& .btn.execute': {
        background: theme.palette.primary.main,
        color: 'var(--cds-global-color-white)',
        fontSize: theme.typography.fontSize,
      },
      '& .opblock button.unlocked svg': {
        fill: theme.palette.type === 'light' ? 'black' : 'white',
      },
      // Alignment fixes
      '& .opblock-summary-description': {
        marginTop: '2px',
      },
      '& .opblock-tag-section .operation-tag-content': {
        margin: '0 12px',
      },
      // Schemas
      '& section.models': {
        border: 'none',
        '& h4': {
          marginBottom: '15px',
          borderBottom: `1px solid ${theme.palette.divider}`,
          '& svg': {
            marginRight: '6px',
          },
        },
        '& .model-container': {
          margin: '0 12px',
          marginBottom: '15px;',
        },
        '& .model-box': {
          padding: '5px 10px',
        },
        '& .models-control': {
          margin: '6px 0',
          background: 'none',
          fontSize: theme.typography.fontSize + 10,
        },
      },
      // Optional doc
      '& .opblock-external-docs-wrapper': {
        color: 'var(--cds-global-typography-color-400)',
        '& .opblock-title_normal': {
          marginTop: '0',
          color: 'var(--cds-global-typography-color-400)',
        },
        '& a': {
          color: theme.palette.primary.main,
          textDecoration: 'underline',
        },
      },
      // Color code
      '& .renderedMarkdown code': {
        color: theme.palette.primary.main,
      },
      '& .opblock-title_normal': {
        color: 'var(--cds-global-typography-color-400)',
      },
    },
    // ---------------------------------------------
    // Async API
    '& .asyncapi': {
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '30px 0',
      '& > section': {
        border: '0 none',
      },
      '& .asyncapi__info, & > section > .asyncapi__toggle, & > section > section > .asyncapi__toggle':
        {
          boxShadow: 'none',
          padding: '0',
          background: 'var(--cds-alias-object-interaction-background)',
        },
      '& > section > .asyncapi__toggle, & > section > section > .asyncapi__toggle':
        {
          '& > header': {
            padding: '12px 0',
            borderBottom: `1px solid ${theme.palette.divider}`,
            marginBottom: '12px',
            '& > div > h2': {
              paddingLeft: '18px',
              fontSize: theme.typography.fontSize + 10,
            },
            '& .asyncapi__toggle-button': {
              marginRight: '25px',
            },
            '&:hover': {
              background: 'rgba(0,0,0,.05)',
            },
          },
          '& > .asyncapi__toggle-body': {
            padding: '0 12px',
          },
        },
      '& .asyncapi__toggle': {
        background: 'var(--cds-alias-object-app-background)',
        borderRadius: 3,
      },
      '& .asyncapi__info-header-main h1': {
        fontSize: theme.typography.fontSize + 22,
        padding: '10px 0',
      },
      '& .asyncapi__toggle-arrow': {
        transform: 'rotate(90deg)',
        content: 'none',
        background: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="${
          theme.palette.type === 'light' ? 'black' : 'white'
        }" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>') 50% no-repeat`,
        backgroundSize: '32px 32px ',
        display: 'block',
        width: '32px',
        height: '32px',
      },
      '& .asyncapi__toggle-arrow--expanded': {
        transform: 'rotate(-90deg)',
      },
      '& ul>li>section': {
        background: 'var(--cds-alias-object-app-background)',
      },
      // Arrows
      '& .asyncapi__toggle-button, & .asyncapi__toggle-button:hover': {
        border: 'none',
        padding: '0',
        background: 'none',
      },
      // Badge
      '& .asyncapi__badge, & .asyncapi__server-security-scope': {
        padding: '0px 10px',
        borderRadius: '10px',
        fontSize: '12px',
        lineHeight: '20px',
      },
      '& .asyncapi__badge': {
        color: 'var(--cds-global-color-white)',
        background: theme.palette.primary.main,
      },
      '& .asyncapi__badge--publish': {
        background: theme.palette.success.main,
      },
      '& .asyncapi__badge--subscribe': {
        background: theme.palette.info.main,
      },
      '& .asyncapi__badge--deprecated': {
        background: theme.palette.warning.main,
      },
      '& .asyncapi__badge--required': {
        background: theme.palette.warning.main,
      },
      '& .asyncapi__badge--generated': {
        background: theme.palette.primary.main,
      },
      '& .asyncapi__server-security-scope': {
        color: 'var(--cds-global-color-white)',
        background: theme.palette.success.main,
      },
    },
  },
}));

export const orgPluginOverrides = makeStyles(theme => ({
  ownership: {
    '& a > div': {
      color: theme.palette.text.primary,
    },
  },
}));
