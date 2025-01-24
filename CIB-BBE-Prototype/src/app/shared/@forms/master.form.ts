import { Validators } from '@angular/forms';
import { MakerChecker } from './maker-checker.form';

export const Master: { [key: string]: any } = {
  ...MakerChecker,
  enabled: [],
  effectiveFrom: ['', Validators.required],
  effectiveTill: [],
};
