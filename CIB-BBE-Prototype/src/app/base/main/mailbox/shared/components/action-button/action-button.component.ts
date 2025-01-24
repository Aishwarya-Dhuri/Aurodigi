import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrls: ['./action-button.component.scss'],
})
export class ActionButtonComponent implements OnInit {
  @Input() actionBtnArray: any;
  @Input() selectedIdArray: any;
  @Output() replyforwardClicked = new EventEmitter<string>();
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  allActionBtn(eventType: string) {
    switch (eventType) {
      case 'Delete':
        this.deleteMail();
        break;
      case 'Read':
        this.markAsUnRead();
        break;
      case 'markAsUnRead':
        this.markAsUnRead();
        break;
      case 'markAsStar':
        this.markAsStar();
        break;
      case 'UnStar':
        this.markAsStar();
        break;
      case 'printMail':
        this.printMail();
        break;
      case 'replyMail':
        this.replyMail();
        break;
      case 'forwardMail':
        this.forwardMail();
        break;

      default:
        break;
    }
  }

  markAsRead() {
    this.commonService.setMarkAsRead(this.selectedIdArray).subscribe((response) => {
      console.log(response);
    });
  }

  markAsUnRead() {
    this.commonService.setMarkAsUnread(this.selectedIdArray).subscribe((response) => {
      console.log(response);
    });
  }

  markAsStar() {
    this.commonService.setMarkAsStared(this.selectedIdArray).subscribe((response) => {
      console.log(response);
    });
  }

  markAsUnStar() {
    this.commonService.setMarkAsUnStared(this.selectedIdArray).subscribe((response) => {
      console.log(response);
    });
  }

  printMail() {
    alert('printMail');
    const printContent: any = document.getElementById('componentID');
    const WindowPrt: any = window.open(
      '',
      '',
      'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0',
    );
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  replyMail() {
    this.replyforwardClicked.emit('Reply');
  }

  forwardMail() {
    this.replyforwardClicked.emit('Forward');
  }

  deleteMail() {
    let dialogObj = {
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'far fa-trash-alt',
      accept: 'discardMail',
      reject: 'closeDialog',
      seletedIds: this.selectedIdArray,
    };
    this.commonService.isShowConfirmDialog.next(dialogObj);
  }
}
