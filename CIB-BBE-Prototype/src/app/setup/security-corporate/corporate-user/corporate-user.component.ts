import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm, ValidationErrors } from '@angular/forms';
import _ from 'lodash';
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
import { CorporateRoleComponent } from '../corporate-role/corporate-role.component';
import {
  CorporateLoginRestriction,
  CorporateRoleDetail,
  CorporateSecurityDetails,
  CorporateUser,
  GroupUser,
} from './@models/user.model';
@Component({
  selector: 'app-corporate-user',
  templateUrl: './corporate-user.component.html',
  styleUrls: ['./corporate-user.component.scss'],
})
export class CorporateUserComponent implements OnInit {
  @ViewChild('ipMappedGrid') ipMappedGrid: any;
  @ViewChild('step1Form') step1Form: any;
  @ViewChild('step2Form') step2Form: any;
  @ViewChild('step4Form') step4Form: any;
  @ViewChild('corporateRoleView') corporateRoleView: CorporateRoleComponent;

  mode!: string;
  isLocation: boolean = false;
  formData: CorporateUser = new CorporateUser();
  stepperDetails: Stepper = {
    masterName: 'Corporate User',
    stepperType: 'VERTICAL',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: [
      'User Details',
      'Organization Details',
      'Assign Role',
      'Security Detail',
      'Login Restriction Details',
      'Group User',
      'Review and Submit',
    ],
  };

  isShowCorporateSearch: boolean;
  isPasswordVisibale: boolean = false;
  isShowTransactionSelfAuthModal = false
  signatureFiles: any[] = [];
  defaultDashboardList: any[] = [
    { id: 'Setup', displayName: 'Setup' },
    { id: 'Payment', displayName: 'Payment' }
  ];

  roleFormData: CorporateRoleDetail = new CorporateRoleDetail();
  groupUserFormData: GroupUser = new GroupUser();
  roleListReqData: any = {};
  isFireRoleList: boolean = false;
  roleGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  roleInitGridAPI: any;
  roleReviewGridAPI: any;
  groupRoleReviewGridAPI: any;
  groupRoleInitGridAPI: any;
  isShowRoleViewModal: boolean = false;

  loginRestrictionFormData: CorporateLoginRestriction = new CorporateLoginRestriction();
  corporateSecurityDetailsFormData: CorporateSecurityDetails = new CorporateSecurityDetails();

  weekDaysList: Select[] = [];
  filteredWeekDays: Select[] = [];
  loginRestrictionGridOptions: any = {
    rowModelType: 'clientSide',
    context: { componentParent: this },
    pagination: false,
  };
  ipMappingColDefs: string = 'setup/security/corporateUser/private/getIpMappingColDef';
  ipMappedGridOptions = {
    rowModelType: 'clientSide',
    pagination: false,
    context: {
      componentParent: this,
    },
  };
  loginRestrictionInitGridAPI: any;
  loginRestrictionReviewGridAPI: any;
  editRestrictionIndex: number = -1;

  ipMapping = {
    startRange1: '',
    startRange2: '',
    startRange3: '',
    startRange4: '',
    endRange1: '',
    endRange2: '',
    endRange3: '',
    endRange4: '',
  };
  editingIndex: number = -1;
  editing = false;

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
      heading: 'Corporate User Initiate',
      subHeading: null,
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
      { label: 'Corporate User' },
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
        .httpPost('setup/security/corporateUser/private/view', data)
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
          this.corporateSecurityDetailsFormData = this.formData.corporateSecurityDetails[0];

