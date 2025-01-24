import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-column-configuration',
  templateUrl: './column-configuration.component.html',
  styleUrls: ['./column-configuration.component.scss'],
})
export class ColumnConfigurationComponent implements OnInit {
  @Input('columnDefs') columnDefs: any[];
  @Output() applyColDefs = new EventEmitter<any[]>();

  constructor() {}

  ngOnInit(): void {}

  clickOnCheckBox(checked: boolean, i: number) {
    this.columnDefs[i].showOnGrid = checked;
  }

  onApplyColDefs() {
    this.applyColDefs.emit(this.columnDefs);
  }
}
