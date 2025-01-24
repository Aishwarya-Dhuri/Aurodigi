import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepperService {
  private percentageCompletedAngle: BehaviorSubject<number> = new BehaviorSubject(270);

  setPercentageCompletedAngle(percentageCompletedAngle: number) {
    this.percentageCompletedAngle.next(percentageCompletedAngle);
  }

  getPercentageCompletedAngle() {
    return this.percentageCompletedAngle;
  }
}
