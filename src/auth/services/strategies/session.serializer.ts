import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

export interface SessionDeserializedUser {
  id: number;
  email: string;
}

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: SessionDeserializedUser, done: (err: Error, user: SessionDeserializedUser) => void): void {
    done(null, user);
  }

  deserializeUser(payload: any, done: (err: Error, payload: string) => void): void {
    done(null, payload);
  }
}
