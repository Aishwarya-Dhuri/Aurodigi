import { Component, OnInit } from '@angular/core';

interface IBreadCrumb {
  label: string;
  pahtUrl: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: any;

  constructor() {}

  ngOnInit(): void {}
}
