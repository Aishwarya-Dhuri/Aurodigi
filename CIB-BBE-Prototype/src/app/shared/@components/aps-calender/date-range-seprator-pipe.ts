import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateRangeSeprator' })
export class DateRangeSepratorPipe implements PipeTransform {
  transform(value: any): string {
    if (Array.isArray(value) && value.length == 2 && value[1]) {
      value = value.join(' - ');
    }
    return value;
  }
}
