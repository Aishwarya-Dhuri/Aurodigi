import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { DynamicModule } from 'ng-dynamic-component';
import { SharedModule } from '../../shared/shared.module';
import { ActionComponent } from './action/action.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GridComponent } from './dashboard/grid/grid.component';
import { ShowWidgetComponent } from './dashboard/grid/show-widget/show-widget.component';
import { AdvertisementComponent } from './dashboard/grid/widgets/advertisement/advertisement.component';
import { CalenderComponent } from './dashboard/grid/widgets/calender/calender.component';
import { CardComponent } from './dashboard/grid/widgets/card/card.component';
import { ChartComponent } from './dashboard/grid/widgets/chart/chart.component';
import { ColumnChartComponent } from './dashboard/grid/widgets/column-chart/column-chart.component';
import { SelectGroupButtonComponent } from './dashboard/grid/widgets/select-group-button/select-group-button.component';
import { TableComponent } from './dashboard/grid/widgets/table/table.component';
import { ChartTypesComponent } from './dashboard/grid/widgets/widgets-header/chart-types/chart-types.component';
import { HeaderOptionsComponent } from './dashboard/grid/widgets/widgets-header/header-options/header-options.component';
import { WidgetsHeaderComponent } from './dashboard/grid/widgets/widgets-header/widgets-header.component';
import { ChequeCollectionLimitBurstComponent } from './dashboard/relationship-manager/@components/cheque-collection-limit-burst/cheque-collection-limit-burst.component';
import { DeviationMatrixComponent } from './dashboard/relationship-manager/@components/deviation-matrix/deviation-matrix.component';
import { NewCustomerAcquisitionComponent } from './dashboard/relationship-manager/@components/new-customer-acquisition/new-customer-acquisition.component';
import { OngoingTransactionsComponent } from './dashboard/relationship-manager/@components/ongoing-transactions/ongoing-transactions.component';
import { ProcessingComponent } from './dashboard/relationship-manager/@components/processing/processing.component';
import { ProductWiseDistributionComponent } from './dashboard/relationship-manager/@components/product-wise-distributuin/product-wise-distribution.component';
import { RevenueGeneratedComponent } from './dashboard/relationship-manager/@components/revenue-generated/revenue-generated.component';
import { RelationshipManagerComponent } from './dashboard/relationship-manager/relationship-manager.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { BroadcastMessagesComponent } from './main-header/broadcast-messages/broadcast-messages.component';
import { HelpOptionsComponent } from './main-header/help-options/help-options.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MoreOptionsComponent } from './main-header/more-options/more-options.component';
import { UserInfoComponent } from './main-header/user-info/user-info.component';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FullscreenMenusComponent } from './menu/fullscreen-menus/fullscreen-menus.component';
import { MenuComponent } from './menu/menu.component';
import { MobileMenuComponent } from './menu/mobile-menu/mobile-menu.component';
import { ShortMenusComponent } from './menu/short-menus/short-menus.component';
import { TopbarMenusComponent } from './menu/topbar-menus/topbar-menus.component';
import { ConfigComponent } from './right-sidebar/config/config.component';
import { CountryComponent } from './right-sidebar/country/country.component';
import { LanguageComponent } from './right-sidebar/language/language.component';
import { MailsComponent } from './right-sidebar/mails/mails.component';
import { NotificationsComponent } from './right-sidebar/notifications/notifications.component';
import { QuickLinksComponent } from './right-sidebar/quick-links/quick-links.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { UserTasksComponent } from './right-sidebar/user-tasks/user-tasks.component';
import { SidebarChartsComponent } from './right-sidebar/widgets/sidebar-charts/sidebar-charts.component';
import { SidebarKpisComponent } from './right-sidebar/widgets/sidebar-kpis/sidebar-kpis.component';
import { WidgetsComponent } from './right-sidebar/widgets/widgets.component';
import { AlertCheckboxRendererComponent } from './user-personalization/@components/alert-checkbox-renderer/alert-checkbox-renderer.component';
import { AlertStatusRendererComponent } from './user-personalization/@components/alert-status-renderer/alert-status-renderer.component';
import { AuthMatrixAccountsRendererComponent } from './user-personalization/@components/auth-matrix-accounts-renderer/auth-matrix-accounts-renderer.component';
import { AuthMatrixAdditionalInfoRendererComponent } from './user-personalization/@components/auth-matrix-additional-info-renderer/auth-matrix-additional-info-renderer.component';
import { UserPersonalizationComponent } from './user-personalization/user-personalization.component';
import { MailboxModule } from './mailbox/mailbox.module';

@NgModule({
  declarations: [
    MainComponent,

    MainHeaderComponent,
    BroadcastMessagesComponent,
    MoreOptionsComponent,
    HelpOptionsComponent,
    UserInfoComponent,

    CalenderComponent,
    AdvertisementComponent,
    CardComponent,
    ChartComponent,
    ColumnChartComponent,
    TableComponent,
    SelectGroupButtonComponent,

    MenuComponent,
    FullscreenMenusComponent,
    ShortMenusComponent,
    TopbarMenusComponent,
    MobileMenuComponent,

    BreadcrumbComponent,

    ActionComponent,

    DashboardComponent,
    GridComponent,
    RelationshipManagerComponent,
    WidgetsHeaderComponent,
    HeaderOptionsComponent,
    ShowWidgetComponent,

    RightSidebarComponent,
    WidgetsComponent,
    SidebarChartsComponent,
    SidebarKpisComponent,
    QuickLinksComponent,
    MailsComponent,
    NotificationsComponent,
    CountryComponent,
    LanguageComponent,
    ConfigComponent,
    UserTasksComponent,
    UserPersonalizationComponent,
    AlertCheckboxRendererComponent,
    AlertStatusRendererComponent,
    AuthMatrixAdditionalInfoRendererComponent,
    AuthMatrixAccountsRendererComponent,
    ChartTypesComponent,
    NewCustomerAcquisitionComponent,
    RevenueGeneratedComponent,
    OngoingTransactionsComponent,
    DeviationMatrixComponent,
    ProcessingComponent,
    ProductWiseDistributionComponent,
    ChequeCollectionLimitBurstComponent,
    MainFooterComponent,
  ],
  imports: [
    CommonModule,
    DynamicModule,
    AgChartsAngularModule,
    SharedModule,
    MailboxModule,
    MainRoutingModule,
  ],
  entryComponents: [],
  exports: [MainComponent],
})
export class MainModule {}
