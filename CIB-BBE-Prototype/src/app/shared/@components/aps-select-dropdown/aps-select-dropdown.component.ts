import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
import { AppSetting, ExtraSetting } from '../../@models/app-setting';
import { Select } from '../../@models/select.model';
import { AppSettingService } from '../../@services/app-setting.service';
import { HttpService } from '../../@services/http.service';

@Component({
  selector: 'aps-multi-select',
  templateUrl: './aps-select-dropdown.component.html',
  styleUrls: ['./aps-select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApsSelectDropdownComponent),
      multi: true,
    },
  ],
})
export class ApsSelectDropdownComponent implements OnInit, OnChanges {
  @ViewChild('multiSelect') multiSelect: MultiSelect;

  loadingOptions: boolean = false;

  direction: string = '';

  @Input('value') val: any;
  @Input('showCount') showCount: boolean = true;

  multiSelectData: string[] = [];

  elementId: string;
  displayName: string = '';
  displayCount: string = '';

  @Input() showToggleAll: boolean = false;
  @Input() showHeader: boolean = false;
  @Input() filter: boolean = false;
  @Input('disabled') isDisabled: boolean = false;
  @Input('headerTemplate') headerTemplate?: TemplateRef<any>;
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

  set value(val: any) {
    this.val = val;
    this.onChange(val);

    const data: any = this.data
      ? this.data.filter((dt: Select) => this.val.split(', ').includes(dt.id.toString()))
      : '';

    let displayValue = '';

    data.forEach((d: any) => {
      displayValue += d.displayName + ', ';
    });

    this.displayName = displayValue;
    this.displayCount =
      data.length > 0 ? data.length + ' ' + this.label.replace('Select', '') + ' Selected' : '';

    if (this.fromUISelection) {
      this.change.emit(val.split(', '));
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
      const data: any = this.data
        ? this.data.filter((dt: Select) => this.val.split(', ').includes(dt.id.toString()))
        : '';

      let displayValue = '';

      data.forEach((d: any) => {
        displayValue += d.displayName + ', ';
      });
      this.displayName = displayValue;
      this.displayCount =
        data.length > 0 ? data.length + ' ' + this.label.replace('Select', '') + ' Selected' : '';
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
      this.multiSelectData = [];
      this.displayName = '';
      this.displayCount = '';
    } else {
      const data: any = this.data
        ? this.data.filter((dt: Select) => this.val.split(', ').includes(dt.id.toString()))
        : '';
      if (data) {
        let displayValue = '';
        const multiSelectValue = [];
        data.forEach((d: any) => {
          multiSelectValue.push(d.id);
          displayValue += d.displayName + ', ';
        });

        this.multiSelectData = multiSelectValue;
        this.displayName = displayValue;
        this.displayCount =
          data.length > 0 ? data.length + ' ' + this.label.replace('Select', '') + ' Selected' : '';
      } else {
        this.val = '';
        this.multiSelectData = [];
        this.displayName = '';
        this.displayCount = '';
      }
    }

    this.getUrlData();
  }

  toggleDropdown(event: any) {
    if (this.multiSelect.disabled || this.multiSelect.readonly) {
      return;
    }
    this.multiSelect.onClick.emit(event);
    this.multiSelect.accessibleViewChild.nativeElement.focus();
    if (this.multiSelect.overlayVisible) {
      this.multiSelect.documentClickListener = null;
      this.multiSelect.hide();
    } else {
      this.multiSelect.documentClickListener = () => {};
      this.multiSelect.show();
    }

    this.multiSelect.cd.detectChanges();
  }

  hideDropdown(event: any) {
    if (this.multiSelect.disabled || this.multiSelect.readonly) {
      return;
    }
    this.multiSelect.onClick.emit(event);
    this.multiSelect.accessibleViewChild.nativeElement.focus();
    this.multiSelect.documentClickListener = null;
    this.multiSelect.hide();
    this.multiSelect.cd.detectChanges();
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

        const data1: any = this.data
          ? this.data.filter((dt: Select) => this.val.split(', ').includes(dt.id.toString()))
          : '';

        if (data1) {
          let displayValue = '';
          const multiSelectValue = [];
          data1.forEach((d: any) => {
            multiSelectValue.push(d.id);
            displayValue += d.displayName + ', ';
          });
          this.multiSelectData = multiSelectValue;
          this.displayName = displayValue;
          this.displayCount =
            data1.length > 0
              ? data1.length + ' ' + this.label.replace('Select', '') + ' Selected'
              : '';
        } else {
          this.val = '';
          this.multiSelectData = [];
          this.displayName = '';
          this.displayCount = '';
        }

        this.loadingOptions = false;
      });
    }
  }

  onOptionSelect(value: any) {
    this.fromUISelection = true;
    this.value = value.join(', ');
    this.showOptions = false;
  }

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

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }
}
