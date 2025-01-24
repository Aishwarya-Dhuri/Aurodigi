import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();

  @Input() header!: string;
  @Input() colDefUrl: string;
  @Input() rowDefUrl: string;
  @Input() rowDefReq?: any;
  @Input() selectBtnCaption!: string;
  @Input() isMultiSelect!: boolean;
  @Input() preSelectedIds!: string[];

  @Output() onSelection = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('searchModal') searchModalGrid: any;

  gridOptions: any;
  selectedRecord: any = [];

  constructor() {}

  ngOnInit(): void {
    this.selectBtnCaption = this.selectBtnCaption ? this.selectBtnCaption : 'SELECT';
    this.gridOptions = {
      suppressRowClickSelection: true,
      rowSelection: this.isMultiSelect ? 'multiple' : 'single',
    };
  }

  gridReady() {
    this.selectedRecord = [];
  }

  onFirstDataRendered() {
    if (this.preSelectedIds) {
      setTimeout(() => {
        this.searchModalGrid.selectRowsByIds(this.preSelectedIds);
      }, 350);
    }
  }

  onRowSelected(e: any) {
    this.selectedRecord = this.searchModalGrid.getSelectedRows();
  }

  onClose() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.close.emit();
  }

  onRecordSelection() {
    this.onSelection.emit(this.isMultiSelect ? this.selectedRecord : this.selectedRecord[0]);
    this.onClose();
  }
}
