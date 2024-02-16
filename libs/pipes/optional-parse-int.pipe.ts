import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
  transform(value: string): number | undefined {
    return value ? parseInt(value, 10) : undefined;
  }
}
