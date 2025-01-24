import { Validators } from '@angular/forms';
import { Master } from 'src/app/shared/@forms/master.form';

export const CorporateProfile: { [key: string]: any } = {
  ...Master,
  profileCode: ['', Validators.required],
  profileName: ['', Validators.required],
};
