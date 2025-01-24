import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { CorporateVaStructurePoboComponent } from './vam-setup-pobo/corporate-va-structure-pobo/corporate-va-structure-pobo.component';
import { VirtualAccountIssuancePoboHierarchyComponent } from './vam-setup-pobo/virtual-account-issuance-pobo-hierarchy/virtual-account-issuance-pobo-hierarchy.component';
import { CorporateVaStructureComponent } from './vam-setup/corporate-va-structure/corporate-va-structure.component';
import { VirtualAccountIssuanceHierarchyComponent } from './vam-setup/virtual-account-issuance-hierarchy/virtual-account-issuance-hierarchy.component';

const routes: Routes = [
  {
    path: 'vamSetup',
    children: [
      {
        path: 'corporateVAStructure',
        component: CorporateVaStructureComponent,
      },
      {
        path: 'virtualAccountIssuanceHierarchy',
        component: VirtualAccountIssuanceHierarchyComponent,
      },
    ],
  },
  {
    path: 'vamSetupPobo',
    children: [
      {
        path: 'corporateVAStructure',
        component: CorporateVaStructurePoboComponent,
      },
      {
        path: 'virtualAccountIssuanceHierarchy',
        component: VirtualAccountIssuancePoboHierarchyComponent,
      },
    ],
  },
  { path: ':parentMenu/:entityName/listing', component: GenericListingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VamRoutingModule {}
