import { Component, OnInit, ViewChild } from '@angular/core';
import { InterestTemplate, SlabInfo } from './@model/interest-template.model';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { UserService } from 'src/app/shared/@services/user.service';
import { Actions } from 'src/app/base/@models/actions';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-interest-template',
  templateUrl: './interest-template.component.html',
  styleUrls: ['./interest-template.component.scss']
})
export class InterestTemplateComponent implements OnInit {
  @ViewChild('interestTemplateForm') interestTemplateForm: any;

  formData: InterestTemplate = new InterestTemplate();
  slabInfo: SlabInfo = new SlabInfo();
  stepperDetails: Stepper = {
    masterName: 'Interest Template',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['', ''],
  };
  mode: string;
  constructor(
    private userService: UserService,
    private actionsService: ActionService,
    private viewService: ViewService,
    private httpService: HttpService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Interest Template',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    this.getViewData();
  }

  addSlabInfo() {
    this.formData.slabInfo.push(new SlabInfo());
  }

  removeSlabInfo(index: number) {
    this.formData.slabInfo.splice(index, 1);
  }

  validateForm(stepNo: number): boolean {
    if (stepNo == 1 && this.interestTemplateForm) {
      return this.interestTemplateForm.valid;
    }
    return true;
  }

  getViewData(): void {
    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/templates/interestTemplate/private/view', data)
        .subscribe((formData: InterestTemplate) => {
          this.viewService.clearAll();
          this.formData = formData;
          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = this.stepperDetails.headings.length;
          }
        });
    }
  }
}
