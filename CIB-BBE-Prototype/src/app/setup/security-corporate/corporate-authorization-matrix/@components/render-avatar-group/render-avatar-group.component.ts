import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-render-avatar-group',
  templateUrl: './render-avatar-group.component.html',
  styleUrls: ['./render-avatar-group.component.scss']
})
export class RenderAvatarGroupComponent implements OnInit {
  users: any[] = [];
  params: ICellRendererParams;

  constructor() { }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.users = params.value;
    console.log(params.value);
  }

  ngOnInit(): void {
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onClickUsers() {
    this.params.context.componentParent.onClickUsers(this.users);
  }

}
