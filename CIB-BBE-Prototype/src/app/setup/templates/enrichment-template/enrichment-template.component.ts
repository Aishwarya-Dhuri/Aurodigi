import { Component, OnInit, ViewChild } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { EnrichmentTempplate, HeaderFieldForm } from './@models/enrichment-template.model';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';


@Component({
  selector: 'app-enrichment-template',
  templateUrl: './enrichment-template.component.html',
  styleUrls: ['./enrichment-template.component.scss']
})
export class EnrichmentTemplateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;
  @ViewChild('headerFieldGrid') headerFieldGrid!: AgGridListingComponent;

  formData: EnrichmentTempplate = new EnrichmentTempplate();
  headerFieldForm: HeaderFieldForm = new HeaderFieldForm();
  mode: string;
  productArrayList = []
  showAddHeaderFields: boolean = false;
  headerFieldIndex: number = -1;
  gridOptions: any = {
    rowModelType: 'clientSide',
    pagination: false
  };


  stepperDetails: Stepper = {
    masterName: 'Enrichment Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private httpService: HttpService,
    private userService: UserService,
    private viewService: ViewService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Enrichment Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Templates' },
      { label: 'Enrichment Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/enrichmentTemplate/private/view', data)
        .subscribe((formData: EnrichmentTempplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.oncChangeModule(formData.module)
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.bankProfileForm) {
      return true
    }
    return true;
  }

  oncChangeModule(module) {
    this.productArrayList = []
    if (module === 'Payment') {
      this.productArrayList = [
        { id: 'Salary', displayName: 'Salary' },
        { id: 'Vendor', displayName: 'Vendor' },
        { id: 'Electronic', displayName: 'Electronic' }
      ]
    }
    else if (module === 'Collection') {
      this.productArrayList = [
        { id: 'Local', displayName: 'Local' },
        { id: 'Upcountry', displayName: 'Upcountry' },
        { id: 'Cash', displayName: 'Cash' },
        { id: 'Drawee', displayName: 'Drawee' }
      ]
    }
    else if (module === 'FSCM') {
      this.productArrayList = [
        { id: 'EIPP', displayName: 'EIPP' },
        { id: 'Seller Finance', displayName: 'Seller Finance' },
        { id: 'Warehouse Finance', displayName: 'Warehouse Finance' }
      ]
    }
    else if (module === 'LMS') {
      this.productArrayList = [
        { id: 'Sweep', displayName: 'Sweep' },
        { id: 'Pool', displayName: 'Pool' },
        { id: 'Inter Company', displayName: 'Inter Company' }
      ]
    }
    else if (module === 'LMS') {
      this.productArrayList = [
        { id: 'Cashflow', displayName: 'Cashflow' }
      ]
    }
  }
















  private getHeaderFieldsIndex(id: string): number {
    return this.formData.headerFields.findIndex((record: HeaderFieldForm) => record.hid == id);
  }

  onCancelHeaderFieldForm() {
    this.showAddHeaderFields = false;
    this.headerFieldIndex = -1;
    this.headerFieldForm = new HeaderFieldForm();
  }

  onAddHeaderFields() {
    const data: any = {
      ...this.headerFieldForm,
      hid: new Date().getTime() + Math.random() * 1000,
      actions: [
        // {
        //   index: 1,
        //   displayName: 'View',
        //   type: 'ICON',
        //   icon: 'fa-eye',
        //   methodName: 'onViewHeaderField',
        //   paramList: 'hid',
        // },
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'pi pi-trash',
          methodName: 'onDeleteHeaderField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditHeaderField',
          paramList: 'hid',
        },
      ],
    };

    this.formData.headerFields.push(data);

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onUpdateHeaderField() {
    this.formData.headerFields[this.headerFieldIndex] = this.headerFieldForm;

    this.headerFieldIndex = -1;

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onViewHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);
    if (index >= 0) {
      this.headerFieldForm = this.formData.headerFields[index];
      this.showAddHeaderFields = true;
    }
  }

  onDeleteHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);
    if (index >= 0) {
      this.formData.headerFields.splice(index, 1);

      this.headerFieldGrid?.refreshGridList();
    }
  }

  onEditHeaderField(id: string) {
    const index: number = this.getHeaderFieldsIndex(id);
    if (index >= 0) {
      this.headerFieldIndex = index;
      this.headerFieldForm = this.formData.headerFields[index];
      this.showAddHeaderFields = true;
    }
  }


}
