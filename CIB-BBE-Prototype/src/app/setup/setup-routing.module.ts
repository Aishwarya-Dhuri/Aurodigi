import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenericListingComponent } from '../shared/@components/generic-listing/generic-listing.component';
import { CIBConfigurationComponent } from './cib-setup/cib-configuration/cib-configuration.component';
import { DynamicFormBuilderComponent } from './cib-setup/dynamic-form-builder/dynamic-form-builder.component';
import { WidgetBuilderComponent } from './cib-setup/widget-builder/widget-builder.component';
import { MailCategoryComponent } from './general-masters/mail-category/mail-category.component';
import { InterfaceConfigurationComponent } from './process/interface-configuration/interface-configuration.component';
import { JobMonitoringInitiateComponent } from './process/job-monitoring/job-monitoring-initiate/job-monitoring-initiate.component';
import { JobMonitoringListingComponent } from './process/job-monitoring/job-monitoring-listing/job-monitoring-listing.component';
import { JobMonitoringComponent } from './process/job-monitoring/job-monitoring.component';
import { BankProfileComponent } from './security-bank/bank-profile/bank-profile.component';
import { BankRoleComponent } from './security-bank/bank-role/bank-role.component';
import { BankUserComponent } from './security-bank/bank-user/bank-user.component';
import { CorporateProfileComponent } from './security-corporate/corporate-profile/corporate-profile.component';
import { CorporateRoleComponent } from './security-corporate/corporate-role/corporate-role.component';
import { CorporateUserComponent } from './security-corporate/corporate-user/corporate-user.component';
import { UserAccessFieldComponent } from './security-corporate/user-access-field/user-access-field.component';
import { DocumentDesignerComponent } from './templates/document-designer/document-designer.component';
import { QuickOnboardingComponent } from './cib-setup/quick-onboarding/quick-onboarding.component';
import { CorporateOnboardingComponent } from './security-corporate/corporate-onboarding/corporate-onboarding.component';
import { ServiceTemplateComponent } from './security-corporate/service-template/service-template.component';
import { AlertTemplateComponent } from './templates/alert-template/alert-template.component';
import { ChargeTemplateComponent } from './templates/charge-template/charge-template.component';
import { QueryBuilderComponent } from './process/query-builder/query-builder.component';
import { ReportMappingComponent } from './process/report-mapping/report-mapping.component';
import { InterestTemplateComponent } from './templates/interest-template/interest-template.component';
import { ResetPasswordComponent } from './security-corporate/reset-password/reset-password.component';
import { ResetUserComponent } from './security-corporate/reset-user/reset-user.component';
import { UnlockUserComponent } from './security-corporate/unlock-user/unlock-user.component';
import { ResetBankUserComponent } from './security-bank/reset-bank-user/reset-bank-user.component';
import { ChangePasswordComponent } from './security-bank/change-password/change-password.component';
import { UnlockBankUserComponent } from './security-bank/unlock-bank-user/unlock-bank-user.component';
import { DataLayoutComponent } from './templates/data-layout/data-layout.component';
import { DynamicDiscountingTemplateComponent } from './templates/dynamic-discounting-template/dynamic-discounting-template.component';
import { ChargeMappingComponent } from './templates/charge-mapping/charge-mapping.component';
import { EnrichmentTemplateComponent } from './templates/enrichment-template/enrichment-template.component';
import { AlertMappingComponent } from './templates/alert-mapping/alert-mapping.component';
import { CorporateDetailsComponent } from './security-corporate/corporate-details/corporate-details.component';
import { WorkflowTemplateComponent } from './templates/workflow-template/workflow-template.component';
import { RuleMasterTemplateComponent } from './templates/rule-master-template/rule-master-template.component';
import { LatePaymentPenaltyTemplateComponent } from './templates/late-payment-penalty-template/late-payment-penalty-template.component';
import { CorporateGroupComponent } from './security-corporate/corporate-group/corporate-group.component';
import { CorporateAccountComponent } from './security-corporate/corporate-account/corporate-account.component';
import { BroadcastMessageComponent } from './security-bank/broadcast-message/broadcast-message.component';
import { AntiPhishingImageComponent } from './security-bank/anti-phishing-image/anti-phishing-image.component';
import { HelpDocumentComponent } from './security-bank/help-document/help-document.component';
import { CurrencyComponent } from './general-masters/currency/currency.component';
import { GeographyComponent } from './general-masters/geography/geography.component';
import { BenchmarkRateComponent } from './general-masters/benchmark-rate/benchmark-rate.component';
import { ExchangeRateComponent } from './general-masters/exchange-rate/exchange-rate.component';
import { BicEntryComponent } from './general-masters/bic-entry/bic-entry.component';
import { LocationComponent } from './general-masters/location/location.component';
import { CorporateAuthorizationMatrixComponent } from './security-corporate/corporate-authorization-matrix/corporate-authorization-matrix.component';
import { CorporateSecurityMappingComponent } from './security-corporate/corporate-security-mapping/corporate-security-mapping.component';
import { CorporateMarginMaintenanceComponent } from './security-corporate/corporate-margin-maintenance/corporate-margin-maintenance.component';
// import { CorporateMainComponent } from './security-corporate/corporate-main/corporate-main.component';
import { ParameterComponent } from './security-bank/parameter/parameter.component';
import { CorporateMainComponent } from './corporate-onboarding/corporate-main/corporate-main.component';
import { BbeCorporateGroupComponent } from './corporate-onboarding/bbe-corporate-group/bbe-corporate-group.component';
// import { ContentManagementComponent } from './process/content-management/content-management.component';
// import { ContentManagementInitiateComponent } from './process/content-management/content-management-initiate/content-management-initiate.component';
// import { ContentManagementListingComponent } from './process/content-management/content-management-listing/content-management-listing.component';
import { CmsComponent } from './process/cms/cms.component';

