import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { Criteria } from 'src/app/shared/@components/dynamic-search/@models/criteria.model';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { Select } from 'src/app/shared/@models/select.model';

export class TransactionEnquiry {
  product: Select;
  productName: string;
  productId: string;
  subProduct: Select;
  subProductName: string;
  subProductId: string;
  selectedFilters: Filter[];
  genericFilterEntityName: string;
  searchColDefUrl: string;
  searchRowDefUrl: string;
  productRouteUrl: string;
  isLoadGenericFilters: boolean;
  currentScreen: 'FILTERS' | 'LISTING';

  constructor() {
    this.product = null;
    this.productName = null;
    this.productId = null;
    this.subProduct = null;
    this.subProductName = null;
    this.subProductId = null;
    this.selectedFilters = [];
    this.genericFilterEntityName = null;
    this.searchColDefUrl = null;
    this.searchRowDefUrl = null;
    this.productRouteUrl = null;
    this.currentScreen = 'FILTERS';
    this.isLoadGenericFilters = false;
  }
}

export class TransactionEnquiryExtraData {
  productList: Select[];
  subProductList: Select[];
  isHideProduct: boolean;
  isHideSubProduct: boolean;
  criteriaList: Criteria[] = [];
  breadcrumbs: Breadcrumb[] = [
    { icon: 'fa-home' },
    { label: 'Commmon' },
    { label: 'Process' },
    { label: 'Transaction Enquiry' },
  ];
}
