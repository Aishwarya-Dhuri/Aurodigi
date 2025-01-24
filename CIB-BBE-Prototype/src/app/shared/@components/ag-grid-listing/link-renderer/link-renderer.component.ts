import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-link-renderer',
  templateUrl: './link-renderer.component.html',
  styleUrls: ['./link-renderer.component.scss'],
})
export class LinkRendererComponent implements OnInit {
  cellValue!: any;

  constructor() {}

  ngOnInit(): void {}

  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod(link: any) {
    this.params.context.linkComponent.onLinkClick(link);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
