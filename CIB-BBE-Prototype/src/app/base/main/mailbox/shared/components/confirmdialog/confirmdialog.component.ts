import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.scss'],
  providers: [],
})
export class ConfirmdialogComponent implements OnInit {
  position: string = 'top';

  showConfirmModel: boolean = false;
  confirmData: any;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.callConfirmDialog();
  }

  callConfirmDialog() {
    this.commonService.isShowConfirmDialog.subscribe((data: any) => {
      this.confirmData = data;
      this.showConfirmModel = true;
    });
  }

  reject() {
    this.confirmData = null;
    this.showConfirmModel = false;
  }

  confirm() {
    this[this.confirmData.accept](this.confirmData.seletedIds);
  }

  discardMail(ids: any) {
    this.commonService.setMarkDelete(ids).subscribe((res) => {
      console.log(res);
    });
  }
}
