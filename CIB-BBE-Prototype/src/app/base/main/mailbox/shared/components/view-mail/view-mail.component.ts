import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-view-mail',
  templateUrl: './view-mail.component.html',
  styleUrls: ['./view-mail.component.scss'],
})
export class ViewMailComponent implements OnInit, OnDestroy {
  viewMail: any;
  isMailMode: boolean = false;
  isMailType: string;
  subscription: Subscription;

  constructor(private commonService: CommonService, private sanitizer: DomSanitizer) {
    this.callView();
  }

  ngOnInit() {}

  callView() {
    this.subscription = this.commonService.isViewCall
      .pipe(
        mergeMap((mailId) => {
          console.log(mailId);
          return this.commonService.getMailDetails(mailId.id);
        }),
      )
      .subscribe((response) => {
        console.log(response);
        this.viewMail = response.data;
      });
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  formatFileSize(bytes: number) {
    if (bytes == 0) return '0';
    var i = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, i)).toFixed(2));
  }

  replyforwardClicked(valueEmitted: string) {
    this.isMailMode = true;
    this.isMailType = valueEmitted;
  }

  replyMail() {
    this.isMailMode = true;
    this.isMailType = 'Reply';
  }

  forwardMail() {
    this.isMailMode = true;
    this.isMailType = 'Forward';
  }

  backToListing() {
    this.commonService.isViewCall.next(null);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
