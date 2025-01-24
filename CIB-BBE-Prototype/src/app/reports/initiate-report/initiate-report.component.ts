import * as _ from 'lodash';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Select } from 'src/app/shared/@models/select.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import {
  FilterCondition,
  Report,
  ReportField,
  ReportScreenConfig,
  REPORT_URL_CONSTANT,
  ScheduleReport,
  SortCondition,
} from '../@models/report.model';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-initiate-report',
  templateUrl: './initiate-report.component.html',
  styleUrls: ['./initiate-report.component.scss'],
})
export class InitiateReportComponent implements OnInit {
  @Output() isCancelClick = new EventEmitter<boolean>();

  formData: Report = new Report();
  screenConfig: ReportScreenConfig = new ReportScreenConfig();

  categoryList: Select[] = [];
  subCategoryList: Select[] = [];
  reportList: Select[] = [];
  filterOperatorList: Select[] = [];
  private filterConditions: Select[] = [];
  private sortConditions: Select[] = [];

  channelList: Select[] = [];
  reportFrequencyList: Select[] = [];
  generatedAtList: Select[] = [];
  activationDayList: Select[] = [];
  reportFormatList: Select[] = [];
  downloadFormatList: Select[] = [];

  constructor(
    private httpService: HttpService,
    private toasterService: ToasterService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getParams();
    /* Call below Methods based on URL start */
    // this.onProductChange({ id: 'setup', displayName: 'Setup', enrichments: { productId: '1' } });
    // this.onCategoryChange({ id: 'Generic', displayName: 'Generic' });
    /* Call below Methods based on URL end */
    this.getFilterOperatorList();
    this.getScheduleReportDropdowns();
  }

  ngOnInit(): void {}

