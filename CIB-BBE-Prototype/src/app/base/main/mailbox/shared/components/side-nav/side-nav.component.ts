import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';

@Component({
  selector: '[app-side-nav]',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  isMenuActive: string;
  subscription: Subscription;

  listingType: string = 'inbox';

  sideNavItem = [
    {
      label: 'inbox',
      key: 'inboxCount',
      count: 0,
      icon: 'fas fa-inbox',
    },
    {
      label: 'sent',
      key: 'sendCount',
      count: 0,
      icon: 'far fa-paper-plane',
    },
    {
      label: 'starred',
      key: 'starredCount',
      count: 0,
      icon: 'far fa-star',
    },
    {
      label: 'draft',
      key: 'draftCount',
      count: 0,
      icon: 'far fa-file',
    },
    {
      label: 'trash',
      key: 'trashCount',
      count: 0,
      icon: 'far fa-trash-alt',
    },
  ];
  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.callMailListing(this.listingType);
    this.callSideNav();
    this.callMenuActive();
  }

  callSideNav() {
    this.commonService.getSideNav().subscribe((data: any) => {
      let sideNavData = data.dataMap;
      for (var x in sideNavData) {
        for (var y = 0; y < this.sideNavItem.length; y++) {
          if (this.sideNavItem[y].key == x) {
            this.sideNavItem[y]['count'] = sideNavData[x];
          }
        }
      }
    });
  }

  callMenuActive() {
    this.commonService.isMenuOpen.subscribe((isMenu) => {
      this.isMenuActive = isMenu;
    });
  }

  changeMenu() {
    // this.isMenuActive = !this.isMenuActive;
    let isOpen = this.isMenuActive == 'collapse' ? 'expend' : 'collapse';
    this.commonService.isMenuOpen.next(isOpen);
  }

  onComposeClick() {
    this.commonService.listingType.next('compose');
  }

  callMailListing(type: string) {
    let listingReq = { pageNumber: 1, entityName: type, filters: [] };
    this.commonService.isListingRequest = listingReq;
    this.listingType = type;
    this.commonService.listingType.next(type);
  }
}
