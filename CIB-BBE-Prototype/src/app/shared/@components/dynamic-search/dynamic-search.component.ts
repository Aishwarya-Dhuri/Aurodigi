import { Component, DoCheck, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from '../../@services/http.service';
import { Filter } from './@models/filter.model';
import { GenericFilter } from './@models/generic-filter.model';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { Select } from '../../@models/select.model';
import { Criteria } from './@models/criteria.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../../@services/user.service';

@Component({
  selector: 'app-dynamic-search',
  templateUrl: './dynamic-search.component.html',
  styleUrls: ['./dynamic-search.component.scss'],
})
export class DynamicSearchComponent implements OnInit, DoCheck {
  @Input() entityName?: string;
  @Input() preFillFilters?: Filter[];
  @Input() isShowSearchByHeader?: boolean = true;
  @Input() isShowPrefillCriteria?: boolean = true;
  @Input() isOptionalParameterHidden?: boolean = false;
  @Input() isDisplayPrefillCriteriaModal?: boolean = true;
  @Input() isShowSaveSearchCriteria?: boolean = true;
  @Input() mandatoryParametersColSize?: string = '6';
  @Input() optionalParametersColSize?: string = '3';
  @Input() isHideActionFooter?: boolean = false;
  @Input() cardHeight?: string = '480';

  isAllOptionalParameters: boolean = false;
  isAllMandatoryParameters: boolean;

  @Output() onSearch = new EventEmitter<Filter[]>();
  @Output() onFiltersReady = new EventEmitter<void>();

  @Output() isFormValid = new EventEmitter<boolean>();

  @Input() genericFilterList: GenericFilter[];
  suggestions?: Filter[] = [];

  genericMandatoryFilters: GenericFilter[];
  mandatoryFilters: Filter[];
  genericOptionalFilters: GenericFilter[];
  optionalFilters: Filter[] = [];
  selectedOptions: string[] = [];

  isShowSearchModal: boolean;
  isShowSearchModalOfMandatoryList: boolean;
  searchFilter: GenericFilter;
  searchFilterIndex: number;

  isShowSaveSearchCriteriaModal: boolean;
  isUpdateCriteria: boolean;
  criteriaData: string;
  isShowPrefillCriteriaModal: boolean;
  @ViewChild('saveCriteria') saveCriteria: any;
  @Output('onSaveCriteria') onSaveCriteria = new EventEmitter<void>();
  @ViewChild('mandatoryFiltersForm') mandatoryFiltersForm: NgForm;

  constructor(
    private menuService: MenuService,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  ngDoCheck(): void {
    if (
      this.mandatoryFiltersForm &&
      this.mandatoryFiltersForm.valid &&
      this.isValidOptionalForm()
    ) {
      this.isFormValid.emit(true);
      if (this.isHideActionFooter) {
        this.onSearch.emit(this.getFilters());
      }
    } else {
      this.isFormValid.emit(false);
    }
  }

  ngOnInit(): void {
    if (this.genericFilterList && this.genericFilterList.length > 0)
      this.generateFilters(this.genericFilterList);
    else this.getGenericFilters();
  }

  getGenericFilters(): void {
    this.entityName = this.entityName ? this.entityName : this.menuService.getSelectedEntityName();

    const url = 'commons/filterService/private/getGenericFilters';
    const data = { entityName: this.entityName };
    this.httpService.httpPost(url, data).subscribe((response: any) => {
      this.genericFilterList = response.genericFilterAttributes;
      this.generateFilters(response.genericFilterAttributes, response.suggestions);
    });
  }

  generateFilters(genericFilterList: GenericFilter[], suggestions?: Filter[]): void {
    this.genericFilterList = genericFilterList;

    let mandatoryParameters = 0;
    let optionalParameters = 0;

    genericFilterList.forEach((filter: any) => {
      if (filter.mandatory) {
        mandatoryParameters++;
      } else {
        optionalParameters++;
      }
    });

    if (mandatoryParameters === 0) {
      this.isAllOptionalParameters = true;
    }

    if (optionalParameters === 0) {
      this.isAllMandatoryParameters = true;
    }

    this.suggestions = suggestions;
    this.generateSearchByOptions();
    this.onFiltersReady.emit();
  }

  generateSearchByOptions(): void {
    this.selectedOptions = [];
    this.genericMandatoryFilters = [];
    this.mandatoryFilters = [];
    this.genericOptionalFilters = [];
    this.optionalFilters = [];
    this.genericFilterList.forEach((genericFilter: GenericFilter, index: number) => {
      if (genericFilter.mandatory) {
        {
          this.genericMandatoryFilters.push(_.cloneDeep(genericFilter));
          this.mandatoryFilters.push(this.getFilterByGenericFilter(_.cloneDeep(genericFilter)));

          if (genericFilter.fieldType == 'SELECT' && this.isValidBasedOn(genericFilter.basedOn)) {
            this.updateSelectList(_.cloneDeep(genericFilter), index).subscribe(
              (filter: GenericFilter) => {
                const index = filter['index'];
                if (index != undefined && index >= 0) {
                  this.genericMandatoryFilters[index] = _.cloneDeep(filter);
                  this.mandatoryFilters[index] = this.getFilterByGenericFilter(
                    _.cloneDeep(genericFilter),
                    this.mandatoryFilters[index],
                  );
                }
              },
            );
          }
        }
      }
    });
  }

  updateSelectList(filter: GenericFilter, index: number): Observable<GenericFilter> {
    let response = new Subject<GenericFilter>();
    this.httpService.httpPost(filter.url, filter.urlData).subscribe((res: any) => {
      filter.selectList = res.dataList;
      filter['index'] = index;
      response.next(filter);
      response.complete();
    });
    return response.asObservable();
  }

  isValidBasedOn(basedOn: string): boolean {
    if (!basedOn) return true;

    let valid: boolean = false;
    const basedOns = basedOn.split(',');

    for (let i = 0; i < basedOns.length; i++) {
      let filter = _.filter(this.mandatoryFilters, function (o) {
        return o.name == basedOns[i];
      });

      if (!filter) {
        filter = _.filter(this.optionalFilters, function (o) {
          return o.name == basedOns[i];
        });
      }

      valid =
        filter.length > 0 &&
        filter[0].value &&
        filter[0].value != '' &&
        filter[0].value != null &&
        filter[0].value != undefined;

      if (!valid) {
        break;
      }
    }

    return valid;
  }

  getFilterByGenericFilter(genericFilter: GenericFilter, filter?: Filter): Filter {
    return {
      name: genericFilter.name,
      displayName: genericFilter.displayName,
      type: genericFilter.type,
      value: filter ? filter.value : '',
      value1: filter ? filter.value1 : '',
      extraValue: filter ? filter.extraValue : '',
      operator: genericFilter.rangeFilter ? 'BETWEEN' : '',
      displayValue: filter ? filter.displayValue : '',
    };
  }

  fillFilter(filter: Filter): void {
    let index = _.findIndex(this.mandatoryFilters, function (f: Filter) {
      return f.name == filter.name;
    });
    let listFilter: Filter = null;
    if (index !== -1) {
      listFilter = this.mandatoryFilters[index];
    } else {
      index = _.findIndex(this.optionalFilters, function (f: Filter) {
        return f.name == filter.name;
      });
      if (index !== -1) {
        listFilter = this.optionalFilters[index];
      }
    }

    if (listFilter) {
      listFilter.value = filter.value;
      listFilter.value1 = filter.value1;
      listFilter.displayValue = filter.displayValue;
      this.updateBasedOn(listFilter);
    }

    if (listFilter && listFilter.type == 'Date' && listFilter.operator == 'BETWEEN') {
      listFilter.extraValue = filter.displayValue;
    }

    if (!listFilter) {
      if (this.selectedOptions.indexOf(filter.name) == -1) {
        this.selectedOptions.push(filter.name);
        this.updateOptionalFilters();
        setTimeout(() => {
          this.fillFilter(filter);
        }, 500);
      } else {
        this.fillFilter(filter);
      }
    }
  }

  updateDisplayValue(index: number, isMandatoryFiltersList: boolean) {
    let filter = isMandatoryFiltersList
      ? this.mandatoryFilters[index]
      : this.optionalFilters[index];
    if (filter.operator && filter.operator == 'BETWEEN' && filter.type !== 'Date') {
      filter.displayValue = filter.value + ' - ' + filter.value1;
    } else if (filter.operator && filter.operator == 'BETWEEN' && filter.type == 'Date') {
      if (filter.extraValue) {
        if (typeof filter.extraValue === 'string') {
          filter.value = filter.extraValue.split(' - ')[0];
          filter.value1 = filter.extraValue.split(' - ')[1];
          filter.displayValue = filter.extraValue;
        } else {
          filter.value = filter.extraValue[0];
          filter.value1 = filter.extraValue[1];
          filter.displayValue = filter.extraValue.join(' - ');
        }
      }
    } else filter.displayValue = filter.value;
  }

  updateSelectDisplayValue(data: Select, index?: number, isMandatoryFiltersList?: boolean) {
    let filter = isMandatoryFiltersList
      ? this.mandatoryFilters[index]
      : this.optionalFilters[index];
    filter.displayValue = data ? data.displayName : '';
  }

  updateOptionalFilters(): void {
    const selectedOptions = _.cloneDeep(this.selectedOptions)
      ? _.cloneDeep(this.selectedOptions)
      : '';
    this.optionalFilters = _.filter(this.optionalFilters, function (o: Filter) {
      return selectedOptions.indexOf(o.name) !== -1;
    });

    this.genericOptionalFilters = _.filter(this.genericOptionalFilters, function (o) {
      return selectedOptions.indexOf(o.name) !== -1;
    });

    this.genericFilterList.forEach((genericFilter: GenericFilter, index: number) => {
      if (
        selectedOptions.indexOf(genericFilter.name) !== -1 &&
        !_.find(this.optionalFilters, { name: genericFilter.name })
      ) {
        this.genericOptionalFilters.push(_.cloneDeep(genericFilter));
        this.optionalFilters.push(this.getFilterByGenericFilter(_.cloneDeep(genericFilter)));

        if (genericFilter.fieldType == 'SELECT' && this.isValidBasedOn(genericFilter.basedOn)) {
          this.updateSelectList(
            _.cloneDeep(genericFilter),
            selectedOptions.indexOf(genericFilter.name),
          ).subscribe((filter: GenericFilter) => {
            const index = filter['index'];
            if (index != undefined && index >= 0) {
              this.genericOptionalFilters[index] = _.cloneDeep(filter);
              this.optionalFilters[index] = this.getFilterByGenericFilter(
                _.cloneDeep(genericFilter),
                this.optionalFilters[index],
              );
            }
          });
        }
      }
    });
  }

  removeOptionalFilter(name: string): void {
    this.selectedOptions = _.remove(this.selectedOptions, function (f: string) {
      return f !== name;
    });
    this.updateOptionalFilters();
  }

  showSearchModal(
    searchFilter?: GenericFilter,
    searchFilterIndex?: number,
    isMandatoryFiltersList?: boolean,
  ): void {
    this.searchFilter = searchFilter;
    this.searchFilterIndex = searchFilterIndex;
    this.isShowSearchModalOfMandatoryList = isMandatoryFiltersList;
    this.isShowSearchModal = true;
  }

  onSearchFieldSelected(selectedRow: any) {
    let list = this.isShowSearchModalOfMandatoryList ? this.mandatoryFilters : this.optionalFilters;
    list[this.searchFilterIndex].value =
      selectedRow[this.searchFilter.searchResultFields.split(',')[0]];
    list[this.searchFilterIndex].displayValue =
      selectedRow[this.searchFilter.searchResultFields.split(',')[1]];
    this.updateBasedOn(list[this.searchFilterIndex]);
  }

  updateBasedOn(filter: Filter): void {
    if (filter.value) {
      this.genericMandatoryFilters.forEach((gmf: GenericFilter, mainIndex: number) => {
        const basedOns = gmf.basedOn ? gmf.basedOn.split(',') : [];
        basedOns.forEach((basedOn: string, index: number) => {
          if (basedOn == filter.name) {
            const fillFilterName = gmf.fillFilterName
              ? gmf?.fillFilterName.split(',')[index]
              : [filter?.name][index];
            gmf?.urlData?.filters.forEach((f: Filter) => {
              if (f.name == fillFilterName) {
                f.value = filter.value;
              }
            });
            this.updateSelectListAfterBasedOn(mainIndex, true);
          }
        });
      });

      this.genericOptionalFilters.forEach((gof: GenericFilter, mainIndex: number) => {
        const basedOns = gof.basedOn ? gof.basedOn.split(',') : [];
        basedOns.forEach((basedOn: string, index: number) => {
          if (basedOn == filter.name) {
            const fillFilterName = gof.fillFilterName
              ? gof.fillFilterName.split(',')[index]
              : [filter.name][index];
            gof.urlData.filters.forEach((f: Filter) => {
              if (f.name == fillFilterName) {
                f.value = filter.value;
              }
            });
            this.updateSelectListAfterBasedOn(mainIndex, true);
          }
        });
      });
    }
  }

  updateSelectListAfterBasedOn(index: number, isMandatoryFiltersList: boolean) {
    let list = isMandatoryFiltersList ? this.genericMandatoryFilters : this.genericOptionalFilters;
    if (list[index].fieldType == 'SELECT' && this.isValidBasedOn(list[index].basedOn)) {
      this.updateSelectList(list[index], index).subscribe((newFilter: GenericFilter) => {
        list[index] = newFilter;
      });
    }
  }

  isValidOptionalForm(): boolean {
    let valid = true;
    for (let i = 0; i < this.optionalFilters.length; i++) {
      if (!this.optionalFilters[i].value) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  getFilters(): Filter[] {
    return _.union(this.mandatoryFilters, this.optionalFilters);
  }

  showSaveSearchCriteriaModal(): void {
    this.criteriaData = JSON.stringify(this.getFilters());
    this.isShowSaveSearchCriteriaModal = true;
  }

  onSavedCriteria(): void {
    this.onSaveCriteria.emit();
  }

  onFillCriteria(criteria: Criteria): void {
    this.onReset();
    const filters: Filter[] = JSON.parse(criteria.criteria);

    filters.forEach((filter: Filter) => {
      this.fillFilter(filter);
    });
    this.isUpdateCriteria = true;
  }

  onReset(): void {
    this.isUpdateCriteria = false;
    this.generateSearchByOptions();
  }

  onSearchClick(): void {
    this.onSearch.emit(this.getFilters());
  }
}
