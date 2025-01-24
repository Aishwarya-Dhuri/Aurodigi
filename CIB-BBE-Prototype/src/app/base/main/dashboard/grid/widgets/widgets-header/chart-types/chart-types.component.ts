import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chart-types',
  templateUrl: './chart-types.component.html',
  styleUrls: ['./chart-types.component.scss'],
})
export class ChartTypesComponent implements OnInit {
  @Output() changeChartType = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
