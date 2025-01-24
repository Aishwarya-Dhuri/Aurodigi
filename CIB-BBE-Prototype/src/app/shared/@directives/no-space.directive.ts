import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[noSpaceInput]',
})
export class NoSpaceDirective {
  constructor(private _el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this._el.nativeElement.value;

    this._el.nativeElement.value = initalValue.replace(' ', '');

    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
