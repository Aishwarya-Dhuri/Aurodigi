import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { MainComponent } from '../../main.component';
import { SidebarComponents } from '../../right-sidebar/@enums/sidebar-components';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Input('userDetails') userDetails: any;
  sidebarComponents = SidebarComponents;

  constructor(
    private router: Router,
    private httpService: HttpService,
    public mainComponent: MainComponent,
    private userService: UserService,
  ) {}

  ngOnInit(): void {}

  routeTo(url: string): void {
    this.close();
    this.router.navigateByUrl(url);
  }

  openSidebar(component: string) {
    this.mainComponent.openSidebar(component);
    this.close();
  }

  logout() {
    this.httpService.httpPost('login/private/logout').subscribe(() => {
      this.userService.setUserDetails(null);
      this.userService.setApplicationDate(null);
      this.userService.setUserName(null);
      sessionStorage.removeItem('securityId');
      this.router.navigate(['/login']);
    });
  }

  close(): void {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
  }
}
