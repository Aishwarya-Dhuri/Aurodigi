export class HelpDocument {
  id?: number | string;
  version?: number | string;
  moduleName: string;
  subModuleName: string;
  documentUrl: string;
  password: string;

  constructor() {
    this.moduleName = '';
    this.subModuleName = '';
    this.documentUrl = '';
    this.password = '';
  }
}
