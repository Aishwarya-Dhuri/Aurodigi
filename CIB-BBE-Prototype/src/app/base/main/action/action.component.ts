import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '../../@models/actions';
import { ActionService } from '../@services/action.service';
import { WidgetService } from '../@services/widget.service';
import { MainComponent } from '../main.component';
import { SidebarComponents } from '../right-sidebar/@enums/sidebar-components';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  gridType: number;
  sidebarComponents = SidebarComponents;
  relationshipManager: boolean = false;
  showActionContainer: boolean = true;
  actions: Actions;
  activeAction: any;
  constructor(
    private widgetService: WidgetService,
    private mainComponent: MainComponent,
    private actionService: ActionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.actionService.getShowActionContainer().subscribe((showActionContainer: boolean) => {
      this.showActionContainer = showActionContainer;
    });

    this.actionService.getActions().subscribe((actions: Actions) => {
      this.actions = actions;

      if (actions && actions.actions) {
        this.changeAction(actions.actions[0]);
      }
    });

    this.widgetService.getGridType().subscribe((gridType: number) => {
      this.gridType = gridType;
    });
  }

  changeGrid(gridType: number) {
    this.widgetService.setGridType(gridType);
  }

  changeAction(action: any) {
    this.activeAction = action;
    this.actionService.setAction(action);
  }

  openSidebar(component: string) {
    this.mainComponent.openSidebar(component);
  }

  onLinkClick() {
    if (this.actions.subHeading && this.actions.subHeadingLink) {
      this.router.navigate([this.actions.subHeadingLink], { relativeTo: this.route });
    }
  }

  onPrint() {
    window.print();
  }
}
