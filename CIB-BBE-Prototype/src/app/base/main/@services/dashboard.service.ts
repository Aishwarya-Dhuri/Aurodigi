import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private lastActivities = new BehaviorSubject<boolean>(false);
  private dashboardType = new BehaviorSubject<string>('consolidated');

  constructor() {}

  setDashboardType(dashboardType: string) {
    this.dashboardType.next(dashboardType);
  }

  getDashboardType() {
    return this.dashboardType;
  }

  setLastActivities(lastActivities: boolean) {
    this.lastActivities.next(lastActivities);
  }

  getlastActivities() {
    return this.lastActivities;
  }
}
