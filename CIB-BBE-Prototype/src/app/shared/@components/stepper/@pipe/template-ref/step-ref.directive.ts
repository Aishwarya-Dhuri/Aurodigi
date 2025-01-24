import { Directive, Input, TemplateRef } from '@angular/core';
import { StepRegistry } from './step-registry';

@Directive({
  selector: '[stepRefNo]',
})
export class StepRefDirective {
  @Input('stepRefNo')
  stepRefNo: string;
  private name: string;

  constructor(private stepRegistry: StepRegistry, private template: TemplateRef<any>) {}

  ngOnInit(): void {
    this.name = this.stepRefNo;
    this.stepRegistry.templates[this.name] = this.template;
  }

  ngOnDestroy() {
    delete this.stepRegistry.templates[this.name];
  }
}
