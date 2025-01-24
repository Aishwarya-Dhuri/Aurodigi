import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actions } from '../../@models/actions';
import { Breadcrumb } from '../@models/breadcrumb.model';
import { ActionService } from '../@services/action.service';
import { BreadcrumbService } from '../@services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbList: Breadcrumb[];
  actions: Actions;

  constructor(
    public breadcrumbService: BreadcrumbService,
    private actionService: ActionService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.breadcrumbService.getBreadcrumb().subscribe((breadcrumbList: Breadcrumb[]) => {
      this.breadcrumbList = breadcrumbList;
    });

    this.actionService.getActions().subscribe((actions: Actions) => {
      this.actions = actions;
    });
  }

  back() {
    this.location.back();
  }
}
