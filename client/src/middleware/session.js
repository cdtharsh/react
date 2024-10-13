// In a new file utils/session.js
export const isSessionExpired = () => {
    const loginTime = localStorage.getItem('loginTime');
    const tokenExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (!loginTime) return true; // No login time means session expired

    const currentTime = Date.now();
    return currentTime - loginTime > tokenExpirationTime;
};
