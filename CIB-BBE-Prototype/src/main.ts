import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey(
  'CompanyName=Aurionpro Solutions Ltd,LicensedApplication=iCashPro-CIB,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-017416,ExpiryDate=17_July_2022_[v2]_MTY1ODAxMjQwMDAwMA==bdbb34444acebe44fd0f9531604ea05d',
);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
