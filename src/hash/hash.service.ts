import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  public async hash(target: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(target, salt);
  }

  public async compare(source: string, target: string): Promise<boolean> {
    return await bcrypt.compare(source, target);
  }
}
