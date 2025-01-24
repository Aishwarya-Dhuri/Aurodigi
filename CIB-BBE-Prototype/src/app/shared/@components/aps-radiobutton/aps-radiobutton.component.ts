import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'aps-radiobutton',
  templateUrl: './aps-radiobutton.component.html',
  styleUrls: ['./aps-radiobutton.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsRadiobuttonComponent),
      multi: true,
    },
  ],
})
export class ApsRadiobuttonComponent implements OnInit {
  @Input('label') label: string;
  value?: string = '';

  onChange: any = (value: string) => {};
  onTouched: any = () => {};

  constructor() {}

  ngOnInit(): void {}
}
