import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-auth-rule-dropdown-renderer',
  templateUrl: './auth-rule-dropdown-renderer.component.html',
  styleUrls: ['./auth-rule-dropdown-renderer.component.scss'],
})
export class AuthRuleDropdownRendererComponent implements OnInit {
  cellValue!: any;
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: any;
  @Input('context') context?: any;

  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.cellValue = this.data[this.field];

      this.params = {
        data: this.data,
        context: this.context,
      };
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.data = params.node.data;
    this.cellValue = params.value ? params.value.toString() : '';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
