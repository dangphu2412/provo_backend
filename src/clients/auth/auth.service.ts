import { UserCredential } from './entities/user-credential';
import { GoogleUser } from './google.authenticator';

export const AuthServiceToken = 'AuthService';

export interface AuthService {
  login(googleUser: GoogleUser): Promise<UserCredential>;
  login(): Promise<UserCredential>;
}
