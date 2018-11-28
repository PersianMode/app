
export const VerificationErrors = {
  notVerified: {
    status: 420,
    error: 'Customer is not verified yet',
  },
  notMobileVerified: {
    status: 421,
    error: 'Customer\'s mobile is not verified yet',
  },
  notEmailVerified: {
    status: 422,
    error: 'Customer\'s email is not verified yet',
  },
};

export const notVerified = 0;
export const mobileVerified = 1;
export const emailActivated = 2;
export const bothVerifiedCode = 3;

export const expiredLinkStatusCode = 437;
