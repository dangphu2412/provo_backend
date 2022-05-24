import { Role } from '@auth/auth.constant';

export interface JwtPayload {
  sub: string;
  roles: Role[];
}
