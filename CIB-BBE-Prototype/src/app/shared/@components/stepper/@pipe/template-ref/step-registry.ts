import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StepRegistry {
  templates: { [name: string]: TemplateRef<any> } = Object.create(null);
}
