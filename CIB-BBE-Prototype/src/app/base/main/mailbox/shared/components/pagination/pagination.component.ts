import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-mailbox-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() totalPages: any;
  @Input() pageNumber: any;
  selectedPageNumber: any = 50;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  next() {
    this.commonService.isListingRequest.pageNumber = this.pageNumber + 1;
    this.commonService.isListingCall.next(true);
  }

  prev() {
    this.commonService.isListingRequest.pageNumber = this.pageNumber - 1;
    this.commonService.isListingCall.next(true);
  }

  refresh() {
    this.commonService.isListingRequest.pageNumber = 1;
    this.commonService.isListingCall.next(true);
  }

  firstNext() {
    this.commonService.isListingRequest.pageNumber = 1;
    this.commonService.isListingCall.next(true);
  }

  lastNext() {
    this.commonService.isListingRequest.pageNumber = this.totalPages;
    this.commonService.isListingCall.next(true);
  }

  getPageNumber() {
    this.commonService.isListingRequest.pageNumber = this.selectedPageNumber;
    this.commonService.isListingCall.next(true);
  }

  isFirstPage(): boolean {
    return this.pageNumber == 1 ? true : false;
  }

  isLastPage(): boolean {
    return this.pageNumber == this.totalPages ? true : false;
  }
}
