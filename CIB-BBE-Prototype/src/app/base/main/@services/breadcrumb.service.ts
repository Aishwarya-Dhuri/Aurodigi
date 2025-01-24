import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../@models/breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<Breadcrumb[]>([
    {
      icon: 'fa-home',
      // label: 'Home',
    },
    {
      label: 'Dashboard',
    },
  ]);

  setBreadCrumb(breadCrumbs: Breadcrumb[]) {
    this.breadcrumbs.next(breadCrumbs);
  }

  getBreadcrumb() {
    return this.breadcrumbs;
  }
}
