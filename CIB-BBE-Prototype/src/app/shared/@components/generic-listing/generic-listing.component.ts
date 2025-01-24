import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from '../../@services/http.service';
import { ViewService } from '../../services/view-service/view-service';

@Component({
  selector: 'app-generic-listing',
  templateUrl: './generic-listing.component.html',
  styleUrls: ['./generic-listing.component.scss'],
})
export class GenericListingComponent implements OnInit {
  parentComponentRef: any = this;
  rejectReason: string = '';
  @ViewChild('listing') listing: any;

  constructor(
    protected actionsService: ActionService,
    protected breadcrumbService: BreadcrumbService,
    protected menuService: MenuService,
    protected router: Router,
    protected viewService: ViewService,
    protected httpService: HttpService,
  ) { }

  ngOnInit(): void { }

  onRejectReasonClick(rejectReason: string) {
    this.rejectReason = rejectReason;
  }

  navigateToInitiate(): void {
    if (this.menuService.getIsDynamicFormBuilderMenu()) {
      this.router.navigateByUrl(this.getServiceUrl() + '/dynamic');
    } else {
      this.router.navigateByUrl(this.getServiceUrl());
    }
  }

  view(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.navigateToView();
  }

  navigateToView(): void {
    if (this.menuService.getIsDynamicFormBuilderMenu()) {
      this.router.navigateByUrl(this.getServiceUrl() + '/dynamic');
    } else {
      this.router.navigateByUrl(this.getServiceUrl());
    }
  }

  edit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.navigateToInitiate();
  }

  authorize(id: any): void {
    const ids = [id];
    this.authorizeAll(ids).subscribe((responseStatus: number) => {
      if (responseStatus == 0) {
        this.listing.refresh();
      }
    });
  }

  authorizeAll(ids: string[]): Observable<number> {
    let response = new Subject<number>();
    let data = { dataMap: { ids: ids } };
    this.httpService
      .httpPost(this.getServiceUrl() + '/private/authorize', data)
      .subscribe((res) => {
        response.next(res.responseStatus.status);
        response.complete();
      });
    return response.asObservable();
  }

  reject(id: string): void {
    this.listing.showRejectReasonModal(true, [id]);
  }

  rejectAll(ids: string[], rejectReason: string): Observable<number> {
    let response = new Subject<number>();
    let data = { dataMap: { ids: ids, rejectReason: rejectReason } };
    this.httpService.httpPost(this.getServiceUrl() + '/private/reject', data).subscribe((res) => {
      response.next(res.responseStatus.status);
      response.complete();
    });
    return response.asObservable();
  }

  delete(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to delete it?', 'DELETE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService
            .httpPost(this.getServiceUrl() + '/private/delete', data)
            .subscribe((res) => {
              this.listing.refresh();
            });
        }
      });
  }

  log(id: string) {
    this.menuService.setSelectedServiceUrl('setup/process/jobMonitoring');
    this.router.navigate(['/setup/process/jobMonitoring/listing']);
  }

  resubmit(id: string): void {
    this.viewService.setId(id);
    this.viewService.setMode('RESUBMIT');
    this.navigateToInitiate();
  }

  acceptReject(id: string) {
    let data = { dataMap: { id: id } };
    this.httpService
      .httpPost(this.getServiceUrl() + '/private/acceptReject', data)
      .subscribe((res) => {
        this.listing.refresh();
      });
  }

  disable(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to disable it?', 'DISABLE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService
            .httpPost(this.getServiceUrl() + '/private/disable', data)
            .subscribe((res) => {
              this.listing.refresh();
            });
        }
      });
  }

  enable(id: string): void {
    this.listing
      .showConfirmModal('Are you sure you want to enable it?', 'ENABLE')
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          let data = { dataMap: { id: id } };
          this.httpService
            .httpPost(this.getServiceUrl() + '/private/enable', data)
            .subscribe((res) => {
              this.listing.refresh();
            });
        }
      });
  }

  getServiceUrl(): string {
    return this.menuService.getSelectedServiceUrl();
  }
}
