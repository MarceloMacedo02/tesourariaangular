// Placeholder auth utilities - Firebase has been removed
// This file exists to maintain compatibility until all references are updated

class AuthUtils {
    /**
     * Placeholder for register user function
     */
    registerUser = (email: any, password: any) => {
        // This should be replaced with your actual authentication method
        // For example, calling your backend API directly
        console.warn('Firebase removed - implement your own registration');
        return Promise.reject('Firebase removed - implement your own registration');
    }

    /**
     * Placeholder for login user function
     */
    loginUser = (email: any, password: any) => {
        // This should be replaced with your actual authentication method
        // For example, calling your backend API directly
        console.warn('Firebase removed - implement your own login');
        return Promise.reject('Firebase removed - implement your own login');
    }

    /**
     * Placeholder for logout function
     */
    logout = () => {
        // This should be replaced with your actual authentication method
        // For example, calling your backend API directly
        console.warn('Firebase removed - implement your own logout');
        return Promise.reject('Firebase removed - implement your own logout');
    }

    /**
     * Placeholder for password reset function
     */
    forgetPassword = (email: any) => {
        // This should be replaced with your actual authentication method
        // For example, calling your backend API directly
        console.warn('Firebase removed - implement your own password reset');
        return Promise.reject('Firebase removed - implement your own password reset');
    }

    setLoggeedInUser = (user: any) => {
        sessionStorage.setItem('authUser', JSON.stringify(user));
    }

    /**
     * Returns the authenticated user
     */
    getAuthenticatedUser = () => {
        if (!sessionStorage.getItem('authUser')) {
            return null;
        }
        return JSON.parse(sessionStorage.getItem('authUser')!);
    }

    /**
     * Handle the error
     * @param {*} error
     */
    _handleError(error: any) {
        // tslint:disable-next-line: prefer-const
        var errorMessage = error.message;
        return errorMessage;
    }
}

// tslint:disable-next-line: variable-name
let _authBackend: AuthUtils | null = null;

/**
 * Initialize the backend
 * @param {*} config
 */
const initAuthBackend = (config: any) => {
    if (!_authBackend) {
        _authBackend = new AuthUtils();
    }
    return _authBackend;
};

/**
 * Returns the auth backend
 */
const getAuthBackend = () => {
    // Return null to indicate Firebase has been removed
    return null;
};

export { initAuthBackend, getAuthBackend };
