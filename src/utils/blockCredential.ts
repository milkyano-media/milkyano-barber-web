const checkBlockedCredentials = (email: string, phoneNumber: string) => {
    const blockedEmails = ['achy.ac@gmail.com'];
    const blockedPhoneNumbers = ['402666885', '+61402666885'];
    
    const normalizedPhone = phoneNumber.replace(/^\+61/, '');
    
    if (blockedEmails.includes(email.toLowerCase())) {
      return true;
    }
    
    if (blockedPhoneNumbers.includes(phoneNumber) || blockedPhoneNumbers.includes(normalizedPhone)) {
      return true;
    }
    
    return false;
  };
  
  // Custom error for blocked credentials
  class BlockedCredentialsError extends Error {
    constructor(message: any) {
      super(message);
      this.name = 'BlockedCredentialsError';
    }
  }
  
  export { checkBlockedCredentials, BlockedCredentialsError };