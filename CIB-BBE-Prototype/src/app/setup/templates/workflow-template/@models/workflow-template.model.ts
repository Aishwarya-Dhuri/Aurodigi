export class WorkflowTemplate {
  id?: number | string;
  version?: number | string;
  workflowCode: string;
  workflowName: string;
  moduleValue: string;
  productValue: string;
  eventId: string;

  constructor() {
    this.workflowCode = '';
    this.workflowName = '';
    this.moduleValue = '';
    this.productValue = '';
    this.eventId = '';
  }
}
