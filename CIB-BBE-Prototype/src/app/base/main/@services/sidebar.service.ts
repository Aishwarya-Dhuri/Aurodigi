import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ConfigComponent } from '../right-sidebar/config/config.component';

import { CountryComponent } from '../right-sidebar/country/country.component';
import { LanguageComponent } from '../right-sidebar/language/language.component';
import { MailsComponent } from '../right-sidebar/mails/mails.component';
import { NotificationsComponent } from '../right-sidebar/notifications/notifications.component';
import { QuickLinksComponent } from '../right-sidebar/quick-links/quick-links.component';
import { SidebarComponents } from '../right-sidebar/@enums/sidebar-components';
import { UserTasksComponent } from '../right-sidebar/user-tasks/user-tasks.component';
import { WidgetsComponent } from '../right-sidebar/widgets/widgets.component';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _component = new BehaviorSubject<any>(null);

  constructor() {}

  setComponent(component: string) {
    const comp: any = this.component(component);
    this._component.next(comp);
  }

  getComponent() {
    return this._component;
  }

  component(component: string) {
    let _comp: any;
    switch (component) {
      case SidebarComponents.country:
        _comp = CountryComponent;
        break;
      case SidebarComponents.language:
        _comp = LanguageComponent;
        break;
      case SidebarComponents.mails:
        _comp = MailsComponent;
        break;
      case SidebarComponents.notifications:
        _comp = NotificationsComponent;
        break;
      case SidebarComponents.quickLinks:
        _comp = QuickLinksComponent;
        break;
      case SidebarComponents.userTasks:
        _comp = UserTasksComponent;
        break;
      case SidebarComponents.widgets:
        _comp = WidgetsComponent;
        break;
      case SidebarComponents.config:
        _comp = ConfigComponent;
        break;
    }

    return _comp;
  }
}
