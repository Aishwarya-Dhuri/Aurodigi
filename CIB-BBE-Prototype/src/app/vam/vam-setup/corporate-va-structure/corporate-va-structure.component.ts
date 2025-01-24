import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import {
  CorporateVAStructure,
  StructureComponent,
  StructurePreview,
} from './@models/corporate-va-structure.model';

@Component({
  selector: 'app-corporate-va-structure',
  templateUrl: './corporate-va-structure.component.html',
  styleUrls: ['./corporate-va-structure.component.scss'],
})
export class CorporateVaStructureComponent implements OnInit {
  mode: string;
  stepperDetails: Stepper = {
    masterName: 'Corporate VA Structure',
    currentStep: 1,
    isSaveDraftApplicable: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['Corporate Details', 'Structure Details', 'Review and Submit'],
  };

  formData: CorporateVAStructure;

  isShowDraftModal: boolean;

  isShowCopyFromModal: boolean;
  reviewColDefUrl: string = 'vam/vamSetup/corporateVAStructure/private/reviewColDefs';
  reviewRowDefUrl: string = 'vam/vamSetup/corporateVAStructure/private/getAuthorizedList';

  isShowCorporateSearch: boolean;
  corporateSearchColDefUrl: string = 'commons/searchService/private/corporateSearchColDefs';
  corporateSearchRowDefUrl: string =
    'setup/corporateOnboarding/corporateMain/private/getAuthorizedList';
  accountNoList: Select[] = [];
  bankConstantList: Select[] = [];
  vaCreationLogicList: Select[];
  structurePreviewList: StructurePreview[] = [];
  uploadFormatList: Select[];
  downloadFormatList: Select[];
  fieldTypeList: Select[];
  dynamicTypeList: Select[];
  referenceTypeList: Select[];
  dataTypeList: Select[];

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private router: Router,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    /* remove below : starts */
    const actions: Actions = {
      heading: 'Corporate VA Structure',
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
      { label: 'Corporate VA Structure' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.formData = {
      structureCreationFor: 'POBO',
      corporateCode: '',
      corporateStructureName: '',
      virtualAccountType: 'Normal',
      prefixValue: '',
      vaStatus: 'Active',
      lenOfVA: '',
      countOfVA: '',
      vaStructureComponentList: [],
      vaStructurePreview: '',
    };

    this.vaCreationLogicList = [
      { id: 'Bank Implementation', displayName: 'Bank Implementation' },
      { id: 'Adhoc VA Creation', displayName: 'Adhoc VA Creation' },
      { id: 'Component Based VA', displayName: 'Component Based VA' },
    ];

    this.fieldTypeList = [
      { id: 'Dynamic', displayName: 'Dynamic' },
      { id: 'Static', displayName: 'Static' },
    ];

    this.dynamicTypeList = [
      { id: 'Series', displayName: 'Series' },
      { id: 'Reference Field', displayName: 'Reference Field' },
    ];

    this.getReferenceTypeList();
    this.getDataTypeList();
    this.getViewData();
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1) {
      return true;
    } else if (stepNo == 2) {
      return true;
    }
    return true;
  }

