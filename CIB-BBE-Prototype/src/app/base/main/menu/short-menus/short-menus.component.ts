import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Widget } from '../../@models/widget-details';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { DashboardService } from '../../@services/dashboard.service';

@Component({
  selector: 'app-short-menus',
  templateUrl: './short-menus.component.html',
  styleUrls: ['./short-menus.component.scss'],
})
export class ShortMenusComponent implements OnInit {
  @Input('menus') menus?: Widget[];
  menuType: string;

  constructor(
    private dashboardService: DashboardService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private route: ActivatedRoute,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
    });
  }

  onMenuClick(menu: any) {
    const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard' }, { label: menu.displayName }];

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.dashboardService.setDashboardType(menu.displayName.toLowerCase());
    this.router.navigate(['dashboard/' + menu.displayName.toLowerCase()], {
      relativeTo: this.route,
    });

    if (this.menuType == 'overlay') {
      this.appSettingService.setPinnedMenu(false);
    }
  }
}
