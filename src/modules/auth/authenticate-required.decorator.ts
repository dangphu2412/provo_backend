import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

export const AuthenticateRequired = UseGuards(JwtAuthGuard);
