import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AssignRightsCheckboxRendererComponent } from '../../security-bank/bank-role/@components/assign-rights-checkbox-renderer/assign-rights-checkbox-renderer.component';
import { CorporateRole, RoleRights, RoleWidget } from './@models/role.model';

@Component({
  selector: 'app-corporate-role',
  templateUrl: './corporate-role.component.html',
  styleUrls: ['./corporate-role.component.scss'],
})
export class CorporateRoleComponent implements OnInit {
  @Input('viewOnAnotherComponent') viewOnAnotherComponent: boolean = false;
  formData: CorporateRole = new CorporateRole();
  mode: string = '';
  loginType: string = '';
  stepperDetails: Stepper = {
    masterName: 'Role',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    headings: ['Role Details', 'Assign Role', 'Widgets', 'Review Details'],
  };

  @ViewChild('roleDetailsForm') roleDetailsForm: any;

  assignRightGridOptions: any = {
    rowModelType: 'clientSide',
    /* suppressChangeDetection: true, */
    treeData: true,
    context: { componentParent: this },
    pagination: false,
    autoGroupColumnDef: {
      headerName: 'Sub Module',
      width: 440,
    },
    getDataPath: function (data: any) {
      return data.displayName;
    },
    frameworkComponents: {
      assignRightsCheckboxRenderer: AssignRightsCheckboxRendererComponent,
    },
  };
  assignRightGridData: any[];
  selectedRightMenuIds: string[] = [];
  isAssignRightGridDataLoaded: boolean = false;

  widgetList: any[];
  selectedWidgets: any[] = [];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private userService: UserService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    /* remove below : starts */
    if (!this.viewOnAnotherComponent) {
      const actions: Actions = {
        heading: 'Bank Role Initiate',
        refresh: true,
        print: true,
        relationshipManager: true,
        quickLinks: true,
      };
      this.actionsService.setActions(actions);
      const breadcrumbs: Breadcrumb[] = [
        { icon: 'fa-home' },
        { label: 'Setup' },
        { label: 'Security-Corporate' },
        { label: 'Corporate Role' },
      ];
      this.breadcrumbService.setBreadCrumb(breadcrumbs);
    }
    /* remove below : ends */
    if (!this.viewOnAnotherComponent) {
      this.getViewData();
    }
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateRole/private/view', data)
        .subscribe((formData: any) => {
          this.setViewData(formData);
        });
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  resetCorporate(): void {
    if (this.formData.roleType) {
      this.formData.corporateId = '';
      this.formData.corporateCode = '';
      this.formData.corporateName = '';
    }
  }

