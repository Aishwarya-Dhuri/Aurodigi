import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from 'src/app/shared/@services/http.service';
import { Criteria } from '../../@models/criteria.model';

@Component({
  selector: 'app-save-criterial-modal',
  templateUrl: './save-criterial-modal.component.html',
  styleUrls: ['./save-criterial-modal.component.scss'],
})
export class SaveCriterialModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();

  @Input() isUpdate: boolean;
  @Output() isUpdateChange = new EventEmitter<boolean>();

  @Input() entityName: string;
  @Input() criteriaType: string;
  @Input() criteria: string;

  @Output() onSave = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  criteriaData: Criteria = new Criteria();
  criteriaList: any[];

  constructor(private menuService: MenuService, private httpService: HttpService) {}

  ngOnInit(): void {
    this.criteriaData.name = '';
    this.criteriaData.description = '';
    this.criteriaData.type = 'SearchCriteria';
    this.criteriaData.criteriaType = this.criteriaType || 'QUERYSEARCH';
    this.criteriaData.entityName = this.entityName
      ? this.entityName
      : this.menuService.getSelectedEntityName();
  }

  setCriteriaData(criteriaData: Criteria): void {
    this.criteriaData = criteriaData;
  }

  onClose() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.close.emit();
  }

  onSubmit() {
    this.criteriaData.criteria = this.criteria;
    if (!this.isUpdate) {
      this.criteriaData.version = '0';
    }
    const url = this.isUpdate
      ? 'commons/searchCriteria/private/update'
      : 'commons/searchCriteria/private/create';
    this.httpService.httpPost(url, this.criteriaData).subscribe(() => {
      this.getCriterias(true);
    });
  }

  getCriterias(isUpdate: boolean) {
    const getCriteriaUrl = 'commons/searchCriteria/private/getCriterias';
    const data = {
      dataMap: {
        entityName: this.criteriaData.entityName,
        criteriaType: this.criteriaData.criteriaType,
      },
    };
    this.httpService.httpPost(getCriteriaUrl, data).subscribe((response: any) => {
      this.criteriaData =
        response.dataMap.SearchCriteria[response.dataMap.SearchCriteria.length - 1];
      this.criteriaList = response.dataMap.SearchCriteria;
      this.isUpdate = isUpdate;
      this.isUpdateChange.emit(this.isUpdate);
      this.isShow = false;
      this.isShowChange.emit(this.isShow);
      this.onSave.emit();
    });
  }
}
