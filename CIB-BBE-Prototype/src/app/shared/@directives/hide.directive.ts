import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[apsHide]',
})
export class HideDirective implements OnChanges {
  @Input('apsHide') hide: boolean = false;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnChanges() {
    if (this.hide) {
      this.renderer.setStyle(this.elRef.nativeElement, 'display', 'none');
      /* this.renderer.setStyle(this.elRef.nativeElement, 'visibility', 'hidden');
      this.renderer.setStyle(this.elRef.nativeElement, 'height', '0');
      this.renderer.setStyle(this.elRef.nativeElement, 'width', '0'); */
    } else {
      this.renderer.removeStyle(this.elRef.nativeElement, 'display');
      // this.renderer.setStyle(this.elRef.nativeElement, 'display', 'block');
      /* this.renderer.removeStyle(this.elRef.nativeElement, 'visibility');
      this.renderer.removeStyle(this.elRef.nativeElement, 'height');
      this.renderer.removeStyle(this.elRef.nativeElement, 'width'); */
    }
  }
}
