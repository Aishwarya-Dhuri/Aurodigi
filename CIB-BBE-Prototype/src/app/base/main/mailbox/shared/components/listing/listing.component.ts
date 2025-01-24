import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AgGridListingComponent } from 'src/app/shared/@components/ag-grid-listing/ag-grid-listing.component';
import { HttpService } from 'src/app/shared/@services/http.service';
import { CommonService } from '../../services/common.service';
import { AttachmentRendererComponent } from './@components/attachment-renderer/attachment-renderer.component';
import { DateTimeRendererComponent } from './@components/date-time-renderer/date-time-renderer.component';
import { MailRendererComponent } from './@components/mail-renderer/mail-renderer.component';

interface listing {
  entityName: string;
  headers: any[];
  dataList: any[];
  filters: any[];
  pageNumber: number;
  totalPages: number;
  totalRecords: number;
  links: any[];
}

@Component({
  selector: 'app-mailbox-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
})
export class ListingComponent implements OnInit, OnDestroy {
  listingData: listing;
  isListingShow: boolean = false;
  selectedMailsAllLinks: any = [];
  selectedMailsUniqueLinks: any = [];
  selectedMailsIds: any = [];
  listingItemLables: any = ['Star', 'UnStar', 'Read', 'UnRead'];
  listingItemIndexes: any = [4]; //['Attachment']
  actionIcons: any = ['fas fa-star', 'far fa-star'];
  mobileFilters: boolean = false;
  subscription: Subscription;

  @Input('rowDataUrl') rowDataUrl: string = 'commons/emailServices/private/getSendList';

  @ViewChild('listingGrid') mailListingGrid: AgGridListingComponent;

  loading: boolean;
  colDefUrl: string = 'commons/emailServices/private/colDefs';
  rowData: any[] = [];
  selectedRows: any[] = [];

  context: any = {
    componentParent: this,
  };

  frameworkComponents: any = {
    mailRenderer: MailRendererComponent,
    attachmentRenderer: AttachmentRendererComponent,
    dateTimeRenderer: DateTimeRendererComponent,
  };

  constructor(private commonService: CommonService, private httpService: HttpService) {
    this.subscription = this.commonService.isListingCall.subscribe((val) => {
      this.callMailListing();
    });
  }

  ngOnInit() {
    this.getListingData();
    this.callMailListing();
  }

  getListingData() {
    this.loading = true;
    this.httpService.httpPost(this.rowDataUrl).subscribe((response: any) => {
      this.rowData = response.data;
      this.loading = false;
    });
  }

  onRowSelected(selectedRow: any) {
    if (selectedRow.node.selected) {
      const data = this.selectedRows.find((id: string) => id == selectedRow.data.id);
      if (!data) {
        this.selectedRows.push(selectedRow.data.id);
      }
    } else {
      const index = this.selectedRows.findIndex((id: string) => id == selectedRow.data.id);
      if (index >= 0) {
        this.selectedRows.splice(index, 1);
      }
    }
  }

  downloadAttachments(id: string) {
    console.log(id);
    this.httpService.httpDownload('mailAttachments/sample.pdf');
  }

  openMail(id: string) {
    console.log(id);

    const data = this.rowData.find((d) => d.id == id);

    this.commonService.isViewCall.next(data);
  }

  markAsRead(id: string) {
    this.loading = true;

    this.httpService
      .httpPost('commons/emailServices/private/markAsRead', { dataMap: { id } })
      .subscribe((response: any) => {
        this.getListingData();
      });
  }
  markAllAsRead() {
    this.loading = true;

    this.httpService
      .httpPost('commons/emailServices/private/markAllAsRead', {
        dataMap: { ids: this.selectedRows },
      })
      .subscribe((response: any) => {
        this.selectedRows = [];
        this.getListingData();
      });
  }

  markAsStar(id: string) {
    this.loading = true;

    this.httpService
      .httpPost('commons/emailServices/private/markAsStar', { dataMap: { id } })
      .subscribe((response: any) => {
        this.getListingData();
      });
  }

  markAllAsStar(id: string) {
    this.loading = true;

    this.httpService
      .httpPost('commons/emailServices/private/markAllAsStar', {
        dataMap: { ids: this.selectedRows },
      })
      .subscribe((response: any) => {
        this.selectedRows = [];
        this.getListingData();
      });
  }

