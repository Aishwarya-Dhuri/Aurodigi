import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-org-tree',
  templateUrl: './org-tree.component.html',
  styleUrls: ['./org-tree.component.scss'],
})
export class OrgTreeComponent implements OnInit {
  @Input('treeData') treeData: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
