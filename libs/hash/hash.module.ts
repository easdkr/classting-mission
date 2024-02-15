import { HashService } from '@libs/hash/hash.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
