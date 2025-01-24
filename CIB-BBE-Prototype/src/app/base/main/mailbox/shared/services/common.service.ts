import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ApiPathConstant } from '../services/api_path';

@Injectable()
export class CommonService {
  isMenuOpen = new Subject<any>();
  isShowToaster = new Subject<any>();
  isShowConfirmDialog = new Subject<any>();
  isListingCall = new Subject<any>();
  isViewCall: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  viewMailCall = new Subject<any>();
  listingType = new Subject<string>();
  isListingRequest = { pageNumber: 1, entityName: '', filters: [] };
  jwtToken: string = '';
  requestBy: string = '';
  constructor(private httpService: HttpService) {}

  /* Side Nav Service */
  getSideNav() {
    return this.httpService.httpPost(ApiPathConstant.GET_SIDE_NAV, {});
  }

  /* Listing Service */
  getMailListing(listObj: any) {
    var data = JSON.parse(JSON.stringify(this.isListingRequest));
    data.entityName = 'EMAIL';
    let listigPathUrl = `GET_${listObj.entityName.toUpperCase()}_LISTING`;
    return this.httpService.httpPost(ApiPathConstant[listigPathUrl], data);
  }

  /* Compose Mail Service */
  createComposeMail(maildata: any) {
    return this.httpService.httpPost(ApiPathConstant.SEND_MAIL, maildata);
  }

  /* Get Category*/
  getCategory() {
    return this.httpService.httpPost(ApiPathConstant.GET_CATEGORY);
  }

  /* Get Subcategory*/
  getSubCategory(id: string) {
    let data = {
      filters: [{ name: 'categoryId', value: id, type: 'String' }],
    };
    return this.httpService.httpPost(ApiPathConstant.GET_SUB_CATEGORY, data);
  }

  getMailCorporate() {
    return this.httpService.httpPost(ApiPathConstant.GET_MAIL_CORPORATE, {});
  }

  getMailBank() {
    return this.httpService.httpPost(ApiPathConstant.GET_MAIL_BANK);
  }

  draftMail(maildata: any) {
    return this.httpService.httpPost(ApiPathConstant.DRAFT_MAIL, maildata);
  }

  /* View Mail */
  getViewMail(id: string) {
    let data = { dataMap: { id: id } };
    return this.httpService.httpPost(ApiPathConstant.GET_MAIL_VIEW, data);
  }

  getMailDetails(id: string) {
    let data = { dataMap: { id: id } };
    return this.httpService.httpPost(ApiPathConstant.GET_MAIL_DETAILS, data);
  }

  setMarkAsRead(selectedIds: any) {
    let data = { dataMap: { ids: selectedIds } };
    return this.httpService.httpPost(ApiPathConstant.MARK_AS_READ, data);
  }

  setMarkAsUnread(selectedIds: any) {
    let data = { dataMap: { ids: selectedIds } };
    return this.httpService.httpPost(ApiPathConstant.MARK_AS_UNREAD, data);
  }

  setMarkAsStared(selectedIds: any) {
    let data = { dataMap: { ids: selectedIds } };
    return this.httpService.httpPost(ApiPathConstant.MARK_AS_STARED, data);
  }

  setMarkAsUnStared(selectedIds: any) {
    let data = { dataMap: { ids: selectedIds } };
    return this.httpService.httpPost(ApiPathConstant.MARK_AS_UNSTARED, data);
  }

  setMarkDelete(selectedIds: any) {
    let data = {
      dataMap: {
        ids: selectedIds,
        deleteFromSentItem: this.isListingRequest.entityName == 'sent' ? 'Yes' : true,
      },
    };
    return this.httpService.httpPost(ApiPathConstant.MARK_AS_DELETE, data);
  }

  /* Toaster */
  errorToaster(details: string) {
    var toasterObj = {
      severity: 'error',
      summary: 'Error',
      detail: details,
    };
    this.isShowToaster.next(toasterObj);
  }

  successToaster(details: string) {
    var toasterObj = {
      severity: 'success',
      summary: 'Success',
      detail: details,
    };
    this.isShowToaster.next(toasterObj);
  }
}
