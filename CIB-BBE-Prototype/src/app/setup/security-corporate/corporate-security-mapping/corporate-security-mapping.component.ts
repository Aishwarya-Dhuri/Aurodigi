import { Component, OnInit, ViewChild } from '@angular/core';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { CorporateSecurityMapping } from './@models/corporate-security-mapping.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-corporate-security-mapping',
  templateUrl: './corporate-security-mapping.component.html',
  styleUrls: ['./corporate-security-mapping.component.scss']
})
export class CorporateSecurityMappingComponent implements OnInit {

  formData: CorporateSecurityMapping = new CorporateSecurityMapping();
  @ViewChild('corporateSecurityMappingForm') corporateSecurityMappingForm: any;

  stepperDetails: Stepper = {
    masterName: 'Corporate Security Mapping',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };

  mode: string;

  isShowCorporateIdSearch: boolean
  constructor(private viewService: ViewService, private httpService: HttpService) { }

  ngOnInit(): void {
    this.getViewData();
  }

  onCorporateIdSelect(val: any) {
    this.formData.corporateId = val.corporateId.toString();
    this.formData.corporateName = val.corporateName;
  }

  onSupportingDocumentUploaded(file: any) {
    this.formData.keyFile = file;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateSecurityMapping/private/view', data)
        .subscribe((formData: CorporateSecurityMapping) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
}