  getParams(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.httpService.httpPost(REPORT_URL_CONSTANT.PRODUCT_LIST).subscribe((response) => {
        let selectedProduct = response.dataList.find((res) => res.id === params['product']);
        this.onProductChange(selectedProduct);
      });
    });
  }

  getFilterOperatorList(): void {
    this.httpService.httpPost(REPORT_URL_CONSTANT.FILTER_OPERATOR_LIST).subscribe((res) => {
      this.filterOperatorList = res.dataList;
    });
  }

  getScheduleReportDropdowns(): void {
    this.httpService.httpPost(REPORT_URL_CONSTANT.SCHEDULE_REPORT_DROPDOWNS).subscribe((res) => {
      this.channelList = res.channelList;
      this.reportFrequencyList = res.reportFrequencyList;
      this.generatedAtList = res.generatedAtList;
      this.activationDayList = res.activationDayList;
      this.reportFormatList = res.reportFormatList;
      this.downloadFormatList = res.downloadFormatList;
    });
  }

  toggleMainCard(card: 'isSearchExpand' | 'isReportExpand', isExpand: boolean): void {
    this.screenConfig.isSearchExpand = false;
    this.screenConfig.isReportExpand = false;
    this.screenConfig[card] = isExpand;
  }

  onProductChange(product: Select): void {
    this.formData.product = product.id;
    this.formData.productId = product.enrichments?.productId;
    this.formData.productName = product.displayName;
    this.resetCategory();
    this.getCategoryList();
  }

  getCategoryList(): void {
    const reqData = { dataMap: { productId: this.formData.productId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.CATEGORY_LIST, reqData).subscribe((response) => {
      this.categoryList = response.dataList;
      let categoryId = this.activatedRoute.params['value'].category;
      let convertedCategoryId = categoryId[0].toUpperCase() + categoryId.slice(1);
      let selectedCategory = this.categoryList.find((res) => res.id === convertedCategoryId);
      this.onCategoryChange(selectedCategory);
    });
  }

  onCategoryChange(category: Select): void {
    this.formData.categoryId = category.id;
    this.formData.categoryName = category.displayName;
    this.resetSubCategory();
    if (this.formData.categoryId == 'Generic') {
      this.getSubCategoryList();
      this.screenConfig.isScheduleApplicable = false;
    } else {
      this.getReportList();
      this.screenConfig.isScheduleApplicable = true;
    }
  }

  resetCategory(): void {
    this.formData.categoryId = '';
    this.formData.categoryName = '';
    this.resetSubCategory();
  }

  getSubCategoryList(): void {
    const reqData = {
      dataMap: { productId: this.formData.productId, categoryId: this.formData.categoryId },
    };
    this.httpService.httpPost(REPORT_URL_CONSTANT.SUB_CATEGORY_LIST, reqData).subscribe((res) => {
      this.subCategoryList = res.dataList;
    });
  }

  onSubCategoryChange(subCategory: Select): void {
    this.formData.subCategoryId = subCategory.id;
    this.formData.subCategoryName = subCategory.displayName;
    this.getReportList();
  }

  resetSubCategory(): void {
    this.formData.subCategoryId = '';
    this.formData.subCategoryName = '';
    this.resetReportList();
  }

  getReportList(): void {
    const reqData = {
      dataMap: {
        productId: +this.formData.productId,
        categoryId: this.formData.categoryId,
        subCategoryId: this.formData.subCategoryId,
      },
    };
    this.httpService.httpPost(REPORT_URL_CONSTANT.REPORT_LIST, reqData).subscribe((res) => {
      this.toggleMainCard('isSearchExpand', false);
      this.toggleMainCard('isReportExpand', true);
      this.reportList = res.dataList;
    });
  }

  resetReportList(): void {
    this.reportList = [];
    this.resetReportFieldData();
  }

  onReportClick(report: Select): void {
    this.resetReportFieldData();
    this.formData.reportId = report.id;
    this.formData.reportName = report.displayName;
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.REPORT_FIELD_LIST, reqData).subscribe((res) => {
      this.generateReportFields(res.dataList);
      this.toggleMainCard('isReportExpand', true);
      this.screenConfig.isFilterExpand = false;
      this.screenConfig.isSortExpand = false;
    });
  }

  generateReportFields(dataList: any): void {
    this.formData.reportFields = [..._.sortBy(dataList, ['fieldSequence'])];
    this.formData.reportFields.forEach((reportField: ReportField) => {
      if (reportField.defaultValue) {
        reportField.value = _.cloneDeep(reportField.defaultValue);
      } else {
        reportField.value = '';
      }
      if (!reportField.dataUrl && reportField.fieldValueList) {
        reportField.selectData = this.getSelectOptions(reportField.fieldValueList);
      }
    });

    if (this.formData.categoryId == 'Master' || this.formData.categoryId == 'Audit') {
      this.getFilterConditions();
      this.getSortConditions();
    } else {
      this.filterConditions = this.sortConditions = [];
    }
  }

  resetReportFieldData(): void {
    this.formData.reportFields = [];
    this.formData.delimiterType = '';
    this.formData.fromDate = '';
    this.formData.toDate = '';
    this.formData.reportFileType = '';
    this.formData.filterConditionList = [];
    this.formData.sortConditionList = [];
  }

  getFilterConditions(): void {
    this.filterConditions = [];
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.FILTER_CONDITIONS, reqData).subscribe((res) => {
      this.filterConditions = res.dataList;
      this.formData.filterConditionList.push(new FilterCondition());
      this.formData.filterConditionList[0].filterList = _.cloneDeep(this.filterConditions);
    });
  }

  getSortConditions(): void {
    this.sortConditions = [];
    const reqData = { dataMap: { reportId: this.formData.reportId } };
    this.httpService.httpPost(REPORT_URL_CONSTANT.SORT_CONDITIONS, reqData).subscribe((res) => {
      this.sortConditions = res.dataList;
      this.formData.sortConditionList.push(new SortCondition());
      this.formData.sortConditionList[0].sortList = _.cloneDeep(this.sortConditions);
    });
  }

  getSelectOptions(fieldValueList: string): Select[] {
    if (!fieldValueList) return [];
    let options: Select[] = [];
    let optionsStrList = fieldValueList.split(',');
    optionsStrList.forEach((optionStr: string) => {
      let option = optionStr.split(':');
      options.push({ id: option[0], displayName: option[1] });
    });
    return options;
  }

  showSearchModal(field: ReportField): void {
    /* add your search logic here */
  }

  onAddMoreFilter(): void {
    this.formData.filterConditionList.push(new FilterCondition());
    this.formData.filterConditionList[this.formData.filterConditionList.length - 1].filterList =
      _.cloneDeep(this.filterConditions);
  }

  onDeleteFilter(index: number): void {
    if (index == 0) {
      this.formData.filterConditionList[0] = new FilterCondition();
      this.formData.filterConditionList[0].filterList = _.cloneDeep(this.filterConditions);
    } else {
      this.formData.filterConditionList.splice(index, 1);
    }
  }

  isLastFilterInvalid(): boolean {
    const lastFilter: FilterCondition =
      this.formData.filterConditionList[this.formData.filterConditionList.length - 1];
    return !lastFilter.filterId || !lastFilter.operatorId || !lastFilter.filterValue;
  }

  onAddMoreSortCondition(): void {
    this.formData.sortConditionList.push(new SortCondition());
    this.formData.sortConditionList[this.formData.sortConditionList.length - 1].sortList =
      _.cloneDeep(this.sortConditions);
  }

  onDeleteSortCondition(index: number): void {
    if (index == 0) {
      this.formData.sortConditionList[0] = new SortCondition();
      this.formData.sortConditionList[0].sortList = _.cloneDeep(this.sortConditions);
    } else {
      this.formData.sortConditionList.splice(index, 1);
    }
  }

  isLastSortConditionInvalid(): boolean {
    return (
      this.formData.sortConditionList.length == 0 ||
      !this.formData.sortConditionList[this.formData.sortConditionList.length - 1].sortConditionId
    );
  }

  onIsScheduleReportChanged(isScheduleReport: any): void {
    this.formData.scheduleReportList = [];
    this.toggleMainCard('isReportExpand', !isScheduleReport.checked);
    if (isScheduleReport.checked) {
      this.formData.scheduleReportList.push(new ScheduleReport());
    }
  }

  onSubmitClick(): void {
    let reqData = _.cloneDeep(this.formData);
    /* Removing unwanted Filters */
    if (!reqData.filterConditionList[reqData.filterConditionList.length - 1].filterValue) {
      reqData.filterConditionList.splice(reqData.filterConditionList.length - 1, 1);
    }
    /* Removing unwanted Sort Conditions */
    if (!reqData.sortConditionList[reqData.sortConditionList.length - 1].sortConditionId) {
      reqData.sortConditionList.splice(reqData.sortConditionList.length - 1, 1);
    }
    /* Removing unwanted Report Fields data */
    reqData.reportFields.forEach((field: ReportField) => {
      delete field.selectData;
    });
    /* Removing unwanted Filters Fields */
    reqData.filterConditionList.forEach((filter: FilterCondition) => {
      delete filter.filterList;
    });
    /* Removing unwanted Sort Condition Fields */
    reqData.sortConditionList.forEach((sortCondition: SortCondition) => {
      delete sortCondition.sortList;
    });
    /* Removing unwanted ScheduleReport Fields */
    if (reqData.scheduleReportList.length > 0) {
      reqData.scheduleReportList[0].channel = reqData.scheduleReportList[0].channelList
        ? reqData.scheduleReportList[0].channelList.join(',')
        : '';
      reqData.scheduleReportList[0].emailIdType = reqData.scheduleReportList[0].emailIdTypeList
        ? reqData.scheduleReportList[0].emailIdTypeList.join(',')
        : '';
      delete reqData.scheduleReportList[0].channelList;
      delete reqData.scheduleReportList[0].emailIdTypeList;
    }

    /* Submit Data to Server */
    //this.httpService.httpPost(REPORT_URL_CONSTANT.CREATE, reqData).subscribe(res => {
    this.toasterService.showToaster({
      severity: 'success',
      detail: 'Report generated sucessfully.',
    });
    this.navigateToListing();
    //});
  }

  navigateToListing(): void {
    //Use same url just replace last
  }

  navigateToDashboard(): void {
    //User user service to get default dashboard url then navigate
    this.isCancelClick.emit(true);
  }
}
