import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import {
  ChildAccountDetails,
  VirtualAccountIssuanceHierarchy,
} from './@model/virtual-account-issuance-pobo-hierarchy.model';

@Component({
  selector: 'app-virtual-account-issuance-pobo-hierarchy',
  templateUrl: './virtual-account-issuance-pobo-hierarchy.component.html',
  styleUrls: ['./virtual-account-issuance-pobo-hierarchy.component.scss'],
})
export class VirtualAccountIssuancePoboHierarchyComponent implements OnInit {
  @ViewChild('structureHierarchy') structureHierarchyGrid: any;
  @ViewChild('form1') form1: NgForm;
  @ViewChild('form2') form2: NgForm;

  loading: boolean;
  mode: string;

  isShowCorporateSearch: boolean = false;

  stepperDetails: Stepper = {
    masterName: 'Corporate VA Structure',
    currentStep: 1,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Corporate Details', 'Sub Entity Details', 'Review and Submit'],
  };

  formData: any;

  rowData: any[] = [];

  editChildAccountIndex: number = -1;

  childAccountDetails: ChildAccountDetails = new ChildAccountDetails();
  parentAccount: any;

  treeType = 'grid';

  accountStructureHierarchy: any;

  accountStructureHierarchyTreeData: any[] = [];

  isAddChildAccount = false;
  isSuspendAccount = false;

  context = { componentParent: this };

  colDefs: any[] = [
    {
      headerName: 'Account Number',
      field: 'accountNo',
      hide: true,
    },
    {
      headerName: 'Bank',
      field: 'bank',
    },
    {
      headerName: 'Country',
      field: 'country',
    },
    {
      headerName: 'Currency',
      field: 'currencyCode',
    },
    {
      headerName: 'Type',
      field: 'accType',
    },
    {
      headerName: 'Type',
      field: 'type',
    },
  ];

