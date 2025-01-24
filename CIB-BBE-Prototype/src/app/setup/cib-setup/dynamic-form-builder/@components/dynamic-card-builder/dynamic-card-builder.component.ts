import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DirTypes, DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG } from 'src/app/shared/@config/dynamic-form-gridster.config';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { DraggableItem } from '../../@models/dynamic-form-builder';
import { DynamicFormBuilderService } from '../../@service/dynamic-form-builder.service';

@Component({
  selector: 'app-dynamic-card-builder',
  templateUrl: './dynamic-card-builder.component.html',
  styleUrls: ['./dynamic-card-builder.component.scss'],
})
export class DynamicCardBuilderComponent implements OnInit, OnChanges {
  @Input('parentRef') parentRef: any;
  @Input('height') parentHeight: number;
  @Input('width') parentWidth: GridsterItem;
  @Input('parentGridItem') parentGridItem: GridsterItem;
  isGridEdit: boolean = true;
  CARD_ACTION_HEIGHT: number = 42;
  cardHeight: number = 200;
  options: GridsterConfig = { ...DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG };

  constructor(
    private appSettingService: AppSettingService,
    private dynamicFormBuilderService: DynamicFormBuilderService,
  ) {
    this.options.mobileBreakpoint = 100;
    this.options.minRows = 6;
    this.options.maxItemRows = 6;
    this.options.emptyCellDropCallback = this.onItemDrop.bind(this);
    this.options.draggable.dragHandleClass = 'drag-field-selector';
    this.refreshGrid();
  }

  ngOnInit(): void {
    if (!this.parentGridItem || !this.parentGridItem.cardData) this.parentGridItem.cardData = [];
    this.dynamicFormBuilderService.getGridEdit().subscribe((isGridEdit: boolean) => {
      this.isGridEdit = isGridEdit;

      if (this.options) {
        if (this.isGridEdit) {
          this.options.displayGrid = DisplayGrid.Always;
          this.options.draggable.enabled = true;
          this.options.resizable = { enabled: true };
          this.options.enableEmptyCellDrop = true;
          this.options.enableEmptyCellDrag = true;
          this.options.enableOccupiedCellDrop = true;
        } else {
          this.options.displayGrid = DisplayGrid.None;
          this.options.draggable.enabled = false;
          this.options.resizable = { enabled: false };
          this.options.enableEmptyCellDrop = false;
          this.options.enableEmptyCellDrag = false;
          this.options.enableOccupiedCellDrop = false;
        }
        this.refreshGrid();
      }
    });
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

  onItemDrop(event: MouseEvent, item: GridsterItem): void {
    let draggedItem: DraggableItem = this.dynamicFormBuilderService.getDraggedItem();
    if (draggedItem && !['CARD'].includes(draggedItem.itemType)) {
      draggedItem.x = item.x;
      draggedItem.y = item.y;
      draggedItem.elementId = new Date().getTime().toString();
      this.parentGridItem.cardData.push({ ...draggedItem });
      this.dynamicFormBuilderService.setDraggedItem(null);
      this.parentRef.configureItem(
        this.parentGridItem.cardData[this.parentGridItem.cardData.length - 1],
      );
    }
  }

  removeItem(item: any): void {
    this.parentGridItem.cardData.splice(this.parentGridItem.cardData.indexOf(item), 1);
  }
}
