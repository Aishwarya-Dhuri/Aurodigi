import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../main.component';
import { SidebarComponents } from '../../right-sidebar/@enums/sidebar-components';
import { MainHeaderComponent } from '../main-header.component';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.component.html',
  styleUrls: ['./more-options.component.scss'],
})
export class MoreOptionsComponent implements OnInit {
  isFxRate: boolean = false;
  isInterestRate: boolean = false;
  fxRateColDefUrl: string = 'main/main-header/fxRate/private/fxRateColDef';
  fxRateRowDataUrl: string = 'main/main-header/fxRate/private/getAllList';
  interestRateColDefUrl: string = 'main/main-header/interestRate/private/interestRateColDef';
  interestRateRowDataUrl: string = 'main/main-header/interestRate/private/getAllList';
  gridOptions = {
    supressAutoFit: true,
    context: {
      componentParent: this,
    },
  };
  constructor(
    private mainComponent: MainComponent,
    private mainHeaderComponent: MainHeaderComponent,
  ) {}

  ngOnInit(): void {}

  openMyTasks() {
    this.mainHeaderComponent.moreOptions = false;
    this.mainComponent.openSidebar(SidebarComponents.userTasks);
  }
}
