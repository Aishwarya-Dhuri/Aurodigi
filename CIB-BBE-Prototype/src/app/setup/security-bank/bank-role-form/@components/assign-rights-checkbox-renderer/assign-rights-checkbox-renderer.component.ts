import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-assign-rights-checkbox-renderer',
  template: `
    <div style="display: flex;padding: 0.5rem;">
      <p-checkbox
        [name]="id"
        [id]="id"
        [binary]="true"
        [(ngModel)]="isCheck"
        [disabled]="
          activeStep === 4 ? true : false || checkDisable(params.node.data, params.colDef.field)
        "
        (onChange)="onChange()"
      ></p-checkbox>
    </div>
  `,
})
export class AssignRightsCheckboxRendererComponent implements AgRendererComponent {
  id!: string;
  activeStep: any;
  isCheck: any;
  params: ICellRendererParams;
  data: any;
  accessName: string;

  constructor() {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.id = params.data.id;
    this.activeStep = params.context.componentParent.stepperDetails.currentStep;
    this.isCheck = params.value ? params.value : false;
    this.data = params.node.data;
    this.accessName = params.colDef.field;
    this.params.node.setDataValue(this.accessName, this.isCheck);
    /* if (this.data.displayName[0] == 'All') {
      this.updateAllCheckbox();
    } else  */ if (this.data.displayName.length > 1)
      this.updateParentCheckbox(this.data.displayName[0]);
  }

  checkDisable(data: any, column: string): boolean {
    if (data.isViewApplicable && column == 'VIEW') {
      return false;
    }
    if (data.isDataEntryApplicable && column == 'DATA_ENTRY') {
      return false;
    }
    if (data.isAuthorizeApplicable && column == 'AUTHORIZE') {
      return false;
    }
    if (data.isEnableDisableApplicable && column == 'ENABLE_DISABLE') {
      return false;
    }
    if (data.isExecuteApplicable && column == 'EXECUTE') {
      return false;
    }
    if (data.isSelfAuthApplicable && column == 'SELFAUTH') {
      return false;
    }
    if (data.isVeriferApplicable && column == 'VERIFER') {
      return false;
    }
    return true;
  }

  onChange(): void {
    if (this.data.displayName[0] == 'All') {
      this.params.api.forEachNode((node: any) => {
        if (!this.checkDisable(node.data, this.params.colDef.field)) {
          node.setDataValue(this.accessName, this.isCheck);
          if (node.data.displayName.length > 1) {
            this.params.context.componentParent.updateSelectedAssignRightMenuIds(node.data);
          }
        }
      });
    } else if (this.data.displayName.length == 1) {
      this.params.api.forEachNode((node: any) => {
        if (
          node.data.displayName[0] == this.data.displayName[0] &&
          !this.checkDisable(node.data, this.params.colDef.field)
        ) {
          node.setDataValue(this.accessName, this.isCheck);
          if (node.data.displayName.length > 1) {
            this.params.context.componentParent.updateSelectedAssignRightMenuIds(node.data);
          }
        }
      });
      this.updateAllCheckbox();
    } else {
      this.params.node.setDataValue(this.accessName, this.isCheck);
      this.params.context.componentParent.updateSelectedAssignRightMenuIds(this.params.node.data);
      this.updateParentCheckbox(this.data.displayName[0]);
    }
  }

  updateParentCheckbox(parentDisplayName: string): void {
    let childCount = 0;
    let selectedCount = 0;
    let disabledCount = 0;
    this.params.api.forEachNode((node: any) => {
      if (node.data.displayName.length > 1 && node.data.displayName[0] == parentDisplayName) {
        childCount++;
        if (node.data[this.accessName]) {
          selectedCount++;
        }
        if (this.checkDisable(node.data, this.accessName)) {
          disabledCount++;
        }
      }
    });
    if (childCount == disabledCount) return;
    this.params.api.forEachNode((node: any) => {
      if (node.data.displayName.length == 1 && node.data.displayName[0] == parentDisplayName) {
        node.setDataValue(this.accessName, childCount === selectedCount + disabledCount);
      }
    });
    this.updateAllCheckbox();
  }

  updateAllCheckbox(): void {
    let parentCount = 0;
    let selectedCount = 0;
    let disabledCount = 0;
    this.params.api.forEachNode((node: any) => {
      if (node.data.displayName.length == 1 && node.data.displayName[0] != 'All') {
        parentCount++;
        if (node.data[this.accessName]) {
          selectedCount++;
        }
        if (this.checkDisable(node.data, this.accessName)) {
          disabledCount++;
        }
      }
    });
    if (parentCount == disabledCount) return;
    this.params.api.forEachNode((node: any) => {
      if (node.data.displayName[0] == 'All') {
        node.setDataValue(this.accessName, parentCount === selectedCount + disabledCount);
      }
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
