import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-download-report-renderer',
  templateUrl: './download-report-renderer.component.html',
  styleUrls: ['./download-report-renderer.component.scss'],
})
export class DownloadReportRendererComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  onDownloadClick() {
    this.params.context.componentParent.onDownloadClick(this.params.data);
  }
}
