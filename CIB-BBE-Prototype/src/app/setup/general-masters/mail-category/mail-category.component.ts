import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { MailCategory } from './@models/mail-category.model';

@Component({
  selector: 'app-mail-category',
  templateUrl: './mail-category.component.html',
  styleUrls: ['./mail-category.component.scss'],
})
export class MailCategoryComponent implements OnInit {
  loading: boolean;

  formData: MailCategory = new MailCategory();

  stepperDetails: Stepper = {
    masterName: 'Mail Category',
    stepperType: 'HORIZONTAL',
    currentStep: 1,
    isOnlyFooter: true,
    isSecondLastStepLabelAsReview: true,
    headings: ['', 'Review and Submit'],
  };

  mode: string;

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
    private userService: UserService,
  ) {
    this.userService.getApplicationDate().subscribe((applicationDate: string) => {
      this.formData.effectiveFrom = applicationDate;
    });
  }

  ngOnInit(): void {
    this.loading = true;

    /* remove below : starts */
    const actions: Actions = {
      heading: 'Mail Category',
      subHeading: null,
      widgetsActions: false,
      refresh: true,
      widgets: false,
      download: false,
      print: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);

    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'General Masters' },
      { label: 'Mail Category' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
    /* remove below : ends */

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };

      if (this.mode == 'VIEW') {
        this.stepperDetails.currentStep = 2;
      }

      this.httpService
        .httpPost('setup/generalMasters/mailCategory/private/view', data)
        .subscribe((formData: any) => {
          this.viewService.clearAll();

          this.formData = formData;

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  onSelectRecipient(recipients: any) {
    // console.log(recipients);
  }
}
