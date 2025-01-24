import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityComponent } from './accessibility.component';
import { SharedModule } from '../shared/shared.module';
import { AccessibilityModalComponent } from './@components/accessibility-modal/accessibility-modal.component';

@NgModule({
  declarations: [AccessibilityComponent, AccessibilityModalComponent],
  imports: [CommonModule, SharedModule],
  exports: [AccessibilityComponent],
})
export class AccessibilityModule {}
