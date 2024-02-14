import { HashService } from '@classting/hash/hash.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
