import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { ListingAction } from 'src/app/shared/@components/ag-grid-listing/grid-action-renderer/listing-action.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { BankRoleComponent } from '../bank-role/bank-role.component';
import { BankLoginRestriction, BankRoleDetail, BankUser } from './@models/bank-user.model';
@Component({
  selector: 'app-bank-user',
  templateUrl: './bank-user.component.html',
  styleUrls: ['./bank-user.component.scss'],
})
export class BankUserComponent implements OnInit {
  mode!: string;
  formData: BankUser = new BankUser();
  stepperDetails: Stepper = {
    masterName: 'Bank User',
    stepperType: 'VERTICAL',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'Structure Details',
      'Organization Details',
      'Assign Role',
      'Login Restriction Details',
      'Review and Submit',
    ],
  };

  isPasswordVisibale: boolean = false;
  signatureFiles: any[] = [];
  @ViewChild('step1Form') step1Form: any;
  @ViewChild('step2Form') step2Form: any;

  roleFormData: BankRoleDetail = new BankRoleDetail();
  roleListReqData: any = {};
  isFireRoleList: boolean = false;
  roleGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  roleInitGridAPI: any;
  roleReviewGridAPI: any;
  @ViewChild('bankRoleView') bankRoleView: BankRoleComponent;
  isShowRoleViewModal: boolean = false;

  loginRestrictionFormData: BankLoginRestriction = new BankLoginRestriction();
  weekDaysList: Select[] = [];
  filteredWeekDays: Select[] = [];
  loginRestrictionGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  loginRestrictionInitGridAPI: any;
  loginRestrictionReviewGridAPI: any;
  editRestrictionIndex: number = -1;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
    private toasterService: ToasterService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Bank User',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security Bank' },
      { label: 'Bank User' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */
    this.getRestrictionWeekDaysList();
    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/securityBank/bankUser/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.formData.uploadedFileName) {
            this.signatureFiles = [
              {
                fileName: this.formData.uploadedFileName,
                fileSize: this.formData.signatureFileSize,
                progress: 100,
                status: 'Complete',
              },
            ];
          }
          this.formData.roles.forEach((role: BankRoleDetail) => {
            role = this.addRoleGridActions(role);
          });
          if (this.roleInitGridAPI) this.roleInitGridAPI.setRowData(this.formData.roles);
          if (this.roleReviewGridAPI) this.roleReviewGridAPI.setRowData(this.formData.roles);
          this.formData.bankLoginRestrictions.forEach((restriction: BankLoginRestriction) => {
            restriction = this.addRestrictionGridActions(restriction);
          });
          if (this.loginRestrictionInitGridAPI)
            this.loginRestrictionInitGridAPI.setRowData(this.formData.bankLoginRestrictions);
          if (this.loginRestrictionReviewGridAPI)
            this.loginRestrictionReviewGridAPI.setRowData(this.formData.bankLoginRestrictions);
          if (this.mode == 'VIEW')
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
        });
    }
  }

  getRestrictionWeekDaysList(): void {
    this.httpService
      .httpPost('setup/securityBank/bankUser/private/dropdown/restrictionWeekDaysList')
      .subscribe((res: any) => {
        this.weekDaysList = res.dataList;
        this.filteredWeekDays = [...this.weekDaysList];
      });
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && !this.step1Form) {
      return false;
    } else if (stepNo == 1 && this.step1Form) {
      return this.step1Form.valid;
    } else if (stepNo == 2 && this.step2Form) {
      return this.step2Form.valid;
    } else if (stepNo == 3) {
      return this.formData.roles.length > 0;
    } else if (stepNo == 4) {
      return !this.formData.isLoginRestrictions || this.formData.bankLoginRestrictions.length > 0;
    }
    return true;
  }

  getFormCompletionPercent(form: NgForm): number {
    let total = 0;
    let errorCount = 0;
    Object.keys(form.controls).forEach((key) => {
      total++;
      const controlErrors: ValidationErrors = form.controls[key].errors;
      if (controlErrors != null) {
        errorCount++;
      }
    });
    return Math.round(((total - errorCount) / total) * 100);
  }

  getStepCompletePercentage(stepNo: number): number {
    if (stepNo == 1 && !this.step1Form) {
      return 5;
    } else if (stepNo == 1 && this.step1Form) {
      return this.getFormCompletionPercent(this.step1Form);
    } else if (stepNo == 2 && this.step2Form) {
      return this.getFormCompletionPercent(this.step2Form);
    } else if (stepNo == 3) {
      return this.formData.roles.length > 0 ? 100 : 5;
    } else if (stepNo == 4) {
      return !this.formData.isLoginRestrictions || this.formData.bankLoginRestrictions.length > 0
        ? 100
        : 5;
    }
    return 100;
  }

  getStepFields(stepNo: number): { name: string; value: string }[] {
    if (stepNo == 1) {
      return [
        { name: 'User Id', value: this.formData.loginId },
        { name: 'Full Name', value: this.formData.firstName + ' ' + this.formData.lastName },
      ];
    } else if (stepNo == 2) {
      return [
        { name: 'Employee Code', value: this.formData.employeeCode },
        { name: 'Profile', value: this.formData.profileName },
      ];
    }
    return [];
  }

  onSignatureFileSelected(files: any[]) {
    let filesToUpload = _.cloneDeep(files);
    this.formData.uploadedFileName = '';
    this.formData.signatureFileName = '';
    this.formData.signatureFileSize = 0;
    if (!filesToUpload || filesToUpload.length == 0) return;

    filesToUpload.forEach((file: any) => {
      const data = new FormData();
      data.append('files', file);
      this.httpService
        .httpPost('fileUploadService/setup/securityBank/bankUser/signature', data)
        .subscribe((res: any) => {
          if (res && res.dataMap && res.dataMap.file) {
            this.formData.uploadedFileName = res.dataMap.file.originalname;
            this.formData.signatureFileName = res.dataMap.file.filename;
            this.formData.signatureFileSize = file.fileSize;
          }
        });
    });
  }

  onProfileChange(profile: Select): void {
    if (!profile) return;
    this.formData.profileName = profile.enrichments.profileName;
  }

  onRoleInitGridReady(api: any): void {
    this.roleInitGridAPI = api;
    this.roleInitGridAPI.setRowData(this.formData.roles);
  }

  onRoleReviewGridReady(api: any): void {
    this.roleReviewGridAPI = api;
    this.roleReviewGridAPI.setRowData(this.formData.roles);
  }

  onModuleChange(module: Select): void {
    if (!module) return;
    this.roleFormData.moduleName = module.displayName;
    this.roleListReqData = { moduleId: this.roleFormData.moduleId };
    this.isFireRoleList = true;
  }

  onBranchChange(branch: Select): void {
    this.formData.branchName = branch.displayName;
  }

  onRoleChange(role: Select): void {
    if (!role) return;
    this.roleFormData.roleName = role.displayName;
  }

  onAddRoleClick(): void {
    let that = this;
    const duplicateRow = _.filter(this.formData.roles, function (row: BankRoleDetail) {
      return row.moduleId == that.roleFormData.moduleId && row.roleId == that.roleFormData.roleId;
    });
    if (duplicateRow.length > 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'This Rolw is already added',
      });
      this.roleFormData = new BankRoleDetail();
      return;
    }
    this.roleFormData = this.addRoleGridActions(this.roleFormData);
    this.formData.roles.push({ ...this.roleFormData });
    this.roleInitGridAPI.setRowData(this.formData.roles);
    this.roleReviewGridAPI.setRowData(this.formData.roles);
    this.roleFormData = new BankRoleDetail();
  }

  addRoleGridActions(role: BankRoleDetail): BankRoleDetail {
    const viewAction = {
      index: 1,
      displayName: 'View',
      type: 'ICON',
      icon: 'pi pi-eye',
      methodName: 'viewBankRole',
      paramList: 'roleId',
    };
    const deleteAction = {
      index: 5,
      color: 'warn',
      displayName: 'Delete',
      type: 'ICON',
      icon: 'pi pi-trash',
      methodName: 'delete',
      paramList: 'rowId',
    };
    role.initActions = [viewAction, deleteAction];
    role.reviewActions = [viewAction];
    return role;
  }

  onActionClick(action: ListingAction, node: any): void {
    if (action.methodName == 'delete' && this.stepperDetails.currentStep == 3) {
      this.formData.roles.splice(node.id, 1);
      this.roleInitGridAPI.setRowData(this.formData.roles);
      this.roleReviewGridAPI.setRowData(this.formData.roles);
    } else if (action.methodName == 'delete' && this.stepperDetails.currentStep == 4) {
      this.formData.bankLoginRestrictions.splice(node.id, 1);
      this.loginRestrictionInitGridAPI.setRowData(this.formData.bankLoginRestrictions);
    } else if (action.methodName == 'edit' && this.stepperDetails.currentStep == 4) {
      this.editRestrictionIndex = node.id;
      this.loginRestrictionFormData = node.data;
    }
  }

  viewBankRole(roleId: string): void {
    this.isShowRoleViewModal = true;
    this.bankRoleView.mode = 'VIEW';
    const data = { dataMap: { id: roleId } };
    this.httpService
      .httpPost('setup/securityBank/bankRole/private/view', data)
      .subscribe((formData: any) => {
        this.bankRoleView.setViewData(formData);
      });
  }

  onLoginRestrictionInitGridReady(api: any): void {
    this.loginRestrictionInitGridAPI = api;
    this.loginRestrictionInitGridAPI.setRowData(this.formData.bankLoginRestrictions);
  }

  onLoginRestrictionReviewGridReady(api: any): void {
    this.loginRestrictionReviewGridAPI = api;
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.bankLoginRestrictions);
  }

  onDayChange(day: Select): void {
    if (!day) return;
    this.loginRestrictionFormData.weekday = day.displayName;
  }

  onAddOrUpdateRestrictionClick(): void {
    let that = this;
    const duplicateRow = _.filter(
      this.formData.bankLoginRestrictions,
      function (row: BankLoginRestriction) {
        return row.weekdayno == that.loginRestrictionFormData.weekdayno;
      },
    );
    if (duplicateRow.length > 0 && this.editRestrictionIndex == -1) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: this.loginRestrictionFormData.weekday + ' is already added',
      });
      this.loginRestrictionFormData.weekday = '';
      this.loginRestrictionFormData.weekdayno = '';
      return;
    }
    this.loginRestrictionFormData = this.addRestrictionGridActions(this.loginRestrictionFormData);
    if (this.editRestrictionIndex == -1) {
      this.formData.bankLoginRestrictions.push({ ...this.loginRestrictionFormData });
    } else {
      this.formData.bankLoginRestrictions[this.editRestrictionIndex] = {
        ...this.loginRestrictionFormData,
      };
    }
    this.loginRestrictionInitGridAPI.setRowData(this.formData.bankLoginRestrictions);
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.bankLoginRestrictions);
    this.onResetClick();
  }

  addRestrictionGridActions(restriction: BankLoginRestriction): BankLoginRestriction {
    restriction.actions = [
      {
        index: 2,
        displayName: 'Edit',
        type: 'ICON',
        icon: 'pi pi-pencil',
        methodName: 'edit',
        paramList: 'rowId',
      },
      {
        index: 5,
        color: 'warn',
        displayName: 'Delete',
        type: 'ICON',
        icon: 'pi pi-trash',
        methodName: 'delete',
        paramList: 'rowId',
      },
    ];
    return restriction;
  }

  onResetClick(): void {
    this.editRestrictionIndex = -1;
    this.loginRestrictionFormData = new BankLoginRestriction();
  }

  beforeSubmit(): boolean {
    this.formData.roles.forEach((role: BankRoleDetail) => {
      delete role.initActions;
      delete role.reviewActions;
    });
    this.formData.bankLoginRestrictions.forEach((restriction: BankLoginRestriction) => {
      delete restriction.actions;
    });
    return true;
  }
}
