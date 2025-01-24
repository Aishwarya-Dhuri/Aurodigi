import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'aps-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input('parentRef') parentRef: any;
  @Input() stepperType: 'HORIZONTAL' | 'VERTICAL' | 'ACCORDIAN' | 'OPEN_ACCORDIAN' | 'TABS';

  constructor() {}

  ngOnInit(): void {
    this.stepperType = this.parentRef?.stepperDetails?.stepperType
      ? this.parentRef?.stepperDetails?.stepperType
      : 'HORIZONTAL';
  }
}
