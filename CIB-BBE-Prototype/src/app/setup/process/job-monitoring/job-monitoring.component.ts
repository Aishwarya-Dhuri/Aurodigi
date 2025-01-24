import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Actions } from 'src/app/base/@models/actions';
import { Breadcrumb } from 'src/app/base/main/@models/breadcrumb.model';
import { ActionService } from 'src/app/base/main/@services/action.service';
import { BreadcrumbService } from 'src/app/base/main/@services/breadcrumb.service';
import { Filter } from 'src/app/shared/@components/dynamic-search/@models/filter.model';
import { ViewService } from 'src/app/shared/services/view-service/view-service';
import { JobMonitoringService } from './@services/job-monitoring.service';

@Component({
  selector: 'app-job-monitoring',
  templateUrl: './job-monitoring.component.html',
  styleUrls: ['./job-monitoring.component.scss'],
})
export class JobMonitoringComponent implements OnInit {
  @ViewChild('dynamicSearch') dynamicSearch: any;

  searchType: string = 'Today Job';

  colDefUrl: string = 'setup/process/jobMonitoring/private/searchResultColDef';
  rowDefUrl: string = 'setup/process/jobMonitoring/private/getSearchResultList';

  constructor(
    private breadcrumbService: BreadcrumbService,
    private actionsService: ActionService,
    private viewService: ViewService,
    private jobMonitoringService: JobMonitoringService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const actions: Actions = {
      heading: 'Job Monitoring',
      refresh: true,
      print: true,
      relationshipManager: true,
      quickLinks: true,
    };
    this.actionsService.setActions(actions);
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Setup' },
      { label: 'Process' },
      { label: 'Job Monitoring' },
    ];
    this.breadcrumbService.setBreadCrumb(breadcrumbs);
  }

  getRecords(filters: Filter[]): void {
    this.jobMonitoringService.selectedFilters = filters;
    this.router.navigateByUrl('/setup/process/jobMonitoring/listing');
  }

  onDynamicFiltersReady(): void {
    this.jobMonitoringService.selectedFilters.forEach((filter: Filter) => {
      this.dynamicSearch.fillFilter(filter);
    });
  }
}
