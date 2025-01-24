import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { JobMonitoringService } from '../@services/job-monitoring.service';

@Component({
  selector: 'app-job-monitoring-listing',
  templateUrl: './job-monitoring-listing.component.html',
  styleUrls: ['./job-monitoring-listing.component.scss'],
})
export class JobMonitoringListingComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;
  selectedFilters: any[] = [];
  colDefUrl: string = 'setup/process/jobMonitoring/private/searchResultColDef';
  rowDefUrl: string = 'setup/process/jobMonitoring/private/getSearchResultList';
  gridOptions: any = {
    pagination: false,
    context: { componentParent: this },
  };

  constructor(
    private jobMonitoringService: JobMonitoringService,
    private viewService: ViewService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.selectedFilters = this.jobMonitoringService.selectedFilters;
  }

  onModifyClick(): void {
    this.jobMonitoringService.selectedFilters = this.selectedFilters;
    this.router.navigateByUrl('/setup/process/jobMonitoring');
  }

  onClearClick(): void {
    this.jobMonitoringService.selectedFilters = [];
    this.router.navigateByUrl('/setup/process/jobMonitoring');
  }

  view(id: any) {
    this.viewService.setId(id);
    this.viewService.setMode('VIEW');
    this.router.navigateByUrl('/setup/process/jobMonitoring/initiate');
  }
  edit(id: any) {
    this.viewService.setId(id);
    this.viewService.setMode('EDIT');
    this.router.navigateByUrl('/setup/process/jobMonitoring/initiate');
  }
}
