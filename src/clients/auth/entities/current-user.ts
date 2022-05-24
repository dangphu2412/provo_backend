import { Role } from '@auth/auth.constant';

export interface UserFromAuth {
  id: string;
  roles: Role[];
}
