import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagToBlankSpace',
})
export class TagToBlankSpacePipe implements PipeTransform {
  transform(value: any): any {
    const regExpression = /<<(.*?)>>/g;
    const transformedStr = value.replace(regExpression, '_____');
    return transformedStr;
  }
}