          this.formData.roles.forEach((role: CorporateRoleDetail) => {
            role = this.addRoleGridActions(role);
          });
          // this.formData.groupUser.forEach((groupUser: GroupUser) => {
          //   groupUser = this.addGroupUserGridActions(groupUser);
          //   this.groupUserFormData = groupUser;
          //   this.onIsGroupSelected('True');
          // });
          if (this.roleInitGridAPI) this.roleInitGridAPI.setRowData(this.formData.roles);
          if (this.roleReviewGridAPI) this.roleReviewGridAPI.setRowData(this.formData.roles);
          if (this.groupRoleInitGridAPI)
            this.groupRoleInitGridAPI.setRowData(this.formData.groupUser);
          if (this.groupRoleReviewGridAPI)
            this.groupRoleReviewGridAPI.setRowData(this.formData.groupUser);
          this.formData.corporateLoginRestrictions.forEach(
            (restriction: CorporateLoginRestriction) => {
              restriction = this.addRestrictionGridActions(restriction);
            },
          );
          if (this.loginRestrictionInitGridAPI)
            this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
          if (this.loginRestrictionReviewGridAPI)
            this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
          if (this.mode == 'VIEW')
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
        });
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  // resetCorporate(): void {
  //   if (this.formData.roleType) {
  //     this.formData.corporateId = '';
  //     this.formData.corporateCode = '';
  //     this.formData.corporateName = '';
  //   }
  // }

  getRestrictionWeekDaysList(): void {
    this.httpService
      .httpPost('setup/securityBank/bankUser/private/dropdown/restrictionWeekDaysList')
      .subscribe((res: any) => {
        this.weekDaysList = res.dataList;
        this.filteredWeekDays = [...this.weekDaysList];
      });
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.step1Form) {
      return this.step1Form.valid;
    } else if (stepNo == 2 && this.step2Form) {
      return this.step2Form.valid;
    } else if (stepNo == 3) {
      return this.formData.roles.length > 0;
    } else if (stepNo == 4 && this.step4Form) {
      return this.step4Form.valid;
    } else if (stepNo == 5) {
      return (
        !this.formData.isLoginRestrictions || this.formData.corporateLoginRestrictions.length > 0
      );
    } else if (stepNo == 6) {
      return this.corporateSecurityDetailsFormData.isGroup === 'False' || this.formData.groupUser.length > 0;
    }
    return true;
  }

  setSearchModelData(selectedData: any) {
    this.formData.locationName = selectedData.locationName;
    this.formData.state = selectedData.province;
    this.formData.country = selectedData.country;
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
    if (stepNo == 1 && this.step1Form) {
      return this.getFormCompletionPercent(this.step1Form);
    } else if (stepNo == 2 && this.step2Form) {
      return this.getFormCompletionPercent(this.step2Form);
    } else if (stepNo == 3) {
      return this.formData.roles.length > 0 ? 100 : 0;
    } else if (stepNo == 4 && this.step4Form) {
      return this.getFormCompletionPercent(this.step4Form);
    } else if (stepNo == 5) {
      return !this.formData.isLoginRestrictions ||
        this.formData.corporateLoginRestrictions.length > 0
        ? 100
        : 0;
    } else if (stepNo == 6) {
      return this.formData.groupUser.length > 0 ? 100 : 0;
    }
    return 100;
  }

  getStepFields(stepNo: number): { name: string; value: string }[] {
    if (stepNo == 1) {
      return [
        { name: 'User Id', value: this.formData.userId },
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
        .httpPost('fileUploadService/setup/security/corporateUser/signature', data)
        .subscribe((res: any) => {
          if (res && res.dataMap && res.dataMap.file) {
            this.formData.uploadedFileName = res.dataMap.file.originalname;
            this.formData.signatureFileName = res.dataMap.file.filename;
            this.formData.signatureFileSize = file.fileSize;
          }
        });
    });
  }

  onGenderChange(gender: Select): void {
    if (!gender) return;
    this.formData.genderName = gender.displayName;
  }

  onProfileChange(profile: Select): void {
    if (!profile) return;
    this.formData.profileName = profile.displayName;
  }

  onCategoryChange(category: Select): void {
    if (!category) return;
    this.formData.categoryName = category.displayName;
  }

  onDefaultDashboardChange(defaultDashboard: Select): void {
    if (!defaultDashboard) return;
    this.corporateSecurityDetailsFormData.defaultDashboardName = defaultDashboard.displayName;
  }

  onStepChange(stepNo: number) {
    return true;
  }

  onCorporateBranchChange(corporateBranch: Select): void {
    if (!corporateBranch) return;
    this.formData.corporateBranchName = corporateBranch.enrichments.profileName;
  }

  onRoleInitGridReady(api: any): void {
    this.roleInitGridAPI = api;
    this.roleInitGridAPI.setRowData(this.formData.roles);
  }

  onRoleReviewGridReady(api: any): void {
    this.roleReviewGridAPI = api;
    this.roleReviewGridAPI.setRowData(this.formData.roles);
  }

  onGroupRoleInitGridReady(api: any): void {
    this.groupRoleInitGridAPI = api;
    this.groupRoleInitGridAPI.setRowData(this.formData.groupUser);
  }

  onGroupRoleReviewGridReady(api: any): void {
    this.groupRoleReviewGridAPI = api;
    this.groupRoleReviewGridAPI.setRowData(this.formData.groupUser);
  }

  onModuleChange(module: Select,): void {
    if (!module) return;
    this.roleFormData.moduleName = module.displayName;
    this.roleListReqData = { moduleId: this.roleFormData.moduleId, requestedBy: 'BANK' };
    this.isFireRoleList = true;

    // this.corporateSecurityDetailsFormData.defaultDashboardId = module.displayName;
  }

  onGroupUserModuleChange(module: Select): void {
    if (!module) return;
    this.groupUserFormData.moduleName = module.displayName;
    this.roleListReqData = { moduleId: this.groupUserFormData.moduleId, requestedBy: 'CORPORATE' };
    this.isFireRoleList = true;
  }

  onGroupChange(group: Select): void {
    if (!group) return;
    this.groupUserFormData.groupName = group.displayName;
  }

  onRoleChange(role: Select): void {
    if (!role) return;
    this.roleFormData.roleName = role.displayName;
  }

  onGroupRoleChange(role: Select): void {
    if (!role) return;
    this.groupUserFormData.roleName = role.displayName;
  }

  // onIsGroupSelected(isGroupUser: string): void {
  //   if (isGroupUser != 'False') {
  //     this.formData.isGroupUser = isGroupUser;
  //     this.stepperDetails.headings.splice(5, 0, 'Group User');
  //     this.stepperDetails.steps.splice(5, 0, {});
  //   } else {
  //     this.formData.isGroupUser = isGroupUser;
  //     const startIndex = this.stepperDetails.headings.indexOf('Group User');
  //     const deleteCount = 1;
  //     if (startIndex !== -1) {
  //       this.stepperDetails.headings.splice(startIndex, deleteCount);
  //       this.stepperDetails.steps.splice(startIndex, deleteCount);
  //     }
  //   }
  // }

  onAddRoleClick(): void {
    let that = this;
    const duplicateRow = _.filter(this.formData.roles, function (row: CorporateRoleDetail) {
      return row.moduleId == that.roleFormData.moduleId && row.roleId == that.roleFormData.roleId;
    });
    if (duplicateRow.length > 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'This Rolw is already added',
      });
      this.roleFormData = new CorporateRoleDetail();
      return;
    }
    this.roleFormData = this.addRoleGridActions(this.roleFormData);
    this.formData.roles.push({ ...this.roleFormData });
    this.roleInitGridAPI.setRowData(this.formData.roles);
    this.roleReviewGridAPI.setRowData(this.formData.roles);
    this.roleFormData = new CorporateRoleDetail();

    // this.defaultDashboardList = [
    //   { displayName: '' }
    // ];

    // for (let i = 0; i < this.formData.roles.length; i++) {
    //   this.defaultDashboardList[i].displayName = this.formData.roles[i].moduleName;      
    // }

    // console.log("this.defaultDashboardList", this.defaultDashboardList);
  }

  onAddGroupUserClick(): void {
    let that = this;
    const duplicateRow = _.filter(this.formData.groupUser, function (row: GroupUser) {
      return (
        row.groupId == that.groupUserFormData.groupId &&
        row.moduleId == that.groupUserFormData.moduleId &&
        row.roleId == that.groupUserFormData.roleId
      );
    });
    if (duplicateRow.length > 0) {
      this.toasterService.showToaster({
        severity: 'error',
        detail: 'This Role is already added',
      });
      this.resetGroupUser();
      return;
    }
    this.groupUserFormData = this.addGroupUserGridActions(this.groupUserFormData);
    this.formData.groupUser.push({ ...this.groupUserFormData });
    this.groupRoleInitGridAPI.setRowData(this.formData.groupUser);
    this.groupRoleReviewGridAPI.setRowData(this.formData.groupUser);
    this.resetGroupUser();
  }

  resetGroupUser(): void {
    this.groupUserFormData.groupId = '';
    this.groupUserFormData.groupName = '';
    this.groupUserFormData.groupProfileId = '';
    this.groupUserFormData.groupProfile = '';
    this.groupUserFormData.moduleId = '';
    this.groupUserFormData.moduleName = '';
    this.groupUserFormData.roleId = '';
    this.groupUserFormData.roleName = '';
    this.groupUserFormData.isSelfAuthorizer = false;
    this.groupUserFormData.isTransactionSelfAuthorizer = false;
    this.groupUserFormData.isMasterSelfAuthorizer = false;
    this.groupUserFormData.isSelftServiceRequest = false;
  }

  addRoleGridActions(role: CorporateRoleDetail): CorporateRoleDetail {
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

  addGroupUserGridActions(groupUser: GroupUser): GroupUser {
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
      methodName: 'deleteGroupUser',
      paramList: 'groupId',
    };
    groupUser.initActions = [viewAction, deleteAction];
    groupUser.reviewActions = [viewAction];
    return groupUser;
  }

  onActionClick(action: ListingAction, node: any): void {
    if (action.methodName == 'delete' && this.stepperDetails.currentStep == 3) {
      this.formData.roles.splice(node.id, 1);
      this.roleInitGridAPI.setRowData(this.formData.roles);
      this.roleReviewGridAPI.setRowData(this.formData.roles);
    } else if (action.methodName == 'delete' && this.stepperDetails.currentStep == 5) {
      this.formData.corporateLoginRestrictions.splice(node.id, 1);
      this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    } else if (action.methodName == 'edit' && this.stepperDetails.currentStep == 5) {
      this.editRestrictionIndex = node.id;
      this.loginRestrictionFormData = node.data;
    } else if (action.methodName == 'delete' && this.stepperDetails.currentStep == 6) {
      this.formData.groupUser.splice(node.id, 1);
      this.groupRoleInitGridAPI.setRowData(this.formData.groupUser);
      this.groupRoleReviewGridAPI.setRowData(this.formData.groupUser);
    }
  }

  deleteGroupUser(groupId): void {
    const updatedRecord = this.formData.groupUser.splice(groupId, 1);
    this.groupRoleInitGridAPI.setRowData(updatedRecord);
    this.groupRoleReviewGridAPI.setRowData(updatedRecord);
  }

  viewBankRole(roleId: string): void {
    this.isShowRoleViewModal = true;
    this.corporateRoleView.mode = 'VIEW';
    const data = { dataMap: { id: roleId } };
    this.httpService
      .httpPost('setup/security/corporateRole/private/view', data)
      .subscribe((formData: any) => {
        this.corporateRoleView.setViewData(formData);
      });
  }

  viewGroupRole(roleId: string): void {
    this.isShowRoleViewModal = true;
    this.corporateRoleView.mode = 'VIEW';
    const data = { dataMap: { id: roleId } };
    this.httpService
      .httpPost('setup/security/corporateRole/private/view', data)
      .subscribe((formData: any) => {
        this.corporateRoleView.setViewData(formData);
      });
  }

  onSubmitIpMapped(form: NgForm) {
    if (form.valid) {
      const startRange =
        this.ipMapping.startRange1 +
        '.' +
        this.ipMapping.startRange2 +
        '.' +
        this.ipMapping.startRange3 +
        '.' +
        this.ipMapping.startRange4;

      const endRange =
        this.ipMapping.endRange1 +
        '.' +
        this.ipMapping.endRange2 +
        '.' +
        this.ipMapping.endRange3 +
        '.' +
        this.ipMapping.endRange4;

      const ipMapping = {
        srNo: this.editing
          ? this.corporateSecurityDetailsFormData.ipMapping[this.editingIndex].srNo
          : this.corporateSecurityDetailsFormData.ipMapping.length + 1,
        startRange: startRange,
        endRange: endRange,
        actions: [
          {
            index: 0,
            methodName: 'editIpMapped',
            type: 'ICON',
            displayName: 'Edit',
            icon: 'pi pi-pencil',
            paramList: 'srNo, startRange, endRange',
          },
          {
            index: 1,
            methodName: 'deleteIpMapped',
            type: 'ICON',
            displayName: 'Delete',
            icon: 'pi pi-trash',
            paramList: 'srNo, startRange, endRange',
          },
        ],
      };

      form.reset();

      if (this.editingIndex >= 0) {
        this.corporateSecurityDetailsFormData.ipMapping[this.editingIndex] = ipMapping;
        this.editingIndex = -1;
        this.editing = false;
      } else {
        this.corporateSecurityDetailsFormData.ipMapping.push(ipMapping);
      }

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.corporateSecurityDetailsFormData.ipMapping);
      }
    }
  }

  editIpMapped(srNo: string, startRangeParam: string, endRangeParam: string) {
    this.editingIndex = this.corporateSecurityDetailsFormData.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === srNo,
    );

    this.editing = true;

    const startRange = startRangeParam.split('.');
    const endRange = endRangeParam.split('.');

    this.ipMapping = {
      startRange1: startRange[0],
      startRange2: startRange[1],
      startRange3: startRange[2],
      startRange4: startRange[3],
      endRange1: endRange[0],
      endRange2: endRange[1],
      endRange3: endRange[2],
      endRange4: endRange[3],
    };
  }

  deleteIpMapped(srNo: string, startRange: string, endRange: string) {
    const i = this.corporateSecurityDetailsFormData.ipMapping.findIndex(
      (parameters: any) => parameters.srNo === srNo,
    );
    if (i >= 0) {
      if (this.editing && i === this.editingIndex) {
        this.editing = false;
        this.editingIndex = -1;
      }

      this.corporateSecurityDetailsFormData.ipMapping.splice(i, 1);

      if (this.ipMappedGrid) {
        this.ipMappedGrid.setRowData(this.corporateSecurityDetailsFormData.ipMapping);
      }
    }
  }

  onLoginRestrictionInitGridReady(api: any): void {
    this.loginRestrictionInitGridAPI = api;
    this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
  }

  onLoginRestrictionReviewGridReady(api: any): void {
    this.loginRestrictionReviewGridAPI = api;
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
  }

  onDayChange(day: Select): void {
    if (!day) return;
    this.loginRestrictionFormData.weekday = day.displayName;
  }

  onAddOrUpdateRestrictionClick(): void {
    let that = this;
    const duplicateRow = _.filter(
      this.formData.corporateLoginRestrictions,
      function (row: CorporateLoginRestriction) {
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
      this.formData.corporateLoginRestrictions.push({ ...this.loginRestrictionFormData });
    } else {
      this.formData.corporateLoginRestrictions[this.editRestrictionIndex] = {
        ...this.loginRestrictionFormData,
      };
    }
    this.loginRestrictionInitGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    this.loginRestrictionReviewGridAPI.setRowData(this.formData.corporateLoginRestrictions);
    this.onResetClick();
  }

  addRestrictionGridActions(restriction: CorporateLoginRestriction): CorporateLoginRestriction {
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
    this.loginRestrictionFormData = new CorporateLoginRestriction();
  }

  beforeSubmit(): boolean {
    this.formData.roles.forEach((role: CorporateRoleDetail) => {
      delete role.initActions;
      delete role.reviewActions;
    });
    this.formData.groupUser.forEach((groupUser: GroupUser) => {
      delete groupUser.initActions;
      delete groupUser.reviewActions;
    });
    this.formData.isGroupUser = this.corporateSecurityDetailsFormData.isGroup;
    this.formData.isMultiCountryUser = this.corporateSecurityDetailsFormData.isMultiCountry;
    this.formData.groupId = this.corporateSecurityDetailsFormData.groupId;
    this.formData.groupName = this.corporateSecurityDetailsFormData.groupName;
    this.formData.corporateSecurityDetails.push(this.corporateSecurityDetailsFormData);
    this.formData.corporateLoginRestrictions.forEach((restriction: CorporateLoginRestriction) => {
      delete restriction.actions;
    });
    return true;
  }

  onChangetransactionSelfAuth(val) {
    if (val === true) {
      this.isShowTransactionSelfAuthModal = true
    }
  }

  accountWiseAuthLimit = [
    { isSelect: false, accountNo: '0332000110008815 - INR', authLimit: '' },
    { isSelect: false, accountNo: '400401281279 - INR', authLimit: '' },
    { isSelect: false, accountNo: '400401281280 - INR', authLimit: '' },
    { isSelect: false, accountNo: '400401281281 - INR', authLimit: '' }
  ]

  onIsSelect(data, val) {
    console.log(data, val);
  }

  noOfAccMap = 0

  onSubmitAuthLimit() {
    this.noOfAccMap = 0;
    for (let index = 0; index < this.accountWiseAuthLimit.length; index++) {
      if (this.accountWiseAuthLimit[index].isSelect === true) {
        this.noOfAccMap++;
      }
    }
    this.isShowTransactionSelfAuthModal = false
  }
}
