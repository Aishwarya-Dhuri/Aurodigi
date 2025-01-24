export class EnrichmentTempplate {
  id?: number | string;
  version?: number | string;
  profileCode: string;
  profileName: string;
  effectiveFrom: string;
  effectiveTill?: string;

  enrichmentCode: string;
  enrichmentName: string;
  module: string;
  product: string;
  menu: string;
  copyFromExistConfig: string;
  enrichmentTemplate: string;


  ////////////////
  interfaceName: string;
  requestType: string;
  dataType: string;
  fileNameFormat: string;
  prefix: string;
  dateFormat: string;
  delimiter: string;
  extension: string;
  fieldType: string;
  headerFields: HeaderFieldForm[];
  ////////////////

  constructor() {
    this.profileCode = '';
    this.profileName = '';
    this.effectiveFrom = '';
    this.effectiveTill = '';

    this.enrichmentCode = '';
    this.enrichmentName = '';
    this.module = '';
    this.product = '';
    this.menu = '';
    this.copyFromExistConfig = 'No';
    this.enrichmentTemplate = '';



    ///////////////////////////
    this.interfaceName = '';
    this.requestType = '';
    this.dataType = '';
    this.fileNameFormat = '';
    this.prefix = '';
    this.dateFormat = '';
    this.delimiter = '';
    this.extension = '';
    this.fieldType = '';
    this.headerFields = [];
    ///////////////////////////
  }
}

export class HeaderFieldForm {
  sequenceNo: string;
  fieldName: string;
  dataType: string;
  dropdownValues: string;
  isAllow: any;
  minLength: string
  maxLength: string;

  hid: string;
  fieldType: string;
  fieldValue: string;
  prefix: string;
  dateFormat: string;

  constructor() {
    this.sequenceNo = '';
    this.fieldName = '';
    this.dataType = '';
    this.dropdownValues = '';
    this.isAllow = false;
    this.minLength = '';
    this.maxLength = '';

    this.hid = '';
    this.fieldType = '';
    this.fieldValue = '';
    this.prefix = '';
    this.dateFormat = '';
  }
}
