import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Actions } from '../../@models/actions';
import { ActionService } from '../../main/@services/action.service';
import { BreadcrumbService } from '../../main/@services/breadcrumb.service';
import {
  TransactionEnquiry,
  TransactionEnquiryExtraData,
} from './@models/transaction-enquiry.model';
import { TransactionEnquiryService } from './@services/transaction-enquiry.service';

@Component({
  selector: 'app-transaction-enquiry',
  templateUrl: './transaction-enquiry.component.html',
  styleUrls: ['./transaction-enquiry.component.scss'],
})
export class TransactionEnquiryComponent implements OnInit {
  formData: TransactionEnquiry = new TransactionEnquiry();
  extraData: TransactionEnquiryExtraData = new TransactionEnquiryExtraData();

  @ViewChild('dynamicSearch') dynamicSearch: any;

  context = {
    componentParent: this,
  };

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private router: Router,
    private httpService: HttpService,
    private transactionEnquiryService: TransactionEnquiryService,
  ) {
    if (this.transactionEnquiryService.getActionName() == 'onBack') {
      this.formData = this.transactionEnquiryService.getTransactionEnquiryData();
      this.extraData = this.transactionEnquiryService.getTransactionEnquiryExtraData();
      this.transactionEnquiryService.clearAll();
    } else {
      this.getProductList();
    }
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Transaction Enquiry - Enquiry',
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

    if (this.transactionEnquiryService.getActionName() == 'onBack') {
      this.formData = this.transactionEnquiryService.getTransactionEnquiryData();
    }
  }

  getProductList(): void {
    this.httpService
      .httpPost('commons/commonService/private/getProductList')
      .subscribe((response: any) => {
        this.extraData.productList = response.dataList;

        const urlProduct = this.router.url.split('/')[1];
        if (urlProduct !== 'common') {
          this.formData.productId = urlProduct;
          this.onProductChange();
          this.extraData.isHideProduct = true;
        }
      });
  }

  onProductChange(): void {
    if (!this.formData.productId) return;
    this.formData.product = this.extraData.productList.find(
      (p: any) => p.id === this.formData.productId,
    );
    this.formData.productName = this.formData.product.displayName;

    this.extraData.breadcrumbs[1].label = this.formData.productName;
    this.breadcrumbService.setBreadCrumb(this.extraData.breadcrumbs);

    this.formData.subProduct = null;
    this.formData.subProductId = null;
    this.formData.subProductName = null;
    this.formData.isLoadGenericFilters = false;
    this.extraData.criteriaList = [];
    this.getSubProducts();
  }

  getSubProducts(): void {
    this.extraData.subProductList = [];
    this.httpService
      .httpPost(this.formData.productId + '/process/transactionEnquiry/private/dropdown/subProduct')
      .subscribe((response: any) => {
        this.extraData.subProductList = response.dataList;

        this.formData.selectedFilters = [];
        if (this.extraData.subProductList && this.extraData.subProductList.length > 0) {
          this.formData.subProductId = this.extraData.subProductList[0].id;
          this.onSubProductChange();
        }
        if (
          this.extraData.subProductList &&
          this.extraData.subProductList.length > 0 &&
          this.extraData.subProductList.length == 1
        ) {
          this.extraData.isHideSubProduct = true;
        }
      });
  }

  onSubProductChange(): void {
    this.formData.isLoadGenericFilters = false;
    if (!this.formData.subProductId) return;
    this.formData.subProduct = this.extraData.subProductList.find(
      (p: any) => p.id === this.formData.subProductId,
    );
    this.formData.subProductName = this.formData.subProduct.displayName;
    this.formData.genericFilterEntityName =
      this.formData.subProduct.enrichments.genericFilterEntityName;
    this.formData.searchColDefUrl = this.formData.subProduct.enrichments.searchColDefUrl;
    this.formData.searchRowDefUrl = this.formData.subProduct.enrichments.searchRowDefUrl;
    this.formData.productRouteUrl = this.formData.subProduct.enrichments.productRouteUrl;
    this.generateFilters();
    this.getCriteriaList();
  }

  generateFilters(): void {
    setTimeout(() => {
      this.formData.isLoadGenericFilters = true;
    }, 10);
  }

  onDynamicFiltersReady(): void {
    this.formData.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }

  getCriteriaList(): void {
    this.extraData.criteriaList = [];
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = {
      dataMap: { entityName: this.formData.genericFilterEntityName, criteriaType: 'QUERYSEARCH' },
    };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.extraData.criteriaList = response.dataMap.SearchCriteria;
    });
  }

  getCriteriaFilterCount(criteria: Criteria): number {
    return JSON.parse(criteria.criteria).length;
  }

  applyCriteria(criteria: Criteria): void {
    this.dynamicSearch.saveCriteria.setCriteriaData(criteria);
    this.dynamicSearch.onFillCriteria(criteria);
  }

  deleteCriteria(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    //const data = { "id": criteria.id, "type": "SearchCriteria", "version": criteria.version };
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  getRecords(filters: Filter[]): void {
    this.formData.selectedFilters = filters;
    this.formData.currentScreen = 'LISTING';
  }

  view(id?: string) {
    this.transactionEnquiryService.setActionName('onView');
    this.transactionEnquiryService.setId(id);
    this.transactionEnquiryService.setTransactionEnquiryData(this.formData);
    this.transactionEnquiryService.setTransactionEnquiryExtraData(this.extraData);
    this.router.navigateByUrl(this.formData.productRouteUrl);
  }

  onLink(id?: string) {
    this.transactionEnquiryService.setActionName('onView');
    this.transactionEnquiryService.setId(id);
    this.transactionEnquiryService.setTransactionEnquiryData(this.formData);
    this.transactionEnquiryService.setTransactionEnquiryExtraData(this.extraData);
    this.router.navigateByUrl(this.formData.productRouteUrl);
  }
}
