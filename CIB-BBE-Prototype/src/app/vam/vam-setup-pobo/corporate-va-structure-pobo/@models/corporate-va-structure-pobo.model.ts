export interface CorporateVAStructure {
  id?: string;
  version?: string;
  draftId?: string;
  structureCreationFor?: string;
  corporateId?: string;
  corporateCode?: string;
  corporateName?: string;
  corporateAccountId?: string;
  corporateAccount?: string;
  accountDescription?: string;
  accountBranch?: string;
  isDisplayActualAccount?: boolean;
  isMaskActualAccount?: boolean;
  corporateStructureName?: string;
  virtualAccountType?: string;
  vaStatus?: string;
  bankStructureId?: string;
  bankStructureName?: string;
  maxLength?: number;
  prefixValue?: string;
  vaCreationLogic?: string;
  lenOfVA?: string;
  countOfVA?: string;
  uploadformatId?: string;
  downloadformatId?: string;
  isPartialMatchRequired?: boolean;
  vaStructureComponentList?: StructureComponent[];
  vaStructurePreview: string;
}

export interface StructureComponent {
  id?: string;
  version?: string;
  fieldType?: string;
  fieldLen?: string;
  dynamicType?: string;
  startSeries?: string;
  endSeries?: string;
  referenceType?: string;
  padding?: string;
  paddingVal?: string;
  dataType?: string;
  staticValue?: string;
  isPartialMatch?: boolean;
  isExpand?: boolean;
}

export interface StructurePreview {
  index?: number;
  name?: string;
  value?: string;
  class?: string;
}
