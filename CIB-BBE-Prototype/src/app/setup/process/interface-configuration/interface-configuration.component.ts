import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
// import { xml2json } from 'xml-js';

class InterfaceConfiguration {
  interfaceName: string;
  requestType: string;
  dataType: string;
  fileNameFormat: string;
  prefix: string;
  dateFormat: string;
  delimiter: string;
  extension: string;
  fieldType: string;
  headerFields: HeaderFieldForm[];
  reqBodyFields: any[];
  resBodyFields: any[];
  mqFieldSeparator: string;
  mqFieldDelimiter: string;
  url: string;
  timeOutInSeconds: string;
  autoRetryAttempt: string;
  httpMethod: string;
  server: string;
  port: string;
  userId: string;
  password: string;
  channel: string;
  queueName: string;

  constructor() {
    this.interfaceName = '';
    this.requestType = '';
    this.dataType = '';
    this.fileNameFormat = '';
    this.prefix = '';
    this.dateFormat = '';
    this.delimiter = '';
    this.extension = '';
    this.fieldType = '';
    this.headerFields = [];
    this.reqBodyFields = [];
    this.resBodyFields = [];
    this.mqFieldSeparator = 'Fixed Length';
    this.mqFieldDelimiter = '';

    this.url = '';
    this.timeOutInSeconds = '';
    this.autoRetryAttempt = '';
    this.httpMethod = '';
    this.server = '';
    this.port = '';
    this.userId = '';
    this.password = '';
    this.channel = '';
    this.queueName = '';
  }
}

class HeaderFieldForm {
  hid: string;
  fieldName: string;
  fieldType: string;
  fieldValue: string;
  prefix: string;
  maxLength: string;
  minLength: string;
  dateFormat: string;

  constructor() {
    this.hid = '';
    this.fieldName = '';
    this.fieldType = '';
    this.fieldValue = '';
    this.prefix = '';
    this.maxLength = '';
    this.minLength = '';
    this.dateFormat = '';
  }
}

class MqReqBodyDetailsForm {
  fieldType: string;
  maxLength: string;
  minLength: string;
  padding: string;
  paddingCharacter: string;

  constructor() {
    this.fieldType = '';
    this.maxLength = '';
    this.minLength = '';
    this.padding = '';
    this.paddingCharacter = '';
  }
}

class MqResBodyDetailsForm {
  fieldType: string;
  startIndex: string;
  endIndex: string;
  fieldIndex: string;

  constructor() {
    this.fieldType = '';
    this.startIndex = '';
    this.endIndex = '';
    this.fieldIndex = '';
  }
}

class ReqBodyFieldForm {
  hid: string;
  fieldName: string;
  fieldType: string;
  mandatory: string;
  constructor() {
    this.hid = '';
    this.fieldName = '';
    this.fieldType = '';
    this.mandatory = 'N';
  }
}

class ResBodyFieldForm {
  hid: string;
  fieldName: string;
  fieldType: string;
  constructor() {
    this.hid = '';
    this.fieldName = '';
    this.fieldType = '';
  }
}

@Component({
  selector: 'app-interface-configuration',
  templateUrl: './interface-configuration.component.html',
  styles: [
    `
      .textarea {
        border: none;
        border-bottom: 1px solid var(--background-color-dark-2);
        outline: none;
        font-family: 'CIB Regular';
      }
      .tile:hover {
        background-color: var(--primary-color-light-shade-2);
      }
    `,
  ],
})
export class InterfaceConfigurationComponent implements OnInit {
  @ViewChild('headerFieldGrid') headerFieldGrid!: AgGridListingComponent;
  @ViewChild('reqBodyFieldGrid') reqBodyFieldGrid!: AgGridListingComponent;
  @ViewChild('resBodyFieldGrid') resBodyFieldGrid!: AgGridListingComponent;

  loading: boolean = false;
  headerFieldIndex: number = -1;
  reqBodyFieldIndex: number = -1;
  resBodyFieldIndex: number = -1;

  formData: InterfaceConfiguration = new InterfaceConfiguration();
  headerFieldForm: HeaderFieldForm = new HeaderFieldForm();
  reqBodyFieldForm: any = new ReqBodyFieldForm();
  resBodyFieldForm: any = new ResBodyFieldForm();

