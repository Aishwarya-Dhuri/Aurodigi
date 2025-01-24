import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuService } from 'src/app/base/main/@services/menu.service';
import { HttpService } from '../../@services/http.service';

@Component({
  selector: 'app-draft-list-modal',
  templateUrl: './draft-list-modal.component.html',
  styleUrls: ['./draft-list-modal.component.scss'],
})
export class DraftListModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();
  @Output() onOpenDraft = new EventEmitter<any>();

  colDefUrl: string = 'commons/draftService/private/draftColDefs';
  rowDefUrl: string;

  constructor(private httpService: HttpService, private menuService: MenuService) {}

  ngOnInit(): void {
    this.rowDefUrl = this.menuService.getSelectedServiceUrl() + '/private/getDraftList';
  }

  onSelection(data: any): void {
    const viewData = { dataMap: { id: data.id } };
    this.httpService
      .httpPost(this.menuService.getSelectedServiceUrl() + '/private/viewDraft', viewData)
      .subscribe((viewResponse: any) => {
        this.isShow = false;
        this.isShowChange.emit(this.isShow);
        this.onOpenDraft.emit(viewResponse);
      });
  }
}
