import {
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { AppSettingService } from '../../@services/app-setting.service';

@Component({
  selector: 'aps-form-input',
  templateUrl: './form-input-field.component.html',
  styleUrls: ['./form-input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputFieldComponent),
      multi: true,
    },
  ],
})
export class FormInputFieldComponent implements OnInit, ControlValueAccessor {
  direction: string = '';

  @HostBinding('attr.style')
  style: string = '';
  value?: string = '';

  //required
  @Input() id!: string;
  @Input() name!: string;
  @Input() label!: string;

  //optional
  @Input('type') type?: string = 'text';
  @Input('inputType') inputType?: string = 'normal';
  @Input() minLength?: number;
  @Input() maxLength?: number;
  @Input() icon?: string;
  @Input() helpText?: string;
  errorMessage: string; // = 'This Field is Required';

  @Input() showLabel: boolean = true;
  @Input() showClear: boolean = false;
  @Input() rightIcon: string;
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() error: boolean = false;
  @Input() customErrorMessage: string = '';

  @Output() focus = new EventEmitter<Event>();
  @Output() focusout = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  @Output() onRightIcon = new EventEmitter<void>();

  private parseError: boolean;

  @Input() disabled = false;

  onChange: any = (value: string) => {};

  onTouched: any = () => {};

  constructor(private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.style = appSetting.formControlStyle;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
  }

  ngOnInit(): void {
    if (
      ![
        'normal',
        'numeric',
        'alphaNumeric',
        'noSpaceAlphaNumeric',
        'noSpace',
        'currencyFormatNotZero',
      ].includes(this.inputType)
    ) {
      this.inputType = 'normal';
    }
  }

  onRightIconClick() {
    this.onRightIcon.emit();
  }

  touched() {
    this.onTouched();
    this.validate();
  }

  changed(event: Event): void {
    const value: string = (<HTMLInputElement>event.target).value;

    this.onChange(value);

    this.value = value;
    this.validate();
  }

  onFocus(event: Event): void {
    this.focus.emit(event);
  }

  onFocusOut(event: Event): void {
    this.focusout.emit(event);
  }

  onBlur(event: Event): void {
    this.blur.emit(event);
  }

  validate() {
    if (this.required) {
      if (!this.value) {
        // this.error = true;
        this.errorMessage = 'This field is required';
        return;
      } else if (this.customErrorMessage) {
        this.errorMessage = this.customErrorMessage;
        return;
      }

      // this.error = false;
      this.errorMessage = '';
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
    this.disabled = isDisabled;
  }
}
