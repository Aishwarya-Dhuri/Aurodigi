import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-reject-reason-renderer',
  templateUrl: './reject-reason-renderer.component.html',
  styleUrls: ['./reject-reason-renderer.component.scss']
})
export class RejectReasonRendererComponent implements OnInit {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() { }

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.cellValue = this.params.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  public invokeParentMethod(rejectReason: any) {
    this.params.context.componentParent.onRejectReasonClick(rejectReason);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