  setViewData(formData: any): void {
    this.viewService.clearAll();
    this.formData = formData;
    this.getRightsList();
    this.getWidgetList();
    if (this.mode == 'VIEW') this.stepperDetails.currentStep = this.stepperDetails.headings.length;
    /* formData.assignRole.forEach((element, i) => {
            formData.assignRole[i].displayName = element.displayName.split(',');
          }); */
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.roleDetailsForm) {
      return this.roleDetailsForm.valid;
    } else if (stepNo == 2) {
      return this.selectedRightMenuIds.length > 0;
      // return this.assignRightCount > 0;
    }
    return true;
  }

  getSubHeading(stepNo: number): string {
    if (stepNo === 1) {
      return 'Module Name : ' + this.formData.moduleName;
    } else if (stepNo === 2) {
      return 'Assign Roles : ' + this.selectedRightMenuIds.length;
    } else if (stepNo === 3) {
      return 'Number of Widgets : ' + this.selectedWidgets.length;
    }
    return '';
  }

  onModuleChange(module: Select): void {
    this.formData.moduleName = module.displayName;
    this.getRightsList();
    this.getWidgetList();
  }

  getRightsList(): void {
    const reqData = { dataMap: { moduleId: this.formData.moduleId } };
    this.httpService
      .httpPost('commons/menuService/private/getCorporateAccessRightList', reqData)
      .subscribe((res: any) => {
        this.assignRightGridData = res.dataList;
        if (this.mode) {
          this.updateRightGridData();
        }
        this.isAssignRightGridDataLoaded = true;
      });
  }

  updateRightGridData(): void {
    this.selectedRightMenuIds = [];
    this.formData.assignRightList.forEach((rights: RoleRights) => {
      const gridIndex: number = _.findIndex(this.assignRightGridData, function (row: any) {
        return row.menuId == rights.menuId;
      });
      if (gridIndex != -1) {
        this.assignRightGridData[gridIndex].VIEW = rights.VIEW;
        this.assignRightGridData[gridIndex].DATA_ENTRY = rights.DATA_ENTRY;
        this.assignRightGridData[gridIndex].AUTHORIZE = rights.AUTHORIZE;
        this.assignRightGridData[gridIndex].ENABLE_DISABLE = rights.ENABLE_DISABLE;
        this.assignRightGridData[gridIndex].EXECUTE = rights.EXECUTE;
        this.assignRightGridData[gridIndex].SELFAUTH = rights.SELFAUTH;
        this.assignRightGridData[gridIndex].VERIFER = rights.VERIFER;
        if (this.assignRightGridData[gridIndex].displayName.length > 1) {
          this.selectedRightMenuIds.push(rights.menuId);
        }
      }
    });
  }

  getWidgetList(): void {
    const reqData = { dataMap: { moduleName: this.formData.moduleName } };
    this.httpService
      .httpPost('commons/dashboardService/defaultDashboard/private/getCorporateWidgetData', reqData)
      .subscribe((res: any) => {
        this.widgetList = res.dataList;
        this.widgetList.forEach((widget: any) => {
          widget.imageUrl = this.httpService.getAssetUrl(widget.imageUrl);
          if (widget.mandatory) {
            this.selectedWidgets.push(widget.id);
          }
        });
        if (this.mode) {
          this.updateWidgetList();
        }
      });
  }

  updateWidgetList(): void {
    this.formData.widgetList.forEach((widget: RoleWidget) => {
      if (!this.selectedWidgets.includes(widget.widgetId))
        this.selectedWidgets.push(widget.widgetId);
    });
  }

  updateSelectedAssignRightMenuIds(row: any): void {
    if (this.isRightAssignForRow(row) && !this.selectedRightMenuIds.includes(row.menuId)) {
      this.selectedRightMenuIds.push(row.menuId);
    } else if (!this.isRightAssignForRow(row) && this.selectedRightMenuIds.includes(row.menuId)) {
      this.selectedRightMenuIds.splice(this.selectedRightMenuIds.indexOf(row.menuId), 1);
    }
  }

  beforeSubmit(): boolean {
    this.formData.assignRightList = [];
    this.assignRightGridData.forEach((row: any) => {
      if (row.displayName[0] != 'All' && this.isRightAssignForRow(row)) {
        this.formData.assignRightList.push(this.generateRightRow(row));
      }
    });
    this.formData.widgetList = [];
    this.selectedWidgets.forEach((wdgetId: string) => {
      this.formData.widgetList.push({ widgetId: wdgetId });
    });

    return true;
  }

  isRightAssignForRow(row: any): boolean {
    return (
      row.VIEW ||
      row.DATA_ENTRY ||
      row.AUTHORIZE ||
      row.ENABLE_DISABLE ||
      row.EXECUTE ||
      row.SELFAUTH ||
      row.VERIFER
    );
  }

  generateRightRow(row: any): RoleRights {
    let rights: RoleRights = new RoleRights();
    rights.id = row.id ? row.id : '';
    rights.version = row.version ? row.version : '';
    rights.mstId = row.mstId ? row.mstId : '';
    rights.moduleId = row.moduleId;
    rights.menuId = row.menuId;
    rights.parentMenuId = row.parentMenuId;
    rights.VIEW = row.VIEW;
    rights.DATA_ENTRY = row.DATA_ENTRY;
    rights.AUTHORIZE = row.AUTHORIZE;
    rights.ENABLE_DISABLE = row.ENABLE_DISABLE;
    rights.EXECUTE = row.EXECUTE;
    rights.SELFAUTH = row.SELFAUTH;
    rights.VERIFER = row.VERIFER;
    return rights;
  }
}
