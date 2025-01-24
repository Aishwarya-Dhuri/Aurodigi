import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SharedModule } from '../shared/shared.module';
import { CIBConfigurationComponent } from './cib-setup/cib-configuration/cib-configuration.component';
import { DynamicCardBuilderComponent } from './cib-setup/dynamic-form-builder/@components/dynamic-card-builder/dynamic-card-builder.component';
import { DynamicFormBuilderComponent } from './cib-setup/dynamic-form-builder/dynamic-form-builder.component';
import { BankProfileComponent } from './security-bank/bank-profile/bank-profile.component';
import { AssignRightsCheckboxRendererComponent } from './security-bank/bank-role/@components/assign-rights-checkbox-renderer/assign-rights-checkbox-renderer.component';
import { BankRoleComponent } from './security-bank/bank-role/bank-role.component';
import { BankUserComponent } from './security-bank/bank-user/bank-user.component';
import { CorporateProfileComponent } from './security-corporate/corporate-profile/corporate-profile.component';
import { CorporateRoleComponent } from './security-corporate/corporate-role/corporate-role.component';
import { CorporateUserComponent } from './security-corporate/corporate-user/corporate-user.component';
import { SetupRoutingModule } from './setup-routing.module';
import { DocumentDesignerComponent } from './templates/document-designer/document-designer.component';
import { UserAccessFieldComponent } from './security-corporate/user-access-field/user-access-field.component';
import { CheckboxRendererComponent } from './security-corporate/user-access-field/@components/checkbox-renderer/checkbox-renderer.component';
import { AuthRuleDropdownRendererComponent } from './security-corporate/user-access-field/@components/auth-rule-dropdown-renderer/auth-rule-dropdown-renderer.component';
import { LockRendererComponent } from './security-corporate/user-access-field/@components/lock-renderer/lock-renderer.component';
import { MailCategoryComponent } from './general-masters/mail-category/mail-category.component';
import { WidgetBuilderComponent } from './cib-setup/widget-builder/widget-builder.component';
import { JobMonitoringComponent } from './process/job-monitoring/job-monitoring.component';
import { JobMonitoringListingComponent } from './process/job-monitoring/job-monitoring-listing/job-monitoring-listing.component';
import { JobMonitoringInitiateComponent } from './process/job-monitoring/job-monitoring-initiate/job-monitoring-initiate.component';
import { InterfaceConfigurationComponent } from './process/interface-configuration/interface-configuration.component';
import { QuickOnboardingComponent } from './cib-setup/quick-onboarding/quick-onboarding.component';
import { CorporateOnboardingComponent } from './security-corporate/corporate-onboarding/corporate-onboarding.component';
import { ServiceTemplateComponent } from './security-corporate/service-template/service-template.component';
import { AlertTemplateComponent } from './templates/alert-template/alert-template.component';
import { ChargeTemplateComponent } from './templates/charge-template/charge-template.component';
import { ReportMappingComponent } from './process/report-mapping/report-mapping.component';
import { QueryBuilderComponent } from './process/query-builder/query-builder.component';
import { QuerybuildercheckboxComponent } from './process/query-builder/@components/querybuildercheckbox/querybuildercheckbox.component';
import { WorkflowTemplateComponent } from './templates/workflow-template/workflow-template.component';
import { InterestTemplateComponent } from './templates/interest-template/interest-template.component';
import { ResetPasswordComponent } from './security-corporate/reset-password/reset-password.component';
import { ResetUserComponent } from './security-corporate/reset-user/reset-user.component';
import { UnlockUserComponent } from './security-corporate/unlock-user/unlock-user.component';
import { ResetBankUserComponent } from './security-bank/reset-bank-user/reset-bank-user.component';
import { UnlockBankUserComponent } from './security-bank/unlock-bank-user/unlock-bank-user.component';
import { ChangePasswordComponent } from './security-bank/change-password/change-password.component';
import { DataLayoutComponent } from './templates/data-layout/data-layout.component';
import { DynamicDiscountingTemplateComponent } from './templates/dynamic-discounting-template/dynamic-discounting-template.component';
import { ChargeMappingComponent } from './templates/charge-mapping/charge-mapping.component';
import { EnrichmentTemplateComponent } from './templates/enrichment-template/enrichment-template.component';
import { AlertMappingComponent } from './templates/alert-mapping/alert-mapping.component';
import { CorporateDetailsComponent } from './security-corporate/corporate-details/corporate-details.component';
import { HelpDocumentComponent } from './security-bank/help-document/help-document.component';
import { AntiPhishingImageComponent } from './security-bank/anti-phishing-image/anti-phishing-image.component';
import { BroadcastMessageComponent } from './security-bank/broadcast-message/broadcast-message.component';
import { CorporateAccountComponent } from './security-corporate/corporate-account/corporate-account.component';
import { CorporateGroupComponent } from './security-corporate/corporate-group/corporate-group.component';
import { RuleMasterTemplateComponent } from './templates/rule-master-template/rule-master-template.component';
import { LatePaymentPenaltyTemplateComponent } from './templates/late-payment-penalty-template/late-payment-penalty-template.component';
import { CurrencyComponent } from './general-masters/currency/currency.component';
import { GeographyComponent } from './general-masters/geography/geography.component';
import { BenchmarkRateComponent } from './general-masters/benchmark-rate/benchmark-rate.component';
import { ExchangeRateComponent } from './general-masters/exchange-rate/exchange-rate.component';
import { BicEntryComponent } from './general-masters/bic-entry/bic-entry.component';
import { LocationComponent } from './general-masters/location/location.component';
import { CorporateAuthorizationMatrixComponent } from './security-corporate/corporate-authorization-matrix/corporate-authorization-matrix.component';
import { ActionRendererComponent } from './security-corporate/corporate-authorization-matrix/@components/action-renderer/action-renderer.component';
import { ProfilePictureRendererComponent } from './security-corporate/corporate-authorization-matrix/@components/profile-picture-renderer/profile-picture-renderer.component';
import { RenderAvatarGroupComponent } from './security-corporate/corporate-authorization-matrix/@components/render-avatar-group/render-avatar-group.component';
import { AddUsersComponent } from './security-corporate/corporate-authorization-matrix/add-users/add-users.component';
import { MatrixDetailsComponent } from './security-corporate/corporate-authorization-matrix/matrix-details/matrix-details.component';
import { ReviewAndSubmitComponent } from './security-corporate/corporate-authorization-matrix/review-and-submit/review-and-submit.component';
import { AddSlabComponent } from './security-corporate/corporate-authorization-matrix/add-users/add-slab/add-slab.component';
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

