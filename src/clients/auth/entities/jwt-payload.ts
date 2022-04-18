export interface JwtPayload {
  sub: string;
  realmAccess?: Record<string, string[]>;
  resourceAccess?: Record<string, string[]>;
}
