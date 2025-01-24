import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';

@Component({
  selector: 'app-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
})
export class MailsComponent implements OnInit {
  showMailbox: boolean = false;

  mails: any[] = [];

  @Output() close = new EventEmitter<void>();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService
      .httpPost('commons/emailServices/private/getUnreadList')
      .subscribe((response: any) => {
        console.log(response);
        this.mails = response.data;
      });
  }

  closeSidebar() {
    this.close.emit();
  }
}
