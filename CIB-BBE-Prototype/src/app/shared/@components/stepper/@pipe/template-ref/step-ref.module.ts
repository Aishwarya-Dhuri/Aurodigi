import { NgModule } from '@angular/core';
import { StepRefDirective } from './step-ref.directive';
import { StepRefPipe } from './step-ref.pipe';

@NgModule({
  declarations: [StepRefDirective, StepRefPipe],
  exports: [StepRefDirective, StepRefPipe],
})
export class StepRefModule {}