  getSubHeading(stepNo: number): string {
    if (stepNo == 1) {
      return 'Account Number: ' + this.formData.corporateAccount;
    } else if (stepNo == 2) {
      return this.formData.vaCreationLogic;
    }
    return 'Step' + stepNo + ' Details';
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();

    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('vam/vamSetup/corporateVAStructure/private/view', data)
        .subscribe((formData: CorporateVAStructure) => {
          this.viewService.clearAll();
          this.formData = formData;
          this.onCorporateSelected({
            id: this.formData.corporateId,
            corporateCode: this.formData.corporateCode,
            corporateName: this.formData.corporateName,
          });
          this.generateStructurePreview();
          if (this.mode == 'VIEW') this.stepperDetails.currentStep = 3;
        });
    }
  }

  onOpenDraft(formData: CorporateVAStructure): void {
    this.formData = _.cloneDeep(formData);
    this.stepperDetails.isUpdateDraft = true;
    this.formData.draftId = formData.id;
    this.onCorporateSelected({
      id: this.formData.corporateId,
      corporateCode: this.formData.corporateCode,
      corporateName: this.formData.corporateName,
    });
    this.generateStructurePreview();
    this.stepperDetails.currentStep = 1;
  }

  onCopyFrom(formData: CorporateVAStructure): void {
    const data = { dataMap: { id: formData.id } };
    this.httpService
      .httpPost('vam/vamSetup/corporateVAStructure/private/view', data)
      .subscribe((response: CorporateVAStructure) => {
        this.formData = _.cloneDeep(response);
        this.onCorporateSelected({
          id: this.formData.corporateId,
          corporateCode: this.formData.corporateCode,
          corporateName: this.formData.corporateName,
        });
        this.generateStructurePreview();
        this.stepperDetails.currentStep = 1;
      });
  }

  onCorporateSelected(corporate: any): void {
    if (!corporate) return;
    this.formData.corporateId = corporate.id.toString();
    this.formData.corporateCode = corporate.corporateCode.toString();
    this.formData.corporateName = corporate.corporateName;
    this.getAccountNoList();
    this.getBankConstantList();
    this.getUploadFormatList();
    this.getDownloadFormatList();
  }

  getAccountNoList(): void {
    /* const data = {"filters": [{ "name": "corpId", "value": this.formData.corporateId, "type": "String"}]}; */
    const data = { dataMap: { corporateId: this.formData.corporateId } };
    this.httpService
      .httpPost('setup/corporateOnboarding/corporateMain/private/accountList', data)
      .subscribe((response: any) => {
        this.accountNoList = response.dataList;
      });
  }

  onAccountSelection(): void {
    const account = this.accountNoList.find((a: any) => a.id === this.formData.corporateAccountId);
    if (!account) return;
    this.formData.corporateAccount = account.displayName;
    this.formData.accountDescription = account.enrichments.accountDesc;
    this.formData.accountBranch = account.enrichments.accountBranch;
  }

  getBankConstantList(): void {
    const url = 'vam/vamSetup/corporateVAStructure/private/dropdown/bankConstants';
    const data = {
      filters: [{ name: 'corpId', value: this.formData.corporateId, type: 'String' }],
    };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.bankConstantList = response.dataList;
    });
  }

  getUploadFormatList(): void {
    this.uploadFormatList = [];
    const url = 'vam/vamSetup/corporateVAStructure/private/dropdown/uploadFormats';
    const data = { filters: [] };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.uploadFormatList = response.dataList;
    });
  }

  getDownloadFormatList(): void {
    this.downloadFormatList = [];
    const url = 'vam/vamSetup/corporateVAStructure/private/dropdown/downloadFormats';
    const data = { filters: [] };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.downloadFormatList = response.dataList;
    });
  }

  getReferenceTypeList(): void {
    this.referenceTypeList = [];
    const url = 'vam/vamSetup/corporateVAStructure/private/dropdown/referenceTypes';
    const data = { filters: [] };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.referenceTypeList = response.dataList;
    });
  }

  getDataTypeList(): void {
    this.referenceTypeList = [];
    const url = 'vam/vamSetup/corporateVAStructure/private/dropdown/dataTypes';
    const data = { filters: [] };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.dataTypeList = response.dataList;
    });
  }

  onBankConstantSelection(): void {
    const bankConstant = this.bankConstantList.find(
      (a: any) => a.id === this.formData.bankStructureId,
    );
    if (!bankConstant) return;
    this.formData.bankStructureName = bankConstant.displayName;
    this.formData.maxLength = bankConstant.enrichments.maxLength;
    this.formData.prefixValue = bankConstant.enrichments.prefixValue;
  }

  getDefaultStructure(isExpand: boolean): StructureComponent {
    return {
      isExpand: isExpand,
      isPartialMatch: false,
      padding: 'Left',
      fieldLen: '',
      staticValue: '',
      startSeries: '',
      endSeries: '',
      paddingVal: '',
    };
  }
  generateStructures(): void {
    this.formData.vaStructureComponentList = [];
    if (this.formData.vaCreationLogic == 'Component Based VA') {
      this.formData.vaStructureComponentList.push(_.cloneDeep(this.getDefaultStructure(true)));
    }
  }

  generateStructurePreview(): void {
    this.structurePreviewList = [];
    this.structurePreviewList.push({
      index: 0,
      name: 'Bank Constant - Bank Code',
      value: this.formData.prefixValue,
      class: 'bkgrnd-0',
    });

    if (
      this.formData.vaCreationLogic &&
      (this.formData.vaCreationLogic == 'Bank Implementation' ||
        this.formData.vaCreationLogic == 'Adhoc VA Creation') &&
      this.formData.lenOfVA
    ) {
      let value = '';
      for (let i = 0; i < parseInt(this.formData.lenOfVA) - this.formData.prefixValue.length; i++)
        value = value + 'X';
      this.structurePreviewList.push({
        index: 1,
        name:
          this.formData.vaCreationLogic == 'Bank Implementation'
            ? 'Bank Implementation'
            : 'Issuance Uploaded FIle',
        value: value,
        class: 'bkgrnd-1',
      });
    } else if (
      this.formData.vaCreationLogic &&
      this.formData.vaCreationLogic == 'Component Based VA' &&
      this.formData.lenOfVA
    ) {
      this.formData.vaStructureComponentList.forEach((structure: StructureComponent, i: number) => {
        if (structure.fieldLen && structure.fieldType) {
          let name = '';
          if (structure.fieldType == 'Dynamic' && structure.referenceType)
            name = structure.referenceType;
          else if (structure.fieldType) name = structure.fieldType;

          let value = '';
          if (structure.fieldType == 'Dynamic' && structure.referenceType == 'Corporate Code') {
            if (value.length < parseInt(structure.fieldLen) && !structure.paddingVal) return;
            value = this.formData.corporateCode.slice(0, parseInt(structure.fieldLen));
            if (value.length < parseInt(structure.fieldLen)) {
              const padLength = parseInt(structure.fieldLen) - value.length;
              for (let i = 0; i < padLength; i++) {
                if (structure.paddingVal && structure.padding == 'Left') {
                  value = structure.paddingVal + value;
                } else if (structure.paddingVal && structure.padding == 'Right') {
                  value = value + structure.paddingVal;
                }
              }
            }
          } else if (
            structure.fieldType == 'Static' &&
            structure.dataType &&
            structure.staticValue
          ) {
            value = structure.staticValue;
          } else if (
            (structure.fieldType == 'Dynamic' && structure.dynamicType == 'Series') ||
            (structure.fieldType == 'Dynamic' && structure.referenceType != 'Corporate Code')
          ) {
            for (let i = 0; i < parseInt(structure.fieldLen); i++) value = value + 'X';
          }

          if (name && value) {
            this.structurePreviewList.push({
              index: i + 1,
              name: name,
              value: value,
              class: 'bkgrnd-' + ((i + 1) % 10),
            });
          }
        }
      });
    }
  }

  getCurrentVALength(): number {
    let charUsed: number = 0;
    this.structurePreviewList.forEach((component: StructurePreview) => {
      charUsed = charUsed + component.value.length;
    });
    return charUsed;
  }

  getComponentProgressValue(): number {
    return (this.getCurrentVALength() / parseInt(this.formData.lenOfVA)) * 100;
  }

  getRemainigVALength(): number {
    return parseInt(this.formData.lenOfVA) - this.getCurrentVALength();
  }

  showHideStructureDetails(index: number): void {
    for (let i = 0; i < this.formData.vaStructureComponentList.length; i++) {
      if (i == index)
        this.formData.vaStructureComponentList[i].isExpand =
          !this.formData.vaStructureComponentList[i].isExpand;
      else this.formData.vaStructureComponentList[i].isExpand = false;
    }
  }

  resetComponent(index: number, from: string): void {
    if (from == 'All') {
      this.formData.vaStructureComponentList[index].fieldLen = '';
      this.formData.vaStructureComponentList[index].dynamicType = '';
      this.formData.vaStructureComponentList[index].dataType = '';
      this.formData.vaStructureComponentList[index].startSeries = '';
      this.formData.vaStructureComponentList[index].endSeries = '';
      this.formData.vaStructureComponentList[index].referenceType = '';
      this.formData.vaStructureComponentList[index].padding = 'Left';
      this.formData.vaStructureComponentList[index].paddingVal = '';
      this.formData.vaStructureComponentList[index].staticValue = '';
    } else if (from == 'dynamicType') {
      this.formData.vaStructureComponentList[index].startSeries = '';
      this.formData.vaStructureComponentList[index].endSeries = '';
      this.formData.vaStructureComponentList[index].referenceType = '';
      this.formData.vaStructureComponentList[index].padding = 'Left';
      this.formData.vaStructureComponentList[index].paddingVal = '';
      this.formData.vaStructureComponentList[index].staticValue = '';
    } else if (from == 'referenceType') {
      this.formData.vaStructureComponentList[index].padding = 'Left';
      this.formData.vaStructureComponentList[index].paddingVal = '';
    } else if (from == 'dataType') {
      this.formData.vaStructureComponentList[index].staticValue = '';
    }
  }

  onAddComponent(): void {
    this.formData.vaStructureComponentList.push(_.cloneDeep(this.getDefaultStructure(false)));
    this.showHideStructureDetails(this.formData.vaStructureComponentList.length - 1);
  }

  beforeSubmit() {
    this.formData.vaStructurePreview = '';
    this.structurePreviewList.forEach((d) => (this.formData.vaStructurePreview += d.value || ''));
    return true;
  }
}
