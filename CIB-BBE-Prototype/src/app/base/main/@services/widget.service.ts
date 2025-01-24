import { Injectable } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/@services/http.service';
import { WidgetDetails_Response } from '../@models/widget-details';
import { Widgets } from '../dashboard/grid/@enums/widget-components';
import { AdvertisementComponent } from '../dashboard/grid/widgets/advertisement/advertisement.component';
import { CalenderComponent } from '../dashboard/grid/widgets/calender/calender.component';
import { CardComponent } from '../dashboard/grid/widgets/card/card.component';
import { ChartComponent } from '../dashboard/grid/widgets/chart/chart.component';
import { ColumnChartComponent } from '../dashboard/grid/widgets/column-chart/column-chart.component';
import { TableComponent } from '../dashboard/grid/widgets/table/table.component';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private _isFullScreen = new BehaviorSubject<boolean>(false);
  private _isModal = new BehaviorSubject<boolean>(false);
  private _gridType = new BehaviorSubject<number>(3);

  private _selectModalData = new BehaviorSubject<{ colDefUrl: string; rowDefUrl: string }>(null);
  private _selectModalResponse = new BehaviorSubject<any>(null);
  private dashboard = new BehaviorSubject<any[]>([]);

  private dashboardWidgets: Array<GridsterItem> = [];

  dashboardType: string = '';

  constructor(private httpService: HttpService) {}

  getDashboard() {
    return this.dashboard;
  }

  setDashboard(dashboard: any[]) {
    this.dashboard.next(dashboard);
  }

  getSelectModalData() {
    return this._selectModalData;
  }

  setSelectModalData(selectModalData: { colDefUrl: string; rowDefUrl: string }) {
    this._selectModalData.next(selectModalData);
  }

  getSelectModalResponse() {
    return this._selectModalResponse;
  }

  setSelectModalResponse(selectModalResponse: any) {
    this._selectModalResponse.next(selectModalResponse);
  }

  getIsFullScreen() {
    return this._isFullScreen;
  }

  setIsFullScreen(fullScreen: boolean) {
    this._isFullScreen.next(fullScreen);
  }

  getGridType() {
    return this._gridType;
  }

  setGridType(gridType: number) {
    this._gridType.next(gridType);
  }

  getIsModal() {
    return this._isModal;
  }

  setIsModal(modal: boolean) {
    this._isModal.next(modal);
  }

  getDashboardWidgets() {
    return this.dashboardWidgets;
  }

  setDashboardWidgets(dashboardWidgets: any[]) {
    this.dashboardWidgets = dashboardWidgets;
  }

  getWidgetComponent(widgetType: string) {
    let component: any;
    switch (widgetType) {
      case Widgets.chart:
        component = ChartComponent;
        break;
      case Widgets.columnChart:
        component = ColumnChartComponent;
        break;
      case Widgets.cards:
        component = CardComponent;
        break;
      case Widgets.table:
        component = TableComponent;
        break;
      case Widgets.calender:
        component = CalenderComponent;
        break;
      case Widgets.advertisement:
        component = AdvertisementComponent;
        break;
    }

    return component;
  }

  viewWidgetDetails() {
    // this.httpService.httpPost('viewWidgetDetails').pipe(
    this.httpService.httpPost('/viewWidgetDetails').pipe(
      map((widgetDetails: WidgetDetails_Response) => {
        return widgetDetails;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getWidgetDetails() {
    // this.httpService.httpPost('getWidgetDetails').pipe(
    this.httpService.httpPost('/getWidgetDetails').pipe(
      map((widgetDetails: WidgetDetails_Response) => {
        return widgetDetails;
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }
}
