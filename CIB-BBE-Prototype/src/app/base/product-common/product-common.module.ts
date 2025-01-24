import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthorizationDashboardComponent } from './authorization-dashboard/authorization-dashboard.component';
import { ProductCommonRoutingModule } from './product-common-routing.module';
import { TransactionEnquiryComponent } from './transaction-enquiry/transaction-enquiry.component';

@NgModule({
  declarations: [TransactionEnquiryComponent, AuthorizationDashboardComponent],
  imports: [CommonModule, SharedModule, ProductCommonRoutingModule],
})
export class ProductCommonModule {}
