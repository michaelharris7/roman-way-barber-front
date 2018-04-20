// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  token_auth_config: {
    apiBase:                    'http://localhost:3000',
    apiPath:                    null,

    signInPath:                 'sign_in',
    signInRedirect:             null,
    signInStoredUrlStorageKey:  null,

    signOutPath:                'sign_out',
    validateTokenPath:          'validate_token',
    signOutFailedValidate:      false,

    registerAccountPath:        '',
    deleteAccountPath:          '',
    registerAccountCallback:    window.location.href,

    updatePasswordPath:         '',
    resetPasswordPath:          'password',
    resetPasswordCallback:      window.location.href,

    oAuthBase:                  window.location.origin,
    oAuthPaths: {
        github:                 'github'
    },
    oAuthCallbackPath:          'oauth_callback',
    oAuthWindowType:            'newWindow',
    oAuthWindowOptions:         null,

    userTypes: [
      { name: 'ADMIN', path: 'admin_auth' },
      { name: 'USER', path: 'auth' }
    ],

    globalOptions: {
      headers: {
        'Content-Type':     'application/json',
        'Accept':           'application/json'
      }
    },
  }
};
