import { Component, OnInit } from '@angular/core';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Stepper } from 'src/app/shared/@components/stepper/@model/stepper.model';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { AuthorizationMatrix, Slab } from './@models/authorization-matrix.model';

@Component({
  selector: 'app-corporate-authorization-matrix',
  templateUrl: './corporate-authorization-matrix.component.html',
  styleUrls: ['./corporate-authorization-matrix.component.scss']
})
export class CorporateAuthorizationMatrixComponent implements OnInit {
  loading: boolean;

  showAddSlab: boolean = false;
  showAddProfile: boolean = false;

  editSlabIndex: number = -1;
  slabForEdit: Slab = null;

  formData: AuthorizationMatrix = new AuthorizationMatrix();

  mode: string;

  stepperDetails: Stepper = {
    masterName: 'Corporate Authorization Matrix',
    currentStep: 1,
    isSecondLastStepLabelAsReview: true,
    isOnlyFooter: true,
    headings: ['Matrix Details', 'Add Users', 'Review and Submit'],
  };

  constructor(
    private actionsService: ActionService,
    private breadcrumbService: BreadcrumbService,
    private httpService: HttpService,
    private viewService: ViewService,
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const actions: Actions = {
      heading: 'Corporate Authorization Matrix - Initiate',
      subHeading: null,

      refresh: true,

      download: false,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { icon: 'fa-home' },
      { label: 'Setup' },
      { label: 'Security' },
      { label: 'Corporate Authorization Matrix' },
      { label: 'Initiate' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);

    this.mode = this.viewService.getMode();
    if (this.mode == 'EDIT' || this.mode == 'VIEW') {
      const data = { dataMap: { id: this.viewService.getId() } };
      this.httpService
        .httpPost('setup/security/corporateAuthorizationMatrix/private/view', data)
        .subscribe((formData: AuthorizationMatrix) => {
          this.viewService.clearAll();

          this.formData = formData;

          if (this.mode == 'VIEW') {
            this.stepperDetails.currentStep = 3;
          }

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  beforeSubmit() {
    return true;
  }

  onEditSlab(i: number) {
    this.editSlabIndex = i;
    this.slabForEdit = this.formData.slabs[i];
    this.showAddSlab = true;
  }

  onDeleteSlab(i: number) {
    this.formData.slabs.splice(i, 1);
  }

  onSaveEditSlab(slab: Slab) {
    this.formData.slabs[this.editSlabIndex] = slab;
    this.editSlabIndex = -1;
    this.slabForEdit = null;
    this.showAddSlab = false;
  }

  onAddSlab(slab: Slab) {
    this.formData.slabs.push(slab);
    this.showAddSlab = false;
  }

}
