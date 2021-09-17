export enum AuthEndpoints {
  LOGIN = '/api/auth/jwt/login',
  LOGOUT = '/api/auth/jwt/logout',
  REGISTER = '/api/auth/register',
  FORGOT_PASSWORD = '/api/auth/forgot-password',
  RESET_PASSWORD = '/api/auth/reset-password',
}

export enum UserEndpoints {
  CURRENT_USER = '/api/users/me',
}