@NgModule({
  declarations: [
    BankProfileComponent,
    AssignRightsCheckboxRendererComponent,
    BankRoleComponent,
    BankUserComponent,

    CorporateProfileComponent,
    CorporateRoleComponent,
    CorporateUserComponent,

    DynamicCardBuilderComponent,
    DynamicFormBuilderComponent,
    WidgetBuilderComponent,
    DocumentDesignerComponent,
    CIBConfigurationComponent,
    UserAccessFieldComponent,
    CheckboxRendererComponent,
    LockRendererComponent,
    AuthRuleDropdownRendererComponent,
    MailCategoryComponent,
    JobMonitoringComponent,
    JobMonitoringListingComponent,
    JobMonitoringInitiateComponent,
    InterfaceConfigurationComponent,
    QuickOnboardingComponent,
    CorporateOnboardingComponent,
    ServiceTemplateComponent,
    AlertTemplateComponent,
    ChargeTemplateComponent,
    ReportMappingComponent,
    QueryBuilderComponent,
    QuerybuildercheckboxComponent,
    WorkflowTemplateComponent,
    InterestTemplateComponent,
    ResetPasswordComponent,
    ResetUserComponent,
    UnlockUserComponent,
    ResetBankUserComponent,
    UnlockBankUserComponent,
    ChangePasswordComponent,
    UnlockBankUserComponent,
    DataLayoutComponent,
    DynamicDiscountingTemplateComponent,
    ChargeMappingComponent,
    EnrichmentTemplateComponent,
    AlertMappingComponent,
    CorporateDetailsComponent,
    RuleMasterTemplateComponent,
    LatePaymentPenaltyTemplateComponent,
    AntiPhishingImageComponent,
    BroadcastMessageComponent,
    CorporateAccountComponent,
    CorporateGroupComponent,
    HelpDocumentComponent,
    CurrencyComponent,
    GeographyComponent,
    BenchmarkRateComponent,
    ExchangeRateComponent,
    BicEntryComponent,
    LocationComponent,
    CorporateAuthorizationMatrixComponent,
    ActionRendererComponent,
    ProfilePictureRendererComponent,
    RenderAvatarGroupComponent,
    AddUsersComponent,
    MatrixDetailsComponent,
    ReviewAndSubmitComponent,
    AddSlabComponent,
    CorporateSecurityMappingComponent,
    CorporateMarginMaintenanceComponent,
    // CorporateMainComponent,
    ParameterComponent,
    CorporateMainComponent,
    CorporateGroupComponent,
    BbeCorporateGroupComponent,
    // ContentManagementComponent,
    // ContentManagementInitiateComponent,
    // ContentManagementListingComponent,
    CmsComponent,
  ],
  providers: [{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
  imports: [CommonModule, SharedModule, SetupRoutingModule, EditorModule],
})
export class SetupModule {}
