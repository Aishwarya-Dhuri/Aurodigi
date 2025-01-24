import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-attachment-renderer',
  templateUrl: './attachment-renderer.component.html',
  styleUrls: ['./attachment-renderer.component.scss'],
})
export class AttachmentRendererComponent implements OnInit, AgRendererComponent {
  cellValue!: any;
  currencyName: string;
  node: any;
  parentContext: any;

  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.parentContext = this.params.context.componentParent;
      this.cellValue = this.params.data[this.field];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.parentContext = params.context.componentParent;
    this.node = params.node;
    this.cellValue = params.value;
  }

  invokeParentMethod(event: any) {
    event.stopPropagation();
    this.parentContext.downloadAttachments(this.params.data.id);
  }

  openMail() {
    this.parentContext.openMail(this.params.data.id);
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
