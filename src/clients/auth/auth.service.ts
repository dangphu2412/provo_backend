import { UserCredential } from './entities/user-credential';
import { GoogleUser } from './google.authenticator';

export const AuthServiceToken = 'AuthService';

export interface AuthService {
  loginByGoogleUser(googleUser: GoogleUser): Promise<UserCredential>;
  mockLoginByGoogleUser(): Promise<UserCredential>;
}
