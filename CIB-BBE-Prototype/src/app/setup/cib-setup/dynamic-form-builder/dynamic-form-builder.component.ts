import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DirTypes,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
} from 'angular-gridster2';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG } from 'src/app/shared/@config/dynamic-form-gridster.config';
import { AppSetting, ExtraSetting } from 'src/app/shared/@models/app-setting';
import { Select } from 'src/app/shared/@models/select.model';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { draggableItemList } from './@models/draggable-constants';
import { DraggableItem, DynamicFormBuilder } from './@models/dynamic-form-builder';
import { DynamicFormBuilderService } from './@service/dynamic-form-builder.service';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ActionService } from 'src/app/base/main/@services/action.service';

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.component.html',
  styleUrls: ['./dynamic-form-builder.component.scss'],
})
export class DynamicFormBuilderComponent implements OnInit {
  mode: string;
  formData: DynamicFormBuilder = new DynamicFormBuilder();
  stepperDetails: Stepper = {
    masterName: 'Dynamic Form',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Master Details', 'Dynamic Field Generation', 'Review and Submit'],
  };
  parentMenuListReqData: any = {};
  childMenuListReqData: any = {};
  @ViewChild('step1Details') step1Details: any;

  draggableItemList = draggableItemList;
  options: GridsterConfig = { ...DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG };
  isGridEdit: boolean = true;
  selectedConfigField: DraggableItem | GridsterItem;
  isShowFieldEditModal: boolean = false;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private viewService: ViewService,
    private appSettingService: AppSettingService,
    private dynamicFormBuilderService: DynamicFormBuilderService,
    private toasterService: ToasterService,
  ) {
    this.options.minRows = 12;
    this.options.maxItemRows = 20;
    this.options.emptyCellDropCallback = this.onItemDrop.bind(this);
    this.options.itemChangeCallback = this.updateDimentions.bind(this);
    this.options.itemInitCallback = this.updateDimentions.bind(this);
    this.options.itemResizeCallback = this.updateDimentions.bind(this);
    this.options.draggable.dragHandleClass = 'drag-selector';
    this.refreshGrid();
    this.getViewData();
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Dynamic Form Builder',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'CIB Setup' },
      { label: 'Dynamic Form Builder' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

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

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/cibSetup/dynamicFormBuilder/private/view', data)
        .subscribe((response: any) => {
          this.setViewData(response);
        });
    }
  }

  setViewData(response: any): void {
    this.viewService.clearAll();
    delete response.responseStatus;
    response.gridDataList.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((card: any) => {
          card.fieldOptionList = card.fieldOptionList ? JSON.parse(card.fieldOptionList) : '';
          card.configurationFields = card.configurationFields
            ? JSON.parse(card.configurationFields)
            : '';
        });
      } else {
        item.configurationFields = item.configurationFields
          ? JSON.parse(item.configurationFields)
          : '';
      }
    });
    this.formData = response;
    this.formData.isAvailable = true;
    this.onProductChange({ id: this.formData.moduleId, displayName: this.formData.moduleName });
    this.onParentMenuChange({
      id: this.formData.parentMenuId,
      displayName: this.formData.parentMenu,
      enrichments: { isDynamicFormApplicable: true },
    });
    if (this.mode == 'VIEW') {
      this.stepperDetails.currentStep = 3;
      this.updateIsEdit(false);
    }
  }

  onIsFullMasterChange(): void {
    this.formData.isExistingParentMenu = true;
    this.formData.parentMenuId = '';
    this.formData.parentMenu = '';
    this.formData.menuId = '';
    this.formData.displayName = '';
  }

  onProductChange(module: Select): void {
    this.formData.moduleName = module.displayName;
    this.parentMenuListReqData = {
      isForAdminPortal: this.formData.isForAdminPortal,
      moduleId: this.formData.moduleId,
    };
  }

  onParentMenuChange(parentMenu: Select): void {
    this.formData.parentMenu = parentMenu.displayName;
    if (!this.formData.isFullMaster && !parentMenu.enrichments.isDynamicFormApplicable) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Dynamic Form is not applicable for ' + this.formData.parentMenu,
      });
      setTimeout(() => {
        this.formData.parentMenuId = '';
        this.formData.parentMenu = '';
      }, 10);
    } else {
      this.childMenuListReqData = {
        isForAdminPortal: this.formData.isForAdminPortal,
        parentMenuId: this.formData.parentMenuId,
      };
    }
  }

  onChildMenuChange(childMenu: Select): void {
    this.formData.displayName = childMenu.displayName;
    if (!childMenu.enrichments.isDynamicFormApplicable) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'Dynamic Form is not applicable for ' + this.formData.displayName,
      });
      this.formData.menuId = '';
      this.formData.displayName = '';
    } else if (!this.formData.isFullMaster) {
      const data = {
        filters: [{ name: 'menuId', value: this.formData.menuId }],
      };
      this.httpService
        .httpPost('setup/cibSetup/dynamicFormBuilder/private/view', data)
        .subscribe((response: any) => {
          if (response.id) {
            this.toasterService.showToaster({
              severity: 'error',
              detail: 'Form is already generated for ' + this.formData.displayName,
            });
            this.formData.menuId = '';
            this.formData.displayName = '';
          }
        });
    }
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return (
        this.formData.moduleName +
        ' | ' +
        this.formData.parentMenu +
        ' | ' +
        this.formData.displayName +
        (!this.formData.isFullMaster ? ' | ' + this.formData.stepDisplayName : '')
      );
    } else if (stepNo == 2) {
      return 'No Of Cards : ' + this.formData.gridDataList.length;
    }
    return '';
  }

  onStepChange(stepNo: number, subStepNo: number): void {
    if (stepNo == 2) {
      this.updateIsEdit(true);
      this.refreshGrid();
    } else if (stepNo == 3) {
      this.updateIsEdit(false);
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.step1Details) {
      return this.step1Details.valid;
    } else if (stepNo == 2) {
      return this.formData.gridDataList.length > 0;
    }
    return true;
  }

  updateIsEdit(isEdit: boolean): void {
    this.dynamicFormBuilderService.setGridEdit(isEdit);
    this.refreshGrid();
  }

  updateDimentions(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    item.height = itemComponent.height;
    item.width = itemComponent.width;
  }

  refreshGrid(): void {
    if (this.options?.api?.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  onDragStart(draggedItem: DraggableItem): void {
    this.dynamicFormBuilderService.setDraggedItem(draggedItem);
  }

  onItemDrop(event: MouseEvent, item: GridsterItem): void {
    let draggedItem: DraggableItem = this.dynamicFormBuilderService.getDraggedItem();
    if (draggedItem && ['CARD', 'GENERIC'].includes(draggedItem.itemType)) {
      draggedItem.x = item.x;
      draggedItem.y = item.y;
      draggedItem.elementId = new Date().getTime().toString();
      this.formData.gridDataList.push({ ...draggedItem });
      this.dynamicFormBuilderService.setDraggedItem(null);
      this.configureItem(this.formData.gridDataList[this.formData.gridDataList.length - 1]);
    }
  }

  removeItem(item: any): void {
    this.formData.gridDataList.splice(this.formData.gridDataList.indexOf(item), 1);
  }

  configureItem(draggedItem: DraggableItem | GridsterItem): void {
    this.selectedConfigField = draggedItem;
    if (this.selectedConfigField.isConfigurable) this.isShowFieldEditModal = true;
  }

  beforeSubmit(): boolean {
    let listingColumnCount = 0;
    this.formData.gridDataList.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((field: any) => {
          if (field.isShowInListing) {
            listingColumnCount++;
          }
        });
      }
    });
    if (listingColumnCount > 0 || !this.formData.isFullMaster) {
      this.updateRequestFormData();
      return true;
    } else {
      this.toasterService.showToaster({
        severity: 'error',
        detail: "Mark 'Is Show In Listing' for atleast 1 field",
      });
      return false;
    }
  }

  updateRequestFormData(): void {
    this.formData.gridDataList.forEach((item: any) => {
      if (item.itemType == 'CARD') {
        item.cardData.forEach((field: any) => {
          field.fieldOptionList = field.fieldOptionList
            ? JSON.stringify(field.fieldOptionList)
            : '';
          field.configurationFields = field.configurationFields
            ? JSON.stringify(field.configurationFields)
            : '';
        });
      } else {
        item.configurationFields = item.configurationFields
          ? JSON.stringify(item.configurationFields)
          : '';
      }
    });
  }

  convertToCamelCase(obj: any, key: string, value: string): void {
    obj[key] = _.camelCase(value);
  }

  refreshAgGrid(): void {
    if (this.selectedConfigField.componentClassName != 'AG_GRID') return;
    this.selectedConfigField.isLoaded = false;
    this.selectedConfigField.colDefs.forEach((colDef: any) => {
      if (colDef.filter == 'agNumberColumnFilter') {
        this.selectedConfigField.rowData.forEach((row: any) => {
          if (row[colDef.field] && !isNaN(row[colDef.field])) {
            row[colDef.field] = parseFloat(row[colDef.field]);
          } else {
            row[colDef.field] = 0.0;
          }
        });
      }
    });
    setTimeout(() => {
      this.selectedConfigField.isLoaded = true;
    }, 10);
  }

  updateGridRowField(): void {
    if (!this.selectedConfigField.rowData || this.selectedConfigField.rowData.length == 0) return;
    let removeRowFieldList = Object.keys(this.selectedConfigField.rowData[0]);
    this.selectedConfigField.colDefs.forEach((colDef: any) => {
      let rowIndex = removeRowFieldList.indexOf(colDef.field);
      if (rowIndex != -1) {
        removeRowFieldList.splice(rowIndex, 1);
      } else {
        this.selectedConfigField.rowData.forEach((row: any) => {
          row[colDef.field] = '';
        });
      }
    });
    removeRowFieldList.forEach((field: string) => {
      this.selectedConfigField.rowData.forEach((row: any) => {
        delete row[field];
      });
    });
  }

  addGridRowData(): void {
    this.selectedConfigField.rowData = this.selectedConfigField.rowData
      ? this.selectedConfigField.rowData
      : [];
    let row = {};
    this.selectedConfigField.colDefs.forEach((colDef: any) => {
      if (colDef.filter == 'agNumberColumnFilter') {
        row[colDef.field] = 0.0;
      } else {
        row[colDef.field] = '';
      }
    });
    this.selectedConfigField.rowData.push(row);
  }
}
