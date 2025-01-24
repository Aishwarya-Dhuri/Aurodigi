export class JobMonitoring {
  moduleId?: string;
  moduleName?: string;
  jobId: string;
  jobName: string;
  frequencyTypeId: string;
  frequencyTypeName: string;
  weekly?: string;
  month?: string;
  time?: string;

  constructor() {
    this.moduleId = '';
    this.moduleName = '';
    this.jobId = '';
    this.jobName = '';
    this.frequencyTypeId = '';
    this.frequencyTypeName = '';
    this.weekly = '';
    this.month = '';
    this.time = '';
  }
}
