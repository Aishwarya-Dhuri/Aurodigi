import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[currencyFormatNotZero]',
})
export class CurrencyFormatNotZeroDirective {
  constructor(private el: ElementRef) {
    el.nativeElement.style.textAlign = 'right';
  }

  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
  ];

  private regex: RegExp = new RegExp(/^([0-9]{1,13})(\.[0-9]{0,2})?$/g);

  @HostListener('blur', ['$event']) onBlur(event: any) {
    let initalValue = this.el.nativeElement.value;

    if (!initalValue) {
      initalValue = '0';
    }

    const formattedVal = parseFloat(initalValue).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

    this.el.nativeElement.value = formattedVal;
  }

  @HostListener('focus', ['$event']) onFocus(event: any) {
    const initVal = this.el.nativeElement.value.replace(/,/g, '');
    this.el.nativeElement.value = initVal;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key === 'Decimal' ? '.' : event.key,
      current.slice(position),
    ].join('');

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
