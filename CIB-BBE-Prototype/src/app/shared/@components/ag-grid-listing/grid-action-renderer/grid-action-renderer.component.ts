import { Component, Input, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ListingAction } from './listing-action.model';
@Component({
  selector: 'app-grid-action-renderer',
  template: `
    <ng-container *ngIf="isAgGridRenderer">
      <span *ngFor="let action of actions | orderBy: 'index':false; let i = index">
        <button
          type="button"
          *ngIf="action.type === 'BUTTON'"
          class="btn btn-sm btn-tertiary p-py-0 p-ml-2 grid-row-text-size"
          [ngClass]="action.class"
          (click)="invokeParentMethod(action)"
        >
          <app-icon class="mr-2" [icon]="action.icon" *ngIf="action.icon"></app-icon
          >{{ action.displayName }}
        </button>

        <span class="p-ml-2 pointer" *ngIf="action.type === 'ICON'">
          <app-icon [icon]="action.icon" (click)="invokeParentMethod(action, $event)"></app-icon>
        </span>
      </span>
    </ng-container>

    <ng-container *ngIf="!isAgGridRenderer">
      <div class="flex-content-space-around-container">
        <div class="item" *ngFor="let action of actions | orderBy: 'index':false; let i = index">
          <span class="p-ml-2 pointer">
            <app-icon
              [icon]="action.icon ? action.icon : 'fa-times'"
              (click)="invokeParentMethod(action, $event)"
            ></app-icon>
          </span>
        </div>
      </div>
    </ng-container>
  `,
  /* styleUrls: ['./grid-action-renderer.component.scss'], */
})
export class GridActionRendererComponent implements OnInit, AgRendererComponent {
  actions!: ListingAction[];
  @Input('isAgGridRenderer') isAgGridRenderer?: boolean = true;
  @Input('data') data?: any;
  @Input('field') field?: string;
  @Input('context') context?: any;
  public params: ICellRendererParams | any;

  constructor() {}

  ngOnInit(): void {
    if (!this.isAgGridRenderer) {
      this.params = {
        data: this.data,
        context: this.context,
      };

      this.actions = this.params.data[this.field] ? this.params.data[this.field] : [];
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.actions = params.data[params.colDef.field] ? params.data[params.colDef.field] : [];
  }

  public invokeParentMethod(action: ListingAction, event: any) {
    const paramList = action.paramList ? action.paramList.split(',') : [];
    let paramListValues = [];
    paramList.forEach((param) => {
      paramListValues.push(this.params.data[param.trim()]);
    });
    if (this.params.context.componentParent[action.methodName]) {
      this.params.context.componentParent[action.methodName](...paramListValues, event);
    } else {
      if (!this.params.context.componentParent.onActionClick) {
        console.error(
          'kindly give implementation for : ' + action.methodName + '(' + action.paramList + ')',
        );
      }
    }

    if (this.params.context.componentParent.onActionClick) {
      this.params.context.componentParent.onActionClick(action, this.params.node);
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
