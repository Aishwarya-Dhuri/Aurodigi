import { Pipe, PipeTransform } from '@angular/core';

import * as converter from 'number-to-words';

@Pipe({
  name: 'numberToWord',
})
export class NumberToWordPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    const word = converter.toWords(value);
    return word.replace(',', '').replace('-', ' ');
  }
}
