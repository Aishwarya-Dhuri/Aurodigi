export class ParameterTemplate {
  id?: number | string;
  version?: number | string;
  paramDesc: string;
  paramVal: string;
  paramUiMsg: string;

  constructor() {
    this.paramDesc = '';
    this.paramVal = '';
    this.paramUiMsg = '';
  }
}

