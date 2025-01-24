import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Dropdown } from 'primeng/dropdown';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { Select } from '../../@models/select.model';
import { AppSettingService } from '../../@services/app-setting.service';
import { HttpService } from '../../@services/http.service';

@Component({
  selector: 'aps-custom-select',
  templateUrl: './aps-custom-select.component.html',
  styleUrls: ['./aps-custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsCustomSelectComponent),
      multi: true,
    },
  ],
})
export class ApsCustomSelectComponent implements OnInit, OnChanges, ControlValueAccessor {
  loadingOptions: boolean = false;

  direction: string = '';
  @ViewChild('dropdown') dropdown: Dropdown;
  @Input('value') val: any;

  elementId: string;
  displayName: string = '';

  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  class: string = 'select-control';
  @Input() colorClass: string;

  error: any;

  style: string;

  @Input() backgroundStyle: string = 'normal'; // normal, primary

  @Input() showLabel: boolean = true;
  @Input() id!: string;
  @Input() name!: string;
  @Input() label!: string;

  @Input() data!: Select[];

  @Input() required: boolean;
  @Input() showDelete?: boolean;
  @Input() helpText?: string;
  @Input() errorMessage?: string = 'This Field is Required';
  @Input() icon?: string;

  @Input() dataUrl?: string;
  @Input() reqBody?: any;
  @Input() isLoadUrlData?: boolean = true;

  @Output() change = new EventEmitter<any>();
  @Output() focusout = new EventEmitter<Event>();

  onChange: any = (val: any) => {};

  onTouched: any = () => {};

  showOptions: boolean = false;
  fromUISelection: boolean = false;
  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
    this.displayName = d ? d.displayName : '';
    if (this.fromUISelection) {
      this.change.emit(d);
      this.fromUISelection = false;
    }
    this.onTouched();
    this.validate();
  }

  constructor(private httpService: HttpService, private appSettingService: AppSettingService) {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.style = appSetting.formControlStyle;
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      this.direction = extraSetting.direction;
    });
  }

  ngOnInit(): void {
    this.colorClass = this.colorClass ? this.colorClass : '';
    this.class = this.class + ' ' + this.colorClass;

    if (!this.data) {
      this.data = [];
      this.getUrlData();
    }

    if (!this.val || this.val === undefined) {
      this.val = '';
    } else {
      const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
      this.displayName = d ? d.displayName : '';
    }

    this.elementId =
      (this.id ? this.id : this.name ? this.name : '' + new Date().getTime()) +
      (this.label ? (this.label ? this.label.replace(' ', '_') : '') : '');

    if (this.required !== false && this.required !== undefined) {
      this.required = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.val || this.val === undefined) {
      this.val = '';
      this.displayName = '';
    } else {
      const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
      if (d) {
        this.displayName = d.displayName;
      } else {
        this.val = '';
        this.displayName = '';
      }
    }

    this.getUrlData();
  }

  toggleDropdown(event: any) {
    if (this.dropdown.disabled || this.dropdown.readonly || this.dropdown.isInputClick(event)) {
      return;
    }
    this.dropdown.onClick.emit(event);
    this.dropdown.accessibleViewChild.nativeElement.focus();
    if (this.dropdown.overlayVisible) {
      this.dropdown.documentClickListener = null;
      this.dropdown.hide();
    } else {
      this.dropdown.documentClickListener = () => {};
      this.dropdown.show();
    }

    this.dropdown.cd.detectChanges();
  }

  hideDropdown(event: any) {
    if (this.dropdown.disabled || this.dropdown.readonly || this.dropdown.isInputClick(event)) {
      return;
    }
    this.dropdown.onClick.emit(event);
    this.dropdown.accessibleViewChild.nativeElement.focus();
    this.dropdown.documentClickListener = null;
    this.dropdown.hide();
    this.dropdown.cd.detectChanges();
    this.focusout.emit(event);
  }

  onClickDropdown(event: any) {
    const selectElement = document.getElementById(this.elementId);

    setTimeout(() => {
      selectElement.focus();
    }, 0);
  }

  getUrlData() {
    if (this.isLoadUrlData && this.dataUrl) {
      this.loadingOptions = true;

      const data = { dataMap: this.reqBody ? this.reqBody : {} };

      this.httpService.httpPost(this.dataUrl, data).subscribe((res: any) => {
        this.data = res && res.dataList ? res.dataList : [];

        const d = this.data ? this.data.find((dt: Select) => dt.id === this.val) : '';
        if (d) {
          this.displayName = d.displayName;
        } else {
          this.val = '';
          this.displayName = '';
        }

        this.loadingOptions = false;
      });
    }
  }

  onOptionSelect(value: any) {
    this.fromUISelection = true;
    this.value = value;
    this.showOptions = false;
  }

  // openSelectOptions(id: string) {
  //   if (!this.disabled) {
  //     this.showOptions = true;
  //   }
  // }

  // onArrowClick(id: string) {
  //   const selectElement = document.getElementById(this.elementId);

  //   setTimeout(() => {
  //     selectElement.focus();
  //   }, 0);
  // }

  // closeSelectOptions(event: Event) {
  //   setTimeout(() => {
  //     this.showOptions = false;
  //   }, 200);
  //   setTimeout(() => {
  //     this.focusout.emit(event);
  //   }, 400);
  // }

  touched() {
    this.validate();
  }

  validate() {
    if (this.required) {
      if (!this.value) {
        this.error = true;
        return;
      }
      this.error = false;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }
}
