import { Pipe, PipeTransform, TemplateRef } from '@angular/core';
import { StepRegistry } from './step-registry';

@Pipe({
  name: 'stepRefTemplate',
})
export class StepRefPipe implements PipeTransform {
  constructor(private stepRegistry: StepRegistry) {}

  transform(name: string): TemplateRef<any> | undefined {
    return this.stepRegistry.templates[name];
  }
}
