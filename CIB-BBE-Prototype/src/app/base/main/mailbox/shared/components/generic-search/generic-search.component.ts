import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
  styleUrls: ['./generic-search.component.scss'],
})
export class GenericSearchComponent implements OnInit {
  @Input() filtersArray: any;
  searchInput: string = '';
  searchInputLabel: string = '';
  searchType: string = '';
  searchData: string = '';
  containsAttachment: boolean = false;
  isFormSubmit: boolean;
  listingReq: any;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  getListingFilterData(ngForm: NgForm) {
    this.searchInput = this.searchData;
    this.listingReq = this.commonService.isListingRequest;
    this.listingReq.filters = [];
    this.listingReq.filters.push(this.searchInput);
    if (this.containsAttachment) {
      let isAttachment = {
        name: 'containsAttachment',
        type: 'boolean',
        operation: '=',
        value: this.containsAttachment,
      };
      this.listingReq.filters.push(isAttachment);
    }
    this.commonService.isListingRequest = this.listingReq;
    this.commonService.isListingCall.next(true);
    this.isFormSubmit = true;
    ngForm.reset();
  }

  onChangeSearchInput(searchInput: any) {
    console.log(searchInput);
    this.searchData = '';
    this.searchInputLabel = searchInput.displayName;
    this.searchType = searchInput.enrichments.searchType;
  }

  clearFilter(ngForm: NgForm) {
    this.listingReq.filters = [];
    this.commonService.isListingRequest = this.listingReq;
    this.commonService.isListingCall.next(true);
    this.isFormSubmit = false;
    ngForm.reset();
  }
}