const routes: Routes = [
  {
    path: 'generalMasters',
    children: [
      { path: 'mailCategory', component: MailCategoryComponent },
      { path: 'adminCurrency', component: CurrencyComponent },
      { path: 'adminGeography', component: GeographyComponent },
      { path: 'benchmarkRate', component: BenchmarkRateComponent },
      { path: 'exchangeRate', component: ExchangeRateComponent },
      { path: 'bicEntry', component: BicEntryComponent },
      { path: 'location', component: LocationComponent },
    ],
  },
  {
    path: 'securityBank',
    children: [
      { path: 'bankProfile', component: BankProfileComponent },
      { path: 'bankRole', component: BankRoleComponent },
      { path: 'bankUser', component: BankUserComponent },
      { path: 'resetBankUser', component: ResetBankUserComponent },
      { path: 'unlockBankUser', component: UnlockBankUserComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'parameter', component: ParameterComponent },
    ],
  },

  {
    path: 'corporateOnboarding',
    children: [
      { path: 'bbecorporateMain', component: CorporateMainComponent },
      { path: 'corporateGroup', component: BbeCorporateGroupComponent },
    ],
  },
  {
    path: 'security',
    children: [
      { path: 'corporateProfile', component: CorporateProfileComponent },
      { path: 'corporateRole', component: CorporateRoleComponent },
      { path: 'corporateUser', component: CorporateUserComponent },
      { path: 'userFieldAccess', component: UserAccessFieldComponent },
      { path: 'corporateOnboarding', component: CorporateOnboardingComponent },
      { path: 'serviceTemplate', component: ServiceTemplateComponent },
      { path: 'resetPassword', component: ResetPasswordComponent },
      { path: 'resetUser', component: ResetUserComponent },
      { path: 'unlockCorporateUser', component: UnlockUserComponent },
      { path: 'corporateDetails', component: CorporateDetailsComponent },
      { path: 'corporateGroup', component: CorporateGroupComponent },
      { path: 'corporateAccount', component: CorporateAccountComponent },
      { path: 'broadcastMessage', component: BroadcastMessageComponent },
      { path: 'antiPhishingImage', component: AntiPhishingImageComponent },
      { path: 'helpDocument', component: HelpDocumentComponent },
      { path: 'corporateAuthorizationMatrix', component: CorporateAuthorizationMatrixComponent },
      { path: 'corporateSecurityMapping', component: CorporateSecurityMappingComponent },
      { path: 'corporateMarginMaintenance', component: CorporateMarginMaintenanceComponent },
      { path: 'corporateMain', component: CorporateMainComponent },
    ],
  },
  {
    path: 'process',
    children: [
      { path: 'jobMonitoring', component: JobMonitoringComponent },
      { path: 'jobMonitoring/initiate', component: JobMonitoringInitiateComponent },
      { path: 'jobMonitoring/listing', component: JobMonitoringListingComponent },
      { path: 'interfaceConfiguration', component: InterfaceConfigurationComponent },
      { path: 'queryBuilder', component: QueryBuilderComponent },
      { path: 'reportMapping', component: ReportMappingComponent },
      // { path: 'contentManagement', component: ContentManagementComponent },
      // { path: 'contentManagement/initiate', component: ContentManagementInitiateComponent },
      // { path: 'contentManagement/listing', component: ContentManagementListingComponent },
      { path: 'cms', component: CmsComponent },
    ],
  },
  {
    path: 'cibSetup',
    children: [
      { path: 'dynamicFormBuilder', component: DynamicFormBuilderComponent },
      { path: 'uiConfiguration', component: CIBConfigurationComponent },
      { path: 'widgetBuilder', component: WidgetBuilderComponent },
      { path: 'quickOnboarding', component: QuickOnboardingComponent },
    ],
  },
  {
    path: 'templates',
    children: [
      { path: 'documentDesigner', component: DocumentDesignerComponent },
      { path: 'alertTemplate', component: AlertTemplateComponent },
      { path: 'chargeTemplate', component: ChargeTemplateComponent },
      { path: 'interestTemplate', component: InterestTemplateComponent },
      { path: 'dataLayout', component: DataLayoutComponent },
      { path: 'dynamicDiscountingTemplate', component: DynamicDiscountingTemplateComponent },
      { path: 'chargeMapping', component: ChargeMappingComponent },
      { path: 'enrichmentTemplate', component: EnrichmentTemplateComponent },
      { path: 'alertMapping', component: AlertMappingComponent },
      { path: 'workflowTemplate', component: WorkflowTemplateComponent },
      { path: 'ruleMasterTemplate', component: RuleMasterTemplateComponent },
      { path: 'latePaymentPenaltyTemplate', component: LatePaymentPenaltyTemplateComponent },
    ],
  },
  {
    path: ':parentMenu/:entityName/listing',
    component: GenericListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
