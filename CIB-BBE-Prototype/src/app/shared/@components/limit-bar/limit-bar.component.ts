import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-limit-bar',
  templateUrl: './limit-bar.component.html',
  styleUrls: ['./limit-bar.component.scss'],
})
export class LimitBarComponent implements OnInit, OnChanges {
  @Input('utilized') utilized: number = 0;
  @Input('available') available: number = 100;
  @Input('showLegend') showLegend: boolean = true;

  utilizedInPercent: number = 0;
  availableInPercent: number = 100;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateLimits();
  }

  ngOnInit(): void {}

  calculateLimits() {
    const totalLimit = +this.utilized + +this.available;

    this.utilizedInPercent = (+this.utilized * 100) / (totalLimit == 0 ? 1 : totalLimit);
    this.availableInPercent = 100 - this.utilizedInPercent;
  }
}
