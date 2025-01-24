import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  selectedFrequentReportId: number = 0;

  scheduleReport: any = [
    {
      displayName: 'Report Frequency',
      value: '',
      show: true,
    },
    {
      displayName: 'Generated At',
      value: '',
      show: true,
    },
    {
      displayName: 'Activation Day',
      value: '',
      show: true,
    },
    {
      displayName: 'Report Format',
      value: '',
      show: true,
    },
    {
      displayName: 'Start Time',
      value: '',
      show: true,
    },
    {
      displayName: 'End Time',
      value: '',
      show: true,
    },
    {
      displayName: 'Every',
      value: '',
      show: true,
    },
    {
      displayName: 'From Date',
      value: '',
      show: true,
    },
    {
      displayName: 'To Date',
      value: '',
      show: true,
    },
    {
      displayName: 'Registrered Email',
      value: false,
      show: true,
    },
    {
      displayName: 'Additional Email',
      value: false,
      show: true,
    },
    {
      displayName: 'Email Ids: To',
      value: '',
      show: true,
    },
    {
      displayName: 'H2H',
      value: true,
      show: true,
    },
    {
      displayName: 'Email',
      value: false,
      show: true,
    },
    {
      displayName: 'isScheduleReport',
      value: false,
      show: true,
    },
    {
      radioScheduleReport: 'excel',
    },
  ];

  constructor() {}
}
