export const environment = {
  production: true,
  token_auth_config: {
    apiBase:                    process.env.USERS_API_BASE,
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
