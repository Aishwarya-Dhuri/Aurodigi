import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VamRoutingModule } from './vam-routing.module';
import { VirtualAccountIssuanceHierarchyComponent } from './vam-setup/virtual-account-issuance-hierarchy/virtual-account-issuance-hierarchy.component';
import { CorporateVaStructureComponent } from './vam-setup/corporate-va-structure/corporate-va-structure.component';
import { SharedModule } from '../shared/shared.module';
import { CorporateVaStructurePoboComponent } from './vam-setup-pobo/corporate-va-structure-pobo/corporate-va-structure-pobo.component';
import { VirtualAccountIssuancePoboHierarchyComponent } from './vam-setup-pobo/virtual-account-issuance-pobo-hierarchy/virtual-account-issuance-pobo-hierarchy.component';

@NgModule({
  declarations: [
    CorporateVaStructureComponent,
    VirtualAccountIssuanceHierarchyComponent,
    CorporateVaStructurePoboComponent,
    VirtualAccountIssuancePoboHierarchyComponent,
  ],
  imports: [CommonModule, SharedModule, VamRoutingModule],
})
export class VamModule {}
