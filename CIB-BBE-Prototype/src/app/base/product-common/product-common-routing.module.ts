import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormComponent } from 'src/app/shared/@components/dynamic-form/dynamic-form.component';
import { AuthorizationDashboardComponent } from './authorization-dashboard/authorization-dashboard.component';
import { TransactionEnquiryComponent } from './transaction-enquiry/transaction-enquiry.component';

const routes: Routes = [
  {
    path: 'process/transactionEnquiry',
    component: TransactionEnquiryComponent,
  },
  {
    path: 'process/authorizationDashboard',
    component: AuthorizationDashboardComponent,
  },
  {
    path: ':parentMenu/:entityName/dynamic',
    component: DynamicFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCommonRoutingModule {}
