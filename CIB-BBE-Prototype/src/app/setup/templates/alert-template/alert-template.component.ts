import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Select } from 'src/app/shared/@models/select.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AlertTemplate } from './@models/alert-template.model';
import { TINYMCE_DEFAULT_CONFIG, TINYMCE_DEFAULT_TEXT_CONFIG } from './@models/tinymce-default';
// import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-alert-template',
  templateUrl: './alert-template.component.html',
  styleUrls: ['./alert-template.component.scss']
})
export class AlertTemplateComponent implements OnInit {
  @ViewChild('bankProfileForm') bankProfileForm: any;

  formData: AlertTemplate = new AlertTemplate();
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Alert Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private actionsService: ActionService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Alert Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Security-Corporate' },
      { label: 'Service Template' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.getViewData();
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/alertTemplate/private/view', data)
        .subscribe((formData: AlertTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onModuleChange(formData.moduleId);
          this.onCategoryChange(formData.categoryId);
          // this.onCorporateSelected({
          //   id: this.formData.corporateId,
          //   corporateCode: this.formData.corporateCode,
          //   corporateName: this.formData.corporateName,
          // });
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }

  // categoryList = [
  //   { displayName: "Invoice" },
  //   { displayName: "Finance" },
  //   { displayName: "Recovery" },
  // ]

  editorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_CONFIG);
  plainEditorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_TEXT_CONFIG);

  subProductArray = [];
  eventArray = [];
  isTagListLoading: boolean = false;

  // private processTags(tagList: Select[]): void {
  //   this.editorInitConfig.setup = function (editor) {
  //     editor.ui.registry.addMenuButton('tagList', {
  //       text: 'Tag List',
  //       fetch: function (callback) {
  //         var items = [];
  //         tagList.forEach((tag: Select) => {
  //           if (tag.enrichments.availableOnUI) {
  //             items.push({
  //               type: 'menuitem',
  //               text: tag.displayName,
  //               onAction: function () {
  //                 editor.insertContent('&lt;&lt;' + tag.id + '&gt;&gt;');
  //               },
  //             });
  //           }
  //         });
  //         callback(items);
  //       },
  //     });
  //   };
  //   this.plainEditorInitConfig.setup = this.editorInitConfig.setup;
  //   this.isTagListLoading = false;
  // }

  // private getTagList(): void {
  //   this.isTagListLoading = true;
  //   let data = { dataMap: { docTemplateTypeId: this.formData.docTemplateTypeId } };
  //   this.httpService
  //     .httpPost('setup/templates/documentDesigner/private/getTagList', data)
  //     .subscribe((response: any) => {
  //       this.processTags(response.dataList);
  //     });
  // }

  onCategoryChange(value) {
    this.eventArray = [];
    if (value == 'Setup') {

      this.eventArray = [
        { id: 'Master Modification', displayName: 'Master Modification' },
        { id: 'Modification Of Parameters', displayName: 'Modification Of Parameters' },
        { id: 'User Locked due to Bad Logins', displayName: 'User Locked due to Bad Logins' },
        { id: 'Authorization of assigned token', displayName: 'Authorization of assigned token' },
        { id: 'User Activated', displayName: 'User Activated' },
        { id: 'Self-Service Request Authorization to BBE', displayName: 'Self-Service Request Authorization to BBE' },
        { id: 'Login Initiation', displayName: 'Login Initiation' },
        { id: 'Request New Draft', displayName: 'Request New Draft' }
      ];

    }

    else if (value == 'Payment') {

      this.eventArray = [
        { id: 'Cheque Printing', displayName: 'Cheque Printing' },
        { id: 'Bill Payment', displayName: 'Bill Payment' },
        { id: 'On Due Date', displayName: 'On Due Date' },
        { id: 'Disabling Biller', displayName: 'Disabling Biller' },
        { id: 'Send For Release', displayName: 'Send For Release' }
      ];

    }

    else if (value == 'Corporate Onboarding') {

      this.eventArray = [
        { id: 'Corporate Program Limit Entry', displayName: 'Corporate Program Limit Entry' },
        { id: 'Seller/Buyer Onboarding by Sponsor', displayName: 'Seller/Buyer Onboarding by Sponsor' },
        { id: 'Seller/Buyer Onboarding successful by bank', displayName: 'Seller/Buyer Onboarding successful by bank' },
        { id: 'Entity Sub code successfully created', displayName: 'Entity Sub code successfully created' },
        { id: 'Generic', displayName: 'Generic' }

      ];

    }

  }

  onModuleChange(value) {

    this.subProductArray = [];

    this.eventArray = [];

    if (value == 'Setup') {

      this.subProductArray = [
        { id: 'Setup', displayName: 'Setup' },
        { id: 'Process', displayName: 'Process' },
        { id: 'Corporate Onboarding', displayName: 'Corporate Onboarding' },
        { id: 'Administration', displayName: 'Administration' },
        { id: 'All Transaction', displayName: 'All Transaction' }
      ];

    }

    else if (value == 'Payment') {
      this.subProductArray = [
        { id: 'Payment', displayName: 'Payment' }
      ];

    }

    else if (value == 'FSCM') {

      this.subProductArray = [
        { id: 'Corporate Onboarding', displayName: 'Corporate Onboarding' },
        { id: 'Process', displayName: 'Process' },
        { id: 'Technical', displayName: 'Technical' },
        { id: 'Transaction', displayName: 'Transaction' }
      ];

    }

  }

}
