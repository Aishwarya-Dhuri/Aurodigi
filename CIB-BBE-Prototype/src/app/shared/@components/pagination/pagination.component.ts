import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() dataList: any[];
  @Input() numberOfRecords: any;
  @Input() pageSizes: number[] = [5, 10, 20];
  @Input() parentRef: any;
  @Input() type: 'NORMAL' | 'CARD' = 'NORMAL';
  @Input() position: 'LEFT' | 'RIGHT' | 'CENTER' = 'RIGHT';
  @Output() changePageSize = new EventEmitter<number>();
  @Output() goToPageNumber = new EventEmitter<number>();
  @Output() goToFirstPage = new EventEmitter<number>();
  @Output() goToLastPage = new EventEmitter<number>();
  @Output() isShowChange = new EventEmitter<number>();
  @Output() goToPrevious = new EventEmitter<number>();
  @Output() goToNext = new EventEmitter<number>();
  @Output() doPagination = new EventEmitter<number>();

  pages: { pageNo: number }[];
  maxPages: number = 5;
  startPage: number;
  endPage: number;

  constructor() {}

  @Input() _pageSize = 10;

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pgSize) {
    this._pageSize = pgSize;
    // this.onPagination();
  }

  @Input() _currentPage = 0;

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(no) {
    this._currentPage = no;
    this.onPageChange();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setPages();
  }

  setPages() {
    let pages = [];
    const noOfPages = Math.ceil(this.numberOfRecords / this.pageSize);
    for (let i = 0; i < noOfPages; i++) {
      pages.push({ pageNo: i + 1 });
    }
    this.pages = pages;
  }

  changePageListSize(e: any) {
    // if(Number(e.target.value) == this.pageSize){
    //   return
    // }
    this.pageSize = Number(e.target.value);
    this.changePageSize.emit(this.pageSize);
    // this.dataList.splice(this.dataList.length - 3, 3);
    // this.gridApi.paginationSetPageSize(this.pageSize);
    this.setPages();
    this.onPageChange();
  }

  jumpToPageNumber(pageNumber: number) {
    this.goToPageNumber.emit(pageNumber);
    this.currentPage = pageNumber;
  }

  jumpToFirstPage() {
    this.goToFirstPage.emit();
    this.currentPage = 0;
  }

  jumpToLastPage() {
    this.goToLastPage.emit();
    this.currentPage = this.pages.length - 1;
  }

  previousPage() {
    if (this.currentPage !== 0) {
      this.currentPage -= 1;
      this.goToPrevious.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage !== this.pages.length - 1) {
      this.currentPage += 1;
      this.goToNext.emit(this.currentPage);
    }
  }

  onPageChange() {
    // this.checkForMaxPages(this.maxPages);
    let data: any = {};
    data.startRow = this.currentPage * this.pageSize;
    data.endRow = data.startRow + this.pageSize - 1;
    this.doPagination.emit(data);
  }

  private checkForMaxPages(maxPages) {
    const totalPages = Math.ceil(this.numberOfRecords / this.pageSize);
    const currentPage = this.currentPage + 1;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      this.startPage = 1;
      this.endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      var maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      var maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        this.startPage = 1;
        this.endPage = maxPages;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        this.startPage = totalPages - maxPages + 1;
        this.endPage = totalPages;
      } else {
        // current page somewhere in the middle
        this.startPage = currentPage - maxPagesBeforeCurrentPage;
        this.endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
  }
}
