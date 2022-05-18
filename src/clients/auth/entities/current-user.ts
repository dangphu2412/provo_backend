export interface UserFromAuth {
  id: string;
  realmAccess?: Record<string, string[]>;
  resourceAccess?: Record<string, string[]>;
}
