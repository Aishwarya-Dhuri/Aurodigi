import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DirTypes, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG } from 'src/app/shared/@config/dynamic-form-gridster.config';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { Select } from 'src/app/shared/@models/select.model';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';

@Component({
  selector: 'app-dynamic-card',
  templateUrl: './dynamic-card.component.html',
  styleUrls: ['./dynamic-card.component.scss'],
})
export class DynamicCardComponent implements OnInit, OnChanges {
  @Input('parentRef') parentRef: any;
  @Input('height') parentHeight: number;
  @Input('width') parentWidth: GridsterItem;
  @Input('parentGridItem') parentGridItem: GridsterItem;
  isGridEdit: boolean = true;
  CARD_ACTION_HEIGHT: number = 42;
  cardHeight: number = 200;
  options: GridsterConfig = { ...DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG };

  constructor(private appSettingService: AppSettingService) {
    this.options.mobileBreakpoint = 100;
    this.options.minRows = 6;
    this.options.maxItemRows = 6;
    this.refreshGrid();
  }

  ngOnInit(): void {
    if (!this.parentGridItem || !this.parentGridItem.cardData) this.parentGridItem.cardData = [];
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      if (this.options && appSetting) {
        this.refreshGrid();
      }
    });
    this.appSettingService.getExtraSettingSubject().subscribe((extraSetting: ExtraSetting) => {
      if (this.options && extraSetting) {
        this.options.dirType = extraSetting.direction == 'ltr' ? DirTypes.LTR : DirTypes.RTL;
        this.refreshGrid();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.parentHeight) {
      this.cardHeight = Math.round(
        this.parentHeight - (this.isGridEdit ? this.CARD_ACTION_HEIGHT : 16),
      );
    }
    if (this.options) {
      this.options.minRows = this.parentGridItem.rows;
    }
    this.refreshGrid();
  }

  refreshGrid(): void {
    if (this.options?.api?.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  updateDisplayValue(item: any): void {
    if (item.componentClassName == 'FORM_INPUT' || item.componentClassName == 'FORM_TIME') {
      item.displayValue = item.value;
    } else if (item.componentClassName == 'FORM_CALENDER') {
      item.displayValue = item.selectionMode == 'range' ? item.value.join('-') : item.value;
    } else if (item.componentClassName == 'FORM_CHECKBOX') {
      item.displayValue = [];
      item.fieldOptionList.forEach((option: any) => {
        if (item.value.includes(option.id)) {
          item.displayValue.push(option.displayName);
        }
      });
      item.displayValue = item.displayValue.join(',');
    } else if (item.componentClassName == 'FORM_RADIO') {
      item.fieldOptionList.forEach((option: any) => {
        if (item.value == option.id) {
          item.displayValue = option.displayName;
        }
      });
    } else if (item.componentClassName == 'FORM_TOGGLE_SWITCH') {
      item.displayValue = item.value ? 'Yes' : 'No';
    }
  }

  updateSelectDisplayValue(option: Select, item: any): void {
    item.displayValue = option.displayName;
  }
}
