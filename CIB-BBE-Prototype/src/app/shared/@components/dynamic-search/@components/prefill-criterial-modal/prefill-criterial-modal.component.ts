import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Criteria } from '../../@models/criteria.model';

@Component({
  selector: 'app-prefill-criterial-modal',
  templateUrl: './prefill-criterial-modal.component.html',
  styleUrls: ['./prefill-criterial-modal.component.scss'],
})
export class PrefillCriterialModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();

  @Input() entityName: string;

  @Output() onSelect = new EventEmitter<Criteria>();
  @Output() close = new EventEmitter<void>();

  criteriaList: Criteria[] = [];
  criteriaViewData: any = [];

  constructor(private menuService: MenuService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.entityName = this.entityName ? this.entityName : this.menuService.getSelectedEntityName();
    this.getCriteriaList();
  }

  getCriteriaList(): void {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = { dataMap: { entityName: this.entityName, criteriaType: 'QUERYSEARCH' } };

    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaList = response.dataMap.SearchCriteria;
      this.updateViewData();
    });
  }

  updateViewData(): void {
    this.criteriaViewData = [];
    this.criteriaList.forEach((criteria: Criteria) => {
      this.criteriaViewData.push({
        isShown: false,
        filters: JSON.parse(criteria.criteria),
      });
    });
  }

  showHideFilters(i: number): void {
    if (!this.criteriaViewData[i].isShown) {
      this.criteriaViewData.forEach((criteria: any) => {
        criteria.isShown = false;
      });
    }
    this.criteriaViewData[i].isShown = !this.criteriaViewData[i].isShown;
  }

  onClose() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.close.emit();
  }

  onDeleteClick(criteria: Criteria): void {
    const url = 'commons/searchCriteria/private/delete';
    //const data = { "id": criteria.id, "type": "SearchCriteria", "version": criteria.version };
    const data = { dataMap: { id: criteria.id } };
    this.httpService.httpPost(url, data).subscribe(() => {
      this.getCriteriaList();
    });
  }

  onSelectClick(criteria: Criteria) {
    this.onSelect.emit(criteria);
    this.onClose();
  }
}
