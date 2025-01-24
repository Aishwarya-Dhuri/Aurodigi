import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/@services/user.service';
import { Actions } from '../../@models/actions';
import { Breadcrumb } from '../@models/breadcrumb.model';
import { ActionService } from '../@services/action.service';
import { BreadcrumbService } from '../@services/breadcrumb.service';
import { WidgetService } from '../@services/widget.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  fullScreenWidget: boolean;
  constructor(
    private widgetService: WidgetService,
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Consolidated',
      subHeading: null,
      widgetsActions: true,
      refresh: true,
      widgets: true,
      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };

    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard' }, { label: 'Consolidated' }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.widgetService.getIsFullScreen().subscribe((isFullscreen: boolean) => {
      this.fullScreenWidget = isFullscreen;
    });
  }

  ngOnDestroy(): void {
    this.widgetService.setDashboard([]);
  }
}