  gridOptions: any;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Virtual Account Issuance Hierarchy',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { icon: 'pi pi-home' },
      { label: 'VAM' },
      { label: 'VAM Setup' },
      { label: 'Virtual Account Issuance Hierarchy' },
      { label: 'Initiate' },
    ];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.formData = new VirtualAccountIssuanceHierarchy();

    this.gridOptions = {
      rowModelType: 'clientSide',
      treeData: true,
      pagination: false,
      // rowDragManaged: true,
      animateRows: true,
      groupDefaultExpanded: -1,
      defaultColDef: {
        flex: 1,
        resizable: true,
      },
      autoGroupColumnDef: {
        rowDrag: true,
        headerName: 'Account Number',
        minWidth: 400,
        cellRendererParams: {
          suppressCount: true,
        },
      },
      getDataPath: (data: any) => {
        return data.accountNo;
      },
      isGroupOpenByDefault: (params: any) => {
        return true;
      },
    };

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = this.stepperDetails.headings.length;
      }

      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('vam/vamSetup/virtualAccountIssuanceHierarchy/private/view', data)
        .subscribe((formData: VirtualAccountIssuanceHierarchy) => {
          this.viewService.clearAll();

          if (formData.typeOfIssuance == 'Hierarchy') {
            this.rowData = formData.childAccountDetails.map((account: any, i: number) => {
              account['accountNo'] = account.accountNo.split(',');
              account['actions'] = this.getActions();

              if (i == 0) {
                account.actions.splice(1, 1);
                account.actions.splice(3, 1);
              }

              return account;
            });

            this.generateOrganizationTreeData();
          } else {
            this.childAccountDetails = formData.childAccountDetails[0];
            console.log(this.childAccountDetails);
          }

          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
  }

  onChangeTypeOfIssuance(event: any) {
    if (this.formData.typeOfIssuance == 'Hierarchy') {
      this.stepperDetails.headings[1] = 'Account Hierarchy';
      this.stepperDetails.steps[1].active = false;
      this.stepperDetails.steps[1].completePercentage = 0;
      this.stepperDetails.steps[1].visited = false;
    } else {
      this.stepperDetails.headings[1] = 'Sub Entity Details';
      this.stepperDetails.steps[1].active = false;
      this.stepperDetails.steps[1].completePercentage = 0;
      this.stepperDetails.steps[1].visited = false;
    }

    this.resetChildAccount();
  }

  validateForm(stepNo: number) {
    if (stepNo == 1) {
      return this.form1?.valid;
    } else if (stepNo == 2) {
      if (this.formData.typeOfIssuance == 'Linear') {
        return this.form2?.valid;
      }
    }
    return true;
  }

  onRowDragged(event: any) {}

  onAccountNumberSelection(account: any) {
    this.formData.accountNumber = account.displayName;
    this.formData.accountNumberName = account.enrichments.corporateAccountAlias;
    this.formData.accountBalance = account.enrichments.balance;
    this.formData.accountCurrencyId = account.enrichments.currencyId;
    this.formData.currencyCode = account.enrichments.currencyCode;
    this.formData.limitCurrency = account.enrichments.currencyId;
    this.formData.limitCurrencyCode = account.enrichments.currencyCode;
    this.formData.bank = account.enrichments.bank;
    this.formData.balance = account.enrichments.balance;
    this.formData.country = account.enrichments.country;
    this.formData.accType = account.enrichments.accountType;
    this.formData.type = account.enrichments.type;

    this.childAccountDetails.currency = this.formData.accountCurrencyId;
    this.childAccountDetails.currencyCode = this.formData.currencyCode;
  }

  onStepChange(stepNo: number) {
    if (stepNo == 2) {
      if (this.formData.typeOfIssuance == 'Hierarchy') {
        const index = this.colDefs.findIndex((col: any) => col.field == 'actions');

        if (index == -1) {
          this.colDefs.push({
            headerName: 'Actions',
            field: 'actions',
            cellRenderer: 'actionCellRenderer',
          });
        }

        const actions = this.getActions();

        actions.splice(1, 1);
        actions.splice(3, 1);

        const mainAccount = {
          accId: this.formData.accountNumber,
          accountNo: [this.formData.accountNumber],
          bank: this.formData.bank,
          balance: this.formData.balance,
          country: this.formData.country,
          currency: this.formData.currencyCode,
          accType: this.formData.accType,
          type: this.formData.type,
          levelLabel: this.formData.levelName,
          entityName: this.formData.typeOfIssuance,
          actions,
        };

        this.rowData.push(mainAccount);

        this.generateOrganizationTreeData();
      }
    } else if (stepNo == 3) {
      if (this.formData.typeOfIssuance == 'Linear') {
        this.formData.childAccountDetails = [this.childAccountDetails];
      } else {
        const index = this.colDefs.findIndex((col: any) => col.field == 'actions');

        if (index >= 0) {
          this.colDefs.splice(index, 1);
        }
      }
    }
  }

  onAddChildAccount(
    levelLabel: string,
    entityName: string,
    accountNo: string,
    bank: string,
    country: string,
    currency: string,
    accType: string,
    type: string,
  ) {
    this.parentAccount = {
      levelLabel,
      entityName,
      accountNo,
      bank,
      country,
      currency,
      accType,
      type,
    };

    this.isAddChildAccount = true;
  }

  addChildAccount() {
    const childAccount = this.rowData.find((account: any) => {
      return account.accountNo.join(',') == this.childAccountDetails.accountNo.join(',');
    });

    if (!childAccount) {
      const newChildAccount = {
        accId: this.childAccountDetails.virtualAccountNumber,
        ...this.childAccountDetails,
        ...this.parentAccount,
        accountNo: [...this.parentAccount.accountNo, this.childAccountDetails.virtualAccountNumber],
        actions: this.getActions(),
      };

      this.rowData.push(newChildAccount);

      this.generateOrganizationTreeData();
    }

    this.resetChildAccount();

    this.isAddChildAccount = false;
    this.parentAccount = null;

    this.refreshStructureHierarchyGrid();
  }

  editChildAccountDetails(accId: string) {
    const index = this.rowData.findIndex((account: any) => account.accId == accId);

    if (index >= 0) {
      this.childAccountDetails = this.rowData[index];
    }

    this.isAddChildAccount = true;

    this.editChildAccountIndex = index;
  }

  saveChildAccountDetails() {
    const modifiesChildData = { ...this.childAccountDetails };

    modifiesChildData.accountNo[modifiesChildData.accountNo.length - 1] =
      this.childAccountDetails.virtualAccountNumber;

    this.rowData[this.editChildAccountIndex] = modifiesChildData;

    this.generateOrganizationTreeData();

    this.resetChildAccount();

    this.isAddChildAccount = false;
    this.parentAccount = null;

    this.refreshStructureHierarchyGrid();

    this.editChildAccountIndex = -1;
  }

  deleteChildAccountDetails(accId: string) {
    const index = this.rowData.findIndex((account: any) => account.accId == accId);

    if (index >= 0) {
      this.rowData.splice(index, 1);
      this.generateOrganizationTreeData();
      this.refreshStructureHierarchyGrid();
    }
  }

  resetChildAccount() {
    this.childAccountDetails = new ChildAccountDetails();
    this.childAccountDetails.currency = this.formData.accountCurrencyId;
    this.childAccountDetails.currencyCode = this.formData.currencyCode;
    console.log(this.childAccountDetails);
  }

  refreshStructureHierarchyGrid() {
    if (this.structureHierarchyGrid) {
      this.structureHierarchyGrid.setRowData(this.rowData);
    }
  }

  generateOrganizationTreeData() {
    const accounts: any[] = [];

    this.rowData.forEach((account: any) => {
      accounts.push(account.accountNo.join('.'));
    });

    const hierarchicalTree = [];

    accounts.forEach((s: any) =>
      s.split('.').reduce(
        (object: any, value: any) => {
          let item = (object.children = object.children || []).find((q: any) => q.value === value);
          if (!item)
            object.children.push(
              (item = {
                value,
                label: value,
                styleClass: 'node-content',
              }),
            );

          return item;
        },
        { children: hierarchicalTree },
      ),
    );

    this.accountStructureHierarchyTreeData = this.getFinalTree(hierarchicalTree);
  }

  private getFinalTree(tree: any[]) {
    return tree.map((t) => {
      const val = {
        ...t,
      };
      delete val.value;
      if (t.children) {
        val['expanded'] = true;
        val.children = this.getFinalTree(val.children);
      } else {
        val['type'] = 'leaf';
      }
      return val;
    });
  }

  beforeSubmit() {
    if (this.formData.typeOfIssuance == 'Hierarchy') {
      const accountHierarchy = this.rowData.map((account: any) => {
        if (account.accountNo) {
          account.accountNo = account.accountNo.join(',');
        }

        delete account.actions;

        return account;
      });

      this.formData.childAccountDetails = accountHierarchy;
    }

    return true;
  }

  private getActions() {
    return [
      {
        index: 0,
        paramList: 'levelLabel,entityName,accountNo,bank,country,currency,accType,type',
        methodName: 'onAddChildAccount',
        type: 'ICON',
        displayName: 'Add',
        icon: 'fa-plus',
      },
      {
        index: 1,
        paramList: 'accId',
        methodName: 'editChildAccountDetails',
        type: 'ICON',
        displayName: 'Edit',
        icon: 'fa-pencil',
      },
      {
        index: 2,
        paramList: 'accId',
        methodName: 'viewChildAccountDetails',
        type: 'ICON',
        displayName: 'View',
        icon: 'fa-eye',
      },
      {
        index: 3,
        paramList: 'accId',
        methodName: 'suspendChildAccountDetails',
        type: 'ICON',
        displayName: 'Suspend',
        icon: 'fa-ban',
      },
      {
        index: 4,
        paramList: 'accId',
        methodName: 'deleteChildAccountDetails',
        type: 'ICON',
        displayName: 'Delete',
        icon: 'fa-trash-alt',
      },
    ];
  }
}
