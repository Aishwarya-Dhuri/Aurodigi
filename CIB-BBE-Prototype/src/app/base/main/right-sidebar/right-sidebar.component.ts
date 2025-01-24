import { Component, Input, OnInit } from '@angular/core';
import { MainComponent } from '../main.component';
import { SidebarService } from '../@services/sidebar.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
  component: any;
  outputs: any;

  constructor(private mainComponent: MainComponent, private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.getComponent().subscribe((component: any) => {
      if (component) {
        this.component = component;
      }
    });

    this.outputs = {
      close: (event?: any) => {
        this.closeSidebar();
      },
    };
  }

  closeSidebar() {
    this.mainComponent.closeSidebar();
  }
}
