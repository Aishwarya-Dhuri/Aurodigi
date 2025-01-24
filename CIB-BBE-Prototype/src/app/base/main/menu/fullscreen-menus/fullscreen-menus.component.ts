import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { AppSetting } from 'src/app/shared/@models/app-setting';
import { AppSettingService } from 'src/app/shared/@services/app-setting.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Menu } from '../../@models/menus';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';

@Component({
  selector: 'app-fullscreen-menus',
  templateUrl: './fullscreen-menus.component.html',
  styleUrls: ['./fullscreen-menus.component.scss'],
})
export class FullscreenMenusComponent implements OnInit {
  currentMenu: string;
  @Input('parentMenu') parentMenu: string;
  @Input('showHeader') showHeader: boolean;
  @Input('menus') menus?: Menu[];
  filteredMenus: Menu[];

  menuType: string;

  @Output() closeFullScreen = new EventEmitter<void>();

  constructor(
    private router: Router,
    private menuService: MenuService,
    private breadcrumbService: BreadcrumbService,
    private appSettingService: AppSettingService,
    private listingService: ListingService,
    private viewService: ViewService,
  ) {}

  ngOnInit(): void {
    this.appSettingService.getAppSetting().subscribe((appSetting: AppSetting) => {
      this.menuType = appSetting.menuType;
    });
  }

  handleRoute(menu: Menu, url: string, breadcrumb: string) {
    this.menuService.setSelectedMenu(menu);
    this.menuService.setSelectedEntityName(menu.entityName);
    this.menuService.setSelectedServiceUrl(menu.serviceUrl);

    const breadcrumbs: Breadcrumb[] = [{ label: this.parentMenu }];

    breadcrumb.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label,
      });
    });

    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    if (url.indexOf('/listing') != -1 && url.indexOf('#') != -1) {
      const listTypeCode = url.split('#').length > 1 ? url.split('#')[1] : null;
      this.listingService.setSelectedListCode(listTypeCode);
      url = url.substring(0, url.indexOf('#'));
    }

    if (menu.menuCategory == 'Dynamic') {
      this.menuService.setIsDynamicFormBuilderMenu(true);
    } else {
      this.menuService.setIsDynamicFormBuilderMenu(false);
    }

    if (url.indexOf('/listing') == -1 && menu.menuCategory == 'Dynamic') {
      this.viewService.setId(menu.dynamicFormId);
      url += '/dynamic';
    }

    if (this.menuType == 'overlay') {
      this.appSettingService.setPinnedMenu(false);
    }

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
    });
  }

  openSubMenu(menu: string) {
    this.currentMenu = menu;
  }

  getMenuHeight(menus: any) {
    let h = 12.5;
    if (menus) {
      h += menus.length * 1.5;
    }
    return {
      height: h + 'rem',
    };
  }

  closeSubMenu() {
    this.currentMenu = null;
  }

  closeFullScreenMenu() {
    this.closeFullScreen.emit();
  }
}
