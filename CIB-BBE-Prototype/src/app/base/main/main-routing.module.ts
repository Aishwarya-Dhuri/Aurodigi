import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelationshipManagerComponent } from './dashboard/relationship-manager/relationship-manager.component';
import { MainComponent } from './main.component';
import { UserPersonalizationComponent } from './user-personalization/user-personalization.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard/relationshipManager',
        children: [
          {
            path: '',
            component: RelationshipManagerComponent,
            // data: { showDashboardActions: true },
          },
        ],
      },
      {
        path: 'dashboard/:dashboardType',
        children: [
          { path: '', component: DashboardComponent, data: { showDashboardActions: true } },
        ],
      },
      {
        path: 'setup',
        loadChildren: () => import('../../setup/setup.module').then((m) => m.SetupModule),
      },
      {
        path: 'vam',
        loadChildren: () => import('../../vam/vam.module').then((m) => m.VamModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('../../reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'setting',
        children: [{ path: 'userPersonalization', component: UserPersonalizationComponent }],
      },
      {
        path: ':product',
        loadChildren: () =>
          import('../../base/product-common/product-common.module').then(
            (m) => m.ProductCommonModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
