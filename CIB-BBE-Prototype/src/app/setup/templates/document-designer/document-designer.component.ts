import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, ValidationErrors } from '@angular/forms';
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
import { DocumentDesigner } from './@model/document-designer';
import { TINYMCE_DEFAULT_CONFIG, TINYMCE_DEFAULT_TEXT_CONFIG } from './@model/tinymce-default';

@Component({
  selector: 'app-document-designer',
  templateUrl: './document-designer.component.html',
  styleUrls: ['./document-designer.component.scss'],
})
export class DocumentDesignerComponent implements OnInit {
  mode!: string;
  formData: DocumentDesigner = new DocumentDesigner();
  @ViewChild('step1Form') step1Form: any;

  stepperDetails: Stepper = {
    masterName: 'Document Designer',
    stepperType: 'VERTICAL',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isHideLastStep: true,
    headings: ['Document Details', 'Message', 'Review and Submit'],
  };
  isHeaderLoaded: boolean = true;

  productList: Select[] = [];
  moduleList: Select[] = [];
  documentTemplateTypeList: Select[] = [];
  channelList: Select[] = [];
  triggerPoint: string = '';
  isTagListLoading: boolean = false;

  editorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_CONFIG);
  plainEditorInitConfig: any = _.cloneDeep(TINYMCE_DEFAULT_TEXT_CONFIG);

  previewData: string;
  isShowPreview: boolean = false;
  //   '<p>&nbsp;</p> <p><img style="float: left;" title="Tiny Logo" src="http://localhost:2000/assets/header-images/product-logo.png" alt="Aurionpro Logo" width="125" height="71"><img style="float: right;" src="http://localhost:2000/assets/header-images/sys_1647319695098_bank-logo-bkp.png" alt="" width="169" height="60"></p> <p>&nbsp;</p> <h2 style="text-align: center;">Welcome to the TinyMCE demo!</h2> <h2>&nbsp;</h2> <h2>A simple table</h2> <table style="border-collapse: collapse; width: 50%; margin-left: auto; margin-right: auto;" border="1"> <thead> <tr> <th>Product</th> <th>Cost</th> <th>Really?</th> </tr> </thead> <tbody> <tr> <td>CKEditor</td> <td>Get started for free</td> <td>YES!</td> </tr> <tr> <td>TintMCE</td> <td>Free</td> <td>YES!</td> </tr> </tbody> </table> <p>&nbsp;</p>';

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Document Designer',
      refresh: true,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Templates' },
      { label: 'Document Designer' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */
    this.getViewData();
  }

  private getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/documentDesigner/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.updateViewData();
          this.onDocumentDesignTypeChange();
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
    this.getProductList();
  }

  private updateViewData(): void {
    this.formData.documentDesignType = this.formData.documentDesignType.toString().split(',');
    this.formData.emailbody =
      this.formData.emailbody1 +
      this.formData.emailbody2 +
      this.formData.emailbody3 +
      this.formData.emailbody4;
    this.formData.documentHeader =
      this.formData.documentHeader1 +
      this.formData.documentHeader2 +
      this.formData.documentHeader3 +
      this.formData.documentHeader4;
    this.formData.pageHeader =
      this.formData.pageHeader1 +
      this.formData.pageHeader2 +
      this.formData.pageHeader3 +
      this.formData.pageHeader4;
    this.formData.text =
      this.formData.text1 + this.formData.text2 + this.formData.text3 + this.formData.text4;
    this.formData.pageFooter =
      this.formData.pageFooter1 +
      this.formData.pageFooter2 +
      this.formData.pageFooter3 +
      this.formData.pageFooter4;
    this.formData.documentFooter =
      this.formData.documentFooter1 +
      this.formData.documentFooter2 +
      this.formData.documentFooter3 +
      this.formData.documentFooter4;
    this.formData.online =
      this.formData.online1 + this.formData.online2 + this.formData.online3 + this.formData.online4;
  }

  private getProductList(): void {
    this.httpService
      .httpPost('setup/templates/documentDesigner/private/getProductList')
      .subscribe((response: any) => {
        this.productList = response.dataList;
        if (this.mode) this.onProductChange();
      });
  }

  onProductChange(): void {
    const product = this.productList.find((a: any) => a.id === this.formData.cashProProductId);
    if (!product) return;
    this.formData.cashProProductName = product.displayName;
    this.moduleList = product.enrichments.moduleList;
    if (!this.mode) {
      this.formData.moduleName = '';
      this.formData.docTemplateTypeId = '';
      this.formData.docTemplateTypeName = '';
      this.triggerPoint = '';
      this.formData.documentDesignType = '';
      this.channelList = [];
    } else {
      this.onModuleChange();
    }
  }

  onModuleChange(): void {
    const module = this.moduleList.find((a: any) => a.id === this.formData.moduleName);
    if (!module) return;
    this.documentTemplateTypeList = module.enrichments.documentTemplateTypeList;
    if (!this.mode) {
      this.formData.docTemplateTypeId = '';
      this.formData.docTemplateTypeName = '';
      this.triggerPoint = '';
      this.formData.documentDesignType = '';
      this.channelList = [];
    } else {
      this.onDocumentTemplateTypeChange();
    }
  }

  onDocumentTemplateTypeChange(): void {
    const document = this.documentTemplateTypeList.find(
      (a: any) => a.id === this.formData.docTemplateTypeId,
    );
    if (!document) return;
    this.formData.docTemplateTypeName = document.displayName;
    this.triggerPoint = document.enrichments.triggerPoint;
    this.channelList = document.enrichments.channelList;
    this.getTagList();
    if (!this.mode) {
      this.formData.documentDesignType = '';
    } else {
      this.onDocumentDesignTypeChange();
    }
  }

  private getTagList(): void {
    this.isTagListLoading = true;
    let data = { dataMap: { docTemplateTypeId: this.formData.docTemplateTypeId } };
    this.httpService
      .httpPost('setup/templates/documentDesigner/private/getTagList', data)
      .subscribe((response: any) => {
        this.processTags(response.dataList);
      });
  }

  private processTags(tagList: Select[]): void {
    this.editorInitConfig.setup = function (editor) {
      editor.ui.registry.addMenuButton('tagList', {
        text: 'Tag List',
        fetch: function (callback) {
          var items = [];
          tagList.forEach((tag: Select) => {
            if (tag.enrichments.availableOnUI) {
              items.push({
                type: 'menuitem',
                text: tag.displayName,
                onAction: function () {
                  editor.insertContent('&lt;&lt;' + tag.id + '&gt;&gt;');
                },
              });
            }
          });
          callback(items);
        },
      });
    };
    this.plainEditorInitConfig.setup = this.editorInitConfig.setup;
    this.isTagListLoading = false;
  }

  isApplicable(channelName: string): boolean {
    return this.formData.documentDesignType.indexOf(channelName) != -1;
  }

  onDocumentDesignTypeChange(): void {
    this.isHeaderLoaded = false;
    this.stepperDetails.headings = ['Document Details', 'Review and Submit'];
    if (this.isApplicable('Push Notification')) {
      this.stepperDetails.headings.splice(1, 0, 'Push Notification Details');
    }
    if (this.isApplicable('Online')) {
      this.stepperDetails.headings.splice(1, 0, 'Online Details');
    }
    if (this.isApplicable('SMS')) {
      this.stepperDetails.headings.splice(1, 0, 'SMS Details');
    }
    if (this.isApplicable('Print')) {
      this.stepperDetails.headings.splice(1, 0, 'Document Footer Details');
      this.stepperDetails.headings.splice(1, 0, 'Page Footer Details');
      this.stepperDetails.headings.splice(1, 0, 'Text Details');
      this.stepperDetails.headings.splice(1, 0, 'Page Header Details');
      this.stepperDetails.headings.splice(1, 0, 'Document Header Details');
      this.stepperDetails.headings.splice(
        this.stepperDetails.headings.length - 1,
        0,
        'Watermark Details',
      );
    }
    if (this.isApplicable('Email')) {
      if (!this.isApplicable('Print') && this.formData.fileType == 'Attachment (PDF)') {
        this.stepperDetails.headings.splice(1, 0, 'Document Footer Details');
        this.stepperDetails.headings.splice(1, 0, 'Page Footer Details');
        this.stepperDetails.headings.splice(1, 0, 'Text Details');
        this.stepperDetails.headings.splice(1, 0, 'Page Header Details');
        this.stepperDetails.headings.splice(1, 0, 'Document Header Details');
        this.stepperDetails.headings.splice(
          this.stepperDetails.headings.length - 1,
          0,
          'Watermark Details',
        );
      }
      this.stepperDetails.headings.splice(1, 0, 'Email Details');
    }
    setTimeout(() => {
      this.isHeaderLoaded = true;
    }, 10);
  }

  onFileTypeChange(type: Select): void {
    if (!type) return;
    this.formData.fileTypeName = type.displayName;
    this.onDocumentDesignTypeChange();
  }

  onWaterMarkDirectionChange(direction: Select): void {
    if (!direction) return;
    this.formData.waterMarkDirectionName = direction.displayName;
  }

  getStepNumber(tabName: string): number {
    if (this.stepperDetails.headings.indexOf(tabName) == -1) {
      return -1;
    }
    return this.stepperDetails.headings.indexOf(tabName) + 1;
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.step1Form) {
      return this.step1Form.valid && this.formData.documentDesignType.length > 0;
    } else if (this.getStepNumber('Email Details') == stepNo) {
      return !(!this.formData.emailSubject || !this.formData.emailbody);
    } /* else if (this.getStepNumber('Document Header Details') == stepNo) {
      return !!this.formData.documentHeader;
    } else if (this.getStepNumber('Page Header Details') == stepNo) {
      return !!this.formData.pageHeader;
    }  */ else if (this.getStepNumber('Text Details') == stepNo) {
      return !!this.formData.text;
    } /* else if (this.getStepNumber('Page Footer Details') == stepNo) {
      return !!this.formData.pageFooter;
    } else if (this.getStepNumber('Document Footer Details') == stepNo) {
      return !!this.formData.documentFooter;
    }  */ else if (this.getStepNumber('SMS Details') == stepNo) {
      return !!this.formData.sms;
    } else if (this.getStepNumber('Online Details') == stepNo) {
      return !!this.formData.online;
    } else if (this.getStepNumber('Push Notification Details') == stepNo) {
      return !!this.formData.pushNotification;
    } else if (this.getStepNumber('Watermark Details') == stepNo) {
      return !(!this.formData.waterMarkText || !this.formData.waterMarkDirection);
    }
    return true;
  }

  getStepCompletePercentage(stepNo: number): number {
    if (stepNo == 1 && this.step1Form) {
      return this.getFormCompletionPercent(this.step1Form);
    } else if (this.getStepNumber('Email Details') == stepNo) {
      return !this.formData.emailSubject && !this.formData.emailbody
        ? 5
        : !this.formData.emailSubject || !this.formData.emailbody
        ? 50
        : 100;
    } else if (this.getStepNumber('Document Header Details') == stepNo) {
      return this.formData.documentHeader ? 100 : 0;
    } else if (this.getStepNumber('Page Header Details') == stepNo) {
      return this.formData.pageHeader ? 100 : 0;
    } else if (this.getStepNumber('Text Details') == stepNo) {
      return this.formData.text ? 100 : 0;
    } else if (this.getStepNumber('Page Footer Details') == stepNo) {
      return this.formData.pageFooter ? 100 : 0;
    } else if (this.getStepNumber('Document Footer Details') == stepNo) {
      return this.formData.documentFooter ? 100 : 0;
    } else if (this.getStepNumber('SMS Details') == stepNo) {
      return this.formData.sms ? 100 : 0;
    } else if (this.getStepNumber('Online Details') == stepNo) {
      return this.formData.online ? 100 : 0;
    } else if (this.getStepNumber('Push Notification Details') == stepNo) {
      return this.formData.pushNotification ? 100 : 0;
    } else if (this.getStepNumber('Watermark Details') == stepNo) {
      return !this.formData.waterMarkText && !this.formData.waterMarkDirection
        ? 5
        : !this.formData.waterMarkText || !this.formData.waterMarkDirection
        ? 50
        : 100;
    }
    return 100;
  }

  private getFormCompletionPercent(form: NgForm): number {
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

  beforeSubmit(): boolean {
    const documentDesignType: any = _.cloneDeep(this.formData.documentDesignType);
    this.formData.documentDesignType = documentDesignType.join(',');
    this.formData.emailbody1 = this.formData.emailbody.substring(0, 30001);
    this.formData.emailbody2 = this.formData.emailbody.substring(3000, 60001);
    this.formData.emailbody3 = this.formData.emailbody.substring(6000, 90001);
    this.formData.emailbody4 = this.formData.emailbody.substring(9000);
    this.formData.documentHeader1 = this.formData.documentHeader.substring(0, 30001);
    this.formData.documentHeader2 = this.formData.documentHeader.substring(3000, 60001);
    this.formData.documentHeader3 = this.formData.documentHeader.substring(6000, 90001);
    this.formData.documentHeader4 = this.formData.documentHeader.substring(9000);
    this.formData.pageHeader1 = this.formData.pageHeader.substring(0, 30001);
    this.formData.pageHeader2 = this.formData.pageHeader.substring(3000, 60001);
    this.formData.pageHeader3 = this.formData.pageHeader.substring(6000, 90001);
    this.formData.pageHeader4 = this.formData.pageHeader.substring(9000);
    this.formData.text1 = this.formData.text.substring(0, 30001);
    this.formData.text2 = this.formData.text.substring(3000, 60001);
    this.formData.text3 = this.formData.text.substring(6000, 90001);
    this.formData.text4 = this.formData.text.substring(9000);
    this.formData.pageFooter1 = this.formData.pageFooter.substring(0, 30001);
    this.formData.pageFooter2 = this.formData.pageFooter.substring(3000, 60001);
    this.formData.pageFooter3 = this.formData.pageFooter.substring(6000, 90001);
    this.formData.pageFooter4 = this.formData.pageFooter.substring(9000);
    this.formData.documentFooter1 = this.formData.documentFooter.substring(0, 30001);
    this.formData.documentFooter2 = this.formData.documentFooter.substring(3000, 60001);
    this.formData.documentFooter3 = this.formData.documentFooter.substring(6000, 90001);
    this.formData.documentFooter4 = this.formData.documentFooter.substring(9000);
    this.formData.online1 = this.formData.online.substring(0, 30001);
    this.formData.online2 = this.formData.online.substring(3000, 60001);
    this.formData.online3 = this.formData.online.substring(6000, 90001);
    this.formData.online4 = this.formData.online.substring(9000);
    return true;
  }

  onPreviewClick(): void {
    this.previewData =
      this.formData.documentHeader +
      this.formData.pageHeader +
      this.formData.text +
      this.formData.pageFooter +
      this.formData.documentFooter;
    this.isShowPreview = true;
  }
}
