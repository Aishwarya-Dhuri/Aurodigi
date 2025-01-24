import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'apsTranslate',
})
export class ApsTranslatePipe implements PipeTransform {
  constructor(private translate: TranslatePipe) {}

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return;
    }
    let label = 'lbl_' + value.replace(/\s/g, '_');
    label = label.toLowerCase();

    let translatedVal = this.translate.transform(label);
    if (translatedVal === label) {
      translatedVal = value;
      const data = `"${label}": "${value}",`;
      if (!environment.langData.includes(data)) {
        environment.langData += data + '\n';
      }
    }
    return translatedVal;
  }
}
