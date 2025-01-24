import { Select } from 'src/app/shared/@models/select.model';
import { Filter } from './filter.model';

export interface GenericFilter {
  name: string;
  displayName: string;
  type: string;
  fieldType: keyof typeof FieldType;
  mandatory: boolean;
  onlyShowOnGroup?: boolean;
  isSelected: boolean;
  url?: string;
  colDefUrl?: string;
  rowDefUrl?: string;
  urlData?: {
    pageNumber: 1;
    searchType: string;
    filters: Filter[];
  };
  selectList?: Select[];
  rangeFilter: boolean;
  searchResultIndexes?: string;
  searchResultFields?: string;
  basedOn?: string;
  conditionalBasedOn?: string;
  basedOnIndex?: number;
  fillFilterName?: string;
  fieldFor?: string;
  maxLength?: number;
  minLength?: number;
}

export enum FieldType {
  SEARCH = 'SEARCH',
  SELECT = 'SELECT',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  AMOUNT = 'AMOUNT',
  DATE = 'DATE',
}
