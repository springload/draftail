// @flow
declare var EMBEDLY_API_KEY: string | typeof undefined;
declare var PKG_VERSION: string | typeof undefined;
declare var SVG_ICONS: string | typeof undefined;
declare var SENTRY_DSN: string | typeof undefined;
declare var process:
  | {
      env: {
        NODE_ENV: string,
      },
    }
  | typeof undefined;