  deleteMail(id: string) {
    this.loading = true;

    this.httpService

      .httpPost('commons/emailServices/private/markAsDelete', { dataMap: { id } })
      .subscribe((response: any) => {
        this.selectedRows = [];
        this.getListingData();
      });
  }

  deleteAllMail(id: string) {
    this.loading = true;

    this.httpService
      .httpPost('commons/emailServices/private/markAllAsDelete', {
        dataMap: { ids: this.selectedRows },
      })
      .subscribe((response: any) => {
        this.getListingData();
      });
  }

  callMailListing() {
    this.commonService.getMailListing(this.commonService.isListingRequest).subscribe((data) => {
      this.isListingShow = false;
      setTimeout(() => {
        this.isListingShow = true;
      });
      console.log(data);
      this.listingData = data;
      this.mobileFilters = false;
    });
  }

  onRowSelect(data: string) {
    console.log(data);
    this.commonService.isViewCall.next(data[0]);
  }

  isAllRecordSelected(event: Event, isChecked: boolean) {
    this.selectedMailsIds = [];
    this.selectedMailsAllLinks = [];
    this.selectedMailsUniqueLinks = [];
    if (isChecked) {
      for (let i = 0; i < this.listingData.dataList.length; i++) {
        this.isSingleRecordSelected(
          event,
          true,
          this.listingData.dataList[i],
          this.listingData.links[i],
        );
      }
    }
  }

  isSingleRecordSelected(event: Event, isChecked: boolean, data: any, links: any) {
    event.stopPropagation();
    if (isChecked) {
      this.selectedMailsIds.push(data[0]);
      this.selectedMailsAllLinks.push(links);
    } else {
      const mailIndex = this.selectedMailsIds.indexOf(data[0]);
      this.selectedMailsIds.splice(mailIndex, 1);
      this.selectedMailsAllLinks.splice(mailIndex, 1);
    }
    this.selectedMailsUniqueLinks = this.sortActionLinks(this.selectedMailsAllLinks);
  }

  customSort(event: SortEvent) {
    console.log(event);
  }

  sortActionLinks(selectedMailsAllLinks: any) {
    let selectedMailsLinks: any = [];
    for (let i = 0; i < selectedMailsAllLinks.length; i++) {
      for (let j = 0; j < selectedMailsAllLinks[i].length; j++) {
        selectedMailsLinks.push(selectedMailsAllLinks[i][j]);
      }
    }

    let unqiueLinks = selectedMailsLinks.filter(
      (item: any, index: number, self: any) =>
        index === self.findIndex((t: any) => t.displayName === item.displayName),
    );

    let filterMailsLinks: any = [];
    for (let k = 0; k < unqiueLinks.length; k++) {
      let readIndex = unqiueLinks.findIndex(
        (x: any) => x.displayName === this.listingItemLables[3],
      );
      let starIndex = unqiueLinks.findIndex(
        (x: any) => x.displayName === this.listingItemLables[1],
      );

      if (unqiueLinks[k].displayName == this.listingItemLables[3]) {
        filterMailsLinks.push(unqiueLinks[k]);
      } else if (unqiueLinks[k].displayName == this.listingItemLables[2]) {
        if (readIndex < 0) {
          filterMailsLinks.push(unqiueLinks[k]);
        }
      } else if (unqiueLinks[k].displayName == this.listingItemLables[1]) {
        let copyUnqiueLinks = { ...unqiueLinks[k] };
        copyUnqiueLinks.icon = this.actionIcons[0];
        filterMailsLinks.push(copyUnqiueLinks);
      } else if (unqiueLinks[k].displayName == this.listingItemLables[0]) {
        if (starIndex < 0) {
          let copyUnqiueLinks = { ...unqiueLinks[k] };
          copyUnqiueLinks.icon = this.actionIcons[1];
          filterMailsLinks.push(copyUnqiueLinks);
        }
      } else {
        filterMailsLinks.push(unqiueLinks[k]);
      }
    }
    let sortMailLinks = filterMailsLinks.sort((a: any, b: any) => a.index - b.index);
    return sortMailLinks;
  }

  checkUnReadMail(dataArray: any) {
    return dataArray.some((data: any) => data.displayName == this.listingItemLables[3]);
  }

  downloadAttachment(event: any, url: string) {
    event.stopPropagation();
    //return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
