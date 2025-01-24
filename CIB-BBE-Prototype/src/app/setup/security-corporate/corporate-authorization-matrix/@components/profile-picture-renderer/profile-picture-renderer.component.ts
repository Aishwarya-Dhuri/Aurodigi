import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-profile-picture-renderer',
  templateUrl: './profile-picture-renderer.component.html',
  styleUrls: ['./profile-picture-renderer.component.scss']
})
export class ProfilePictureRendererComponent implements OnInit {
  cellValue: string;

  params: ICellRendererParams;

  constructor() { }

  ngOnInit(): void {
  }

  onClickUsers() { }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.cellValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

}
