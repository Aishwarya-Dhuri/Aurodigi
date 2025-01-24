import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-action-renderer',
  templateUrl: './action-renderer.component.html',
  styleUrls: ['./action-renderer.component.scss']
})
export class ActionRendererComponent implements OnInit {
  index: number;

  params: ICellRendererParams;

  constructor() { }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.index = params.rowIndex;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
