import { Component, Input, OnInit } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import { DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG } from 'src/app/shared/@config/dynamic-form-gridster.config';

@Component({
  selector: 'app-dynamic-form-grid',
  templateUrl: './dynamic-form-grid.component.html',
  styleUrls: ['./dynamic-form-grid.component.scss'],
})
export class DynamicFormGridComponent implements OnInit {
  @Input('parentRef') parentRef: any;

  options: GridsterConfig = { ...DEFAULT_FORM_BUILDER_GRIDSTER_CONFIG };

  constructor() {
    this.options.minRows = 12;
    this.options.maxItemRows = 20;
    this.refreshGrid();
  }

  ngOnInit(): void {}

  refreshGrid(): void {
    if (this.options?.api?.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
}
