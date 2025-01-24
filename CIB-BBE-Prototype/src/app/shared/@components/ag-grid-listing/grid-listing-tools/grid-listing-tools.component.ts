import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewportService } from 'src/app/shared/@services/viewport.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grid-listing-tools',
  templateUrl: './grid-listing-tools.component.html',
  styleUrls: ['./grid-listing-tools.component.scss'],
})
export class GridListingToolsComponent implements OnInit {
  @Input('label') label?: string = '';
  @Input('filePath') filePath?: string = '';
  @Input('colDefs') colDefs: any[];
  @Input('showSearch') showSearch = true;
  @Input('showRefresh') showRefresh = false;
  @Input('columnConfig') columnConfig = false;
  @Input('moreOptions') moreOptions = false;
  @Input('showPrint') showPrint = false;
  @Input('showMail') showMail = true;
  @Input('showFloatingFilter') showFloatingFilter = true;
  @Input('showDownload') showDownload = true;
  @Input('listingTypes') listingTypes = false;

  @Input('listingType') listingType: string = 'grid';

  @Output() changeFloatingFilter = new EventEmitter<boolean>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() filterRecords = new EventEmitter<string>();
  @Output() updateColDefs = new EventEmitter<any>();
  @Output() applyColDefs = new EventEmitter<any[]>();
  @Output() changeListingType = new EventEmitter<string>();

  floatingFilter = false;
  filterValue: string;
  viewport: string;
  showMoreOptions = false;
  downloadOptions = false;
  columnConfiguration = false;

  constructor(private viewportService: ViewportService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      this.viewport = viewport;
    });
  }

  onChangeFloatFilter(floatingFilter: boolean) {
    this.floatingFilter = floatingFilter;
    this.changeFloatingFilter.emit(floatingFilter);
  }

  downloadFile() {
    if (this.filePath) {
      const filePath = this.httpService.getAssetUrl(this.filePath);
      window.open(filePath, '_blank');
    }
  }

  onFilterRecords() {
    this.filterRecords.emit(this.filterValue);
  }

  onListTypeChange(type: string) {
    this.listingType = type;
    this.changeListingType.emit(type);
  }
}
