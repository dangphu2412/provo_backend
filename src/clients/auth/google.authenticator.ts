export type GoogleUser = {
  sub: string;
  fullName: string;
  email: string;
  avatar: string;
};

export const GoogleAuthenticatorToken = 'GoogleAuthenticator';

export interface GoogleAuthenticator {
  verify(idToken: string): Promise<GoogleUser>;
}
