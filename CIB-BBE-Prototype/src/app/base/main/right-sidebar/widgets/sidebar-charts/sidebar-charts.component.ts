import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { WidgetService } from '../../../@services/widget.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-sidebar-charts',
  templateUrl: './sidebar-charts.component.html',
  styleUrls: ['./sidebar-charts.component.scss'],
})
export class SidebarChartsComponent implements OnInit {
  products: any[] = [];

  @Output() saveWidgets: any = new EventEmitter<void>();

  constructor(private httpService: HttpService, private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.widgetService.getDashboard().subscribe((dashboardWidgets: any[]) => {
      const widgets = cloneDeep(dashboardWidgets);

      const products: any[] = [];

      widgets.forEach((widget: any) => {
        const i = products.findIndex((product: any) => product.name === widget.product);

        if (i >= 0) {
          products[i].widgets.push(widget);
        } else {
          const product = {
            name: widget.product,
            widgets: [widget],
            isExpand: false,
          };

          products.push(product);
        }
      });

      if (products.length > 0) {
        products[0].isExpand = true;
      }

      this.products = products;
    });
  }

  onWidgetChecked(e, w) {}

  onSaveWidgets() {
    const widgets: any[] = [];
    this.products.forEach((product: any) => {
      widgets.push(...product.widgets);
    });

    this.widgetService.setDashboard(widgets);
    this.saveWidgets.emit();
  }
}
