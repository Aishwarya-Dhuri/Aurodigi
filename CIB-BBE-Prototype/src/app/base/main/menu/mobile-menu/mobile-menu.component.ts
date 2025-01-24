import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/shared/@components/generic-listing/services/listing.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { Breadcrumb } from '../../@models/breadcrumb.model';
import { Menu } from '../../@models/menus';
import { Widget } from '../../@models/widget-details';
import { BreadcrumbService } from '../../@services/breadcrumb.service';
import { MenuService } from '../../@services/menu.service';
import { MenuComponent } from '../menu.component';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  @Input('mobileMenus') mobileMenus: {
    activeMenu: string;
    menus: Menu[] | Widget[];
    isSubMenus?: boolean;
  };
  @Output() closeMenu = new EventEmitter<void>();

  activeMenu: string;
  mobileSubMenus: {
    activeMenu: string;
    menus: Widget[] | Menu[];
  };

  constructor(
    private router: Router,
    private menuService: MenuService,
    public breadcrumbService: BreadcrumbService,
    public menuComponent: MenuComponent,
    private listingService: ListingService,
    private viewService: ViewService,
  ) {}

  ngOnInit() {}

  handleRoute(menu: Menu, url: string, breadcrumb: string) {
    this.menuService.setSelectedMenu(menu);
    this.menuService.setSelectedEntityName(menu.entityName);
    this.menuService.setSelectedServiceUrl(menu.serviceUrl);

    const breadcrumbs: Breadcrumb[] = [];

    this.mobileMenus.activeMenu.split('/').forEach((label: string) => {
      breadcrumbs.push({
        label: label.trim(),
      });
    });

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

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
      this.menuComponent.closeOverlayMenu();
    });
  }

  closeMobileMenu() {
    this.closeMenu.emit();
  }

  openMobileMenu(activeMenu: string, subMenu: Menu[]) {
    activeMenu = this.mobileMenus.activeMenu + ' / ' + activeMenu;
    this.mobileSubMenus = { activeMenu, menus: subMenu };
  }

  closeMobileSubMenu() {
    this.mobileSubMenus = null;
  }

  toggleMobileSubMenu(activeMenu: string) {
    if (this.activeMenu === activeMenu) {
      this.activeMenu = null;
    } else {
      this.activeMenu = activeMenu;
    }
  }
}