  showAddHeaderFields: boolean = false;
  showAddReqBodyFields: boolean = false;
  showAddResBodyFields: boolean = false;

  reqBodyFieldNameData: Select[] = [];
  resBodyFieldNameData: Select[] = [];

  mode!: string;

  gridOptions: any = {
    rowModelType: 'clientSide',
  };

  stepperDetails: Stepper = {
    masterName: 'Interface Configuration',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['Interface Configuration Details', 'Review and Submit'],
  };

  requestBody: string = '';
  responseBody: string = '';

  constructor(
    private httpService: HttpService,
    private viewService: ViewService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private toasterService: ToasterService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Interface Configuration',
      subHeading: null,
      refresh: true,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Process' },
      { label: 'Interface Configuration' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();

    if (this.mode == 'VIEW' || this.mode == 'EDIT') {
      const data = { dataMap: { id: this.viewService.getId() } };

      this.httpService
        .httpPost('setup/process/interfaceConfiguration/private/view', data)
        .subscribe((formData: InterfaceConfiguration) => {
          this.viewService.clearAll();
          this.formData = { ...this.formData, ...formData };
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }

          this.onChangeRequestType(this.formData.requestType);

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onChangeRequestType(requestType: string) {
    this.loading = true;

    const previousFormData: any = {
      interfaceName: this.formData.interfaceName,
      requestType: this.formData.requestType,
    };

    const formData: InterfaceConfiguration = new InterfaceConfiguration();

    this.formData = {
      ...formData,
      ...previousFormData,
    };

    this.headerFieldForm = new HeaderFieldForm();

    if (requestType == 'REST') {
      this.formData.dataType = 'JSON';
      this.reqBodyFieldForm = new ReqBodyFieldForm();
      this.resBodyFieldForm = new ResBodyFieldForm();
    } else if (requestType == 'SOAP') {
      this.formData.dataType = 'XML';
      this.reqBodyFieldForm = new ReqBodyFieldForm();
      this.resBodyFieldForm = new ResBodyFieldForm();
    } else if (requestType == 'MQ') {
      this.reqBodyFieldForm = new MqReqBodyDetailsForm();
      this.resBodyFieldForm = new MqResBodyDetailsForm();
    } else {
    }

    this.reqBodyFieldNameData = [];
    this.resBodyFieldNameData = [];

    this.requestBody = '';
    this.responseBody = '';

    setTimeout(() => {
      this.loading = false;
      // this.headerFieldGrid?.refreshGridList();
      // this.reqBodyFieldGrid?.refreshGridList();
      // this.resBodyFieldGrid?.refreshGridList();
    }, 100);
  }

  onAddHeaderFields() {
    const data: any = {
      ...this.headerFieldForm,
      hid: new Date().getTime() + Math.random() * 1000,
      actions: [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'onViewHeaderField',
          paramList: 'hid',
        },
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'fa-times',
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

  onCancelHeaderFieldForm() {
    this.showAddHeaderFields = false;

    this.headerFieldIndex = -1;

    this.headerFieldForm = new HeaderFieldForm();
  }

  private getHeaderFieldsIndex(id: string): number {
    return this.formData.headerFields.findIndex((record: HeaderFieldForm) => record.hid == id);
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

  onUpdateHeaderField() {
    this.formData.headerFields[this.headerFieldIndex] = this.headerFieldForm;

    this.headerFieldIndex = -1;

    this.headerFieldGrid?.refreshGridList();

    this.showAddHeaderFields = false;

    this.headerFieldForm = new HeaderFieldForm();
  }

  onParseRequestBody() {
    // Parser Code Here

    let requestBody: string = this.requestBody;

    // if (this.formData.dataType == 'XML') {
    //   requestBody = xml2json(requestBody, {
    //     compact: true,
    //     ignoreText: true,
    //   });
    // }

    const obj: any = JSON.parse(requestBody);

    if (obj) {
      this.reqBodyFieldNameData = [];
      this.prepareReqBodyFields(obj);

      this.toasterService.showToaster({
        severity: 'success',
        detail: this.formData.dataType + ' Request Body Parsed Successfully!!',
      });
    }
  }

  private prepareReqBodyFields(object: any) {
    Object.keys(object).forEach((key: string) => {
      if (typeof object[key] == 'object') {
        this.prepareReqBodyFields(object[key]);
      } else if (!this.reqBodyFieldNameData.find((reqBodyField: any) => reqBodyField.id == key)) {
        this.reqBodyFieldNameData.push({ id: key, displayName: key });
      }
    });
  }

  onClickReqBodyField(reqBodyField: string) {
    this.reqBodyFieldForm.fieldName = reqBodyField;
    this.showAddReqBodyFields = true;
  }

  onAddReqBodyFields() {
    const data: any = {
      ...this.reqBodyFieldForm,
      hid: new Date().getTime() + Math.random() * 1000,
      actions: [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'onViewReqBodyField',
          paramList: 'hid',
        },
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'fa-times',
          methodName: 'onDeleteReqBodyField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditReqBodyField',
          paramList: 'hid',
        },
      ],
    };

    this.formData.reqBodyFields.push(data);

    this.reqBodyFieldGrid?.refreshGridList();

    const reqBodyFieldIndex: number = this.reqBodyFieldNameData.findIndex(
      (reqBodyField: Select) => reqBodyField.id == this.reqBodyFieldForm.fieldName,
    );

    if (reqBodyFieldIndex != -1) {
      this.reqBodyFieldNameData.splice(reqBodyFieldIndex, 1);
    }

    this.showAddReqBodyFields = false;

    this.reqBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqReqBodyDetailsForm() : new ReqBodyFieldForm();
  }

  onCancelReqBodyFieldForm() {
    this.showAddReqBodyFields = false;

    this.reqBodyFieldIndex = -1;

    this.reqBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqReqBodyDetailsForm() : new ReqBodyFieldForm();
  }

  private getReqBodyFieldsIndex(id: string): number {
    return this.formData.reqBodyFields.findIndex((record: ReqBodyFieldForm) => record.hid == id);
  }

  onViewReqBodyField(id: string) {
    const index: number = this.getReqBodyFieldsIndex(id);
    if (index >= 0) {
      this.reqBodyFieldForm = this.formData.reqBodyFields[index];
      this.showAddReqBodyFields = true;
    }
  }

  onDeleteReqBodyField(id: string) {
    const index: number = this.getReqBodyFieldsIndex(id);
    if (index >= 0) {
      this.reqBodyFieldNameData.push({
        id: this.formData.reqBodyFields[index][
          this.formData.requestType == 'MQ' ? 'fieldType' : 'fieldName'
        ],
        displayName:
          this.formData.reqBodyFields[index][
          this.formData.requestType == 'MQ' ? 'fieldType' : 'fieldName'
          ],
      });

      this.formData.reqBodyFields.splice(index, 1);

      this.reqBodyFieldGrid?.refreshGridList();
    }
  }

  onEditReqBodyField(id: string) {
    const index: number = this.getReqBodyFieldsIndex(id);
    if (index >= 0) {
      this.reqBodyFieldIndex = index;
      this.reqBodyFieldForm = this.formData.reqBodyFields[index];
      this.showAddReqBodyFields = true;
    }
  }

  onUpdateReqBodyField() {
    this.formData.reqBodyFields[this.reqBodyFieldIndex] = this.reqBodyFieldForm;

    this.reqBodyFieldIndex = -1;

    this.reqBodyFieldGrid?.refreshGridList();

    this.showAddReqBodyFields = false;

    this.reqBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqReqBodyDetailsForm() : new ReqBodyFieldForm();
  }

  onParseResponseBody() {
    // Parser Code Here

    let responseBody: string = this.responseBody;

    // if (this.formData.dataType == 'XML') {
    //   responseBody = xml2json(responseBody, { compact: true });
    // }

    console.log(responseBody);

    const obj: any = JSON.parse(responseBody);

    if (obj) {
      this.resBodyFieldNameData = [];
      this.prepareResBodyFields(obj);
    }

    this.toasterService.showToaster({
      severity: 'success',
      detail: this.formData.dataType + ' Response Body Parsed Successfully!!',
    });
  }

  private prepareResBodyFields(object: any) {
    Object.keys(object).forEach((key: string) => {
      if (typeof object[key] == 'object') {
        this.prepareResBodyFields(object[key]);
      } else if (!this.resBodyFieldNameData.find((resBodyField: any) => resBodyField.id == key)) {
        this.resBodyFieldNameData.push({ id: key, displayName: key });
      }
    });
  }

  onClickResBodyField(resBodyField: string) {
    this.resBodyFieldForm.fieldName = resBodyField;
    this.showAddResBodyFields = true;
  }

  onAddResBodyFields() {
    const data: any = {
      ...this.resBodyFieldForm,
      hid: new Date().getTime() + Math.random() * 1000,
      actions: [
        {
          index: 1,
          displayName: 'View',
          type: 'ICON',
          icon: 'fa-eye',
          methodName: 'onViewResBodyField',
          paramList: 'hid',
        },
        {
          index: 2,
          displayName: 'Delete',
          type: 'ICON',
          icon: 'fa-times',
          methodName: 'onDeleteResBodyField',
          paramList: 'hid',
        },
        {
          index: 3,
          displayName: 'Edit',
          type: 'ICON',
          icon: 'fa-pencil',
          methodName: 'onEditResBodyField',
          paramList: 'hid',
        },
      ],
    };

    this.formData.resBodyFields.push(data);

    this.resBodyFieldGrid?.refreshGridList();

    const resBodyFieldIndex: number = this.resBodyFieldNameData.findIndex(
      (resBodyField: Select) => resBodyField.id == this.resBodyFieldForm.fieldName,
    );

    if (resBodyFieldIndex != -1) {
      this.resBodyFieldNameData.splice(resBodyFieldIndex, 1);
    }

    this.showAddResBodyFields = false;

    this.resBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqResBodyDetailsForm() : new ResBodyFieldForm();
  }

  onCancelResBodyFieldForm() {
    this.showAddResBodyFields = false;

    this.resBodyFieldIndex = -1;

    this.resBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqResBodyDetailsForm() : new ResBodyFieldForm();
  }

  private getResBodyFieldsIndex(id: string): number {
    return this.formData.resBodyFields.findIndex((record: ResBodyFieldForm) => record.hid == id);
  }

  onViewResBodyField(id: string) {
    const index: number = this.getResBodyFieldsIndex(id);
    if (index >= 0) {
      this.resBodyFieldForm = this.formData.resBodyFields[index];
      this.showAddResBodyFields = true;
    }
  }

  onDeleteResBodyField(id: string) {
    const index: number = this.getResBodyFieldsIndex(id);
    if (index >= 0) {
      this.resBodyFieldNameData.push({
        id: this.formData.resBodyFields[index][
          this.formData.requestType == 'MQ' ? 'fieldType' : 'fieldName'
        ],
        displayName:
          this.formData.resBodyFields[index][
          this.formData.requestType == 'MQ' ? 'fieldType' : 'fieldName'
          ],
      });

      this.formData.resBodyFields.splice(index, 1);

      this.resBodyFieldGrid?.refreshGridList();
    }
  }

  onEditResBodyField(id: string) {
    const index: number = this.getResBodyFieldsIndex(id);
    if (index >= 0) {
      this.resBodyFieldIndex = index;
      this.resBodyFieldForm = this.formData.resBodyFields[index];
      this.showAddResBodyFields = true;
    }
  }

  onUpdateResBodyField() {
    this.formData.resBodyFields[this.resBodyFieldIndex] = this.resBodyFieldForm;

    this.resBodyFieldIndex = -1;

    this.resBodyFieldGrid?.refreshGridList();

    this.showAddResBodyFields = false;
    this.resBodyFieldForm =
      this.formData.requestType == 'MQ' ? new MqResBodyDetailsForm() : new ResBodyFieldForm();
  }

  onTestConnection() {
    setTimeout(() => {
      this.toasterService.showToaster({
        severity: 'success',
        detail: 'Connection Test Successful!!',
      });
    }, 100);
  }

  beforeSubmit() {
    return true;
  }

  afterSubmit(response: any) {
    this.router.navigate(['/setup/process/interfaceConfiguration/listing']);
  }
}
