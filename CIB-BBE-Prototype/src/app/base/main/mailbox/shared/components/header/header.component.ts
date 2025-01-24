import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuActive: boolean = false;
  constructor(private commonService: CommonService) {}

  changeMenu() {
    this.isMenuActive = !this.isMenuActive;
    let isOpen = this.isMenuActive ? 'collapse' : 'expend';
    this.commonService.isMenuOpen.next(isOpen);
  }

  mbOpenSideNav() {
    this.commonService.isMenuOpen.next('open');
  }
}
