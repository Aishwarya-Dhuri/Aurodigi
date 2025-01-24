import { Component, forwardRef, HostBinding, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'aps-text-area',
  templateUrl: './aps-text-area.component.html',
  styleUrls: ['./aps-text-area.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsTextAreaComponent),
      multi: true,
    },
  ],
})
export class ApsTextAreaComponent implements OnInit, ControlValueAccessor {
  @Input()
  @HostBinding('attr.style')
  style: string = '';
  value?: string;
  @Input()
  styleTag?: string;

  //required
  @Input() label?: string;
  @Input() rows?: number;

  //optional
  @Input() cols?: number;
  @Input() placeholder: string = ' ';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() readOnly: boolean = false;
  @Input() required: boolean = false;
  @Input() helpText?: string;
  error: boolean = false;

  constructor(private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.style = appSetting.formControlStyle;
    });
  }

  ngOnInit(): void {
    // this.style = this.service.getStyle();
    if (this.styleTag != undefined) {
      this.style = this.styleTag;
    }
  }

  onChange: any = (value: string) => {};
  onTouched: any = () => {};
  isDisabled = false;

  changed(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;
    this.onChange(value);
    this.value = value;
    if (this.required) {
      if (!value) {
        this.error = true;
        return;
      }
      this.error = false;
    }
  }
  clearInput(): void {
    this.value = '';
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
