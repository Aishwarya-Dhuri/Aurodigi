import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-mailbox-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  providers: [MessageService],
})
export class ToasterComponent implements OnInit {
  @Input() toasterType: string;
  constructor(private messageService: MessageService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.callToaster();
  }

  callToaster() {
    this.commonService.isShowToaster.subscribe((data) => {
      this.showMessage(data);
    });
  }

  showMessage(data: any) {
    this.messageService.add({
      key: 'tc',
      severity: data.severity,
      summary: data.summary,
      detail: data.detail,
    });
  }
}
