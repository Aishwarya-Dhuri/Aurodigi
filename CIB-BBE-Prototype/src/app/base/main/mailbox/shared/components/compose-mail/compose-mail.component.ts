import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../services/common.service';
import { CKEDITOR_CONFIGRATION } from './ckEditor-configration.constants';
import { TINYMCE_DEFAULT_CONFIG, TINYMCE_DEFAULT_TEXT_CONFIG } from './tinymce-default';
import { cloneDeep } from 'lodash';
import { ComposeMail } from './@models/composeMail';
import { HttpService } from 'src/app/shared/@services/http.service';
import { ToasterService } from 'src/app/shared/@services/toaster.service';
import { UserService } from 'src/app/shared/@services/user.service';
import { UserDetails } from 'src/app/base/@models/user.details';

@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss'],
})
export class ComposeMailComponent implements OnInit {
  @ViewChild('selectedAttachments') attachmentsRef: ElementRef;
  @Input() isMailMode: boolean;
  @Input() isMailType: string = 'New Message';
  @Input() viewMail: any;

  userDetails: UserDetails;
  formData: ComposeMail;

  categoryArray: any[];
  subCategoryArray: any[];
  mailToArray: any[];
  mailCcArray: any[];
  attachments: any[] = [];
  maxFileSize: number = 500;
  fileFormat: any[] = ['PDF', 'JPEG', 'JPG'];
  submitted: boolean = false;
  config = CKEDITOR_CONFIGRATION;

  editorInitConfig: any = cloneDeep(TINYMCE_DEFAULT_CONFIG);
  plainEditorInitConfig: any = cloneDeep(TINYMCE_DEFAULT_TEXT_CONFIG);

  constructor(
    public userService: UserService,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private httpService: HttpService,
    private toasterService: ToasterService,
  ) {
    this.userService.getUserDetails().subscribe((userDetails: UserDetails) => {
      this.userDetails = userDetails;
    });
  }

  ngOnInit(): void {
    this.formInitilization();
    this.getCategoryList();
    this.getMailEditMode();
  }

  formInitilization() {
    this.formData = new ComposeMail();
    if (this.commonService.requestBy == 'CFE') {
      this.getMailCorpoateList();
    } else {
      this.getMailBankList();
    }
  }

  getCategoryList() {
    this.commonService.getCategory().subscribe((data) => {
      this.categoryArray = data.dataList;
    });
  }

  getSubCategoryList(p) {
    console.log(p);
  }

  getMailCorpoateList(type?: string) {
    this.commonService.getMailCorporate().subscribe((data) => {
      if (!type) {
        this.mailToArray = data.dataList;
        this.mailCcArray = data.dataList;
      } else {
        this.formData[type] = '';
        this[`${type}Array`] = data.dataList;
      }
    });
  }

  getMailBankList(type?: string) {
    this.commonService.getMailBank().subscribe((data) => {
      if (!type) {
        this.mailToArray = data.dataList;
        this.mailCcArray = data.dataList;
      } else {
        this.formData[type] = '';
        this[`${type}Array`] = data.dataList;
      }
    });
  }

  getConveredMailId(mailType: string) {
    let convertedArray: any[] = [];

    const n = this.formData[mailType].length;

    for (let i = 0; i < n; i++) {
      const mail = this[`${mailType}Array`].find((m: any) => m.id == this.formData[mailType][i]);
      if (mail) {
        convertedArray.push({
          id: mail.id,
          order: i + 1,
          userFrom: mail.enrichments.userFrom,
          firstName: mail.displayName,
          userCategory: mail.enrichments.category,
          emailAddress: mail.enrichments.emailAddress,
        });
      }
    }

    return convertedArray;
  }

  composeMail(type?: string) {
    this.submitted = true;
    // if (this.composeMailForm.valid) {
    let mailData = {
      ...this.formData,
      mailTo: this.getConveredMailId('mailTo'),
      mailCc: this.getConveredMailId('mailCc'),
      fromUserId: this.userDetails.userId,
      fromUserName: this.userDetails.fullName,
      fromUserImage: this.userDetails.profilePicUrl,
      copyToRm: this.formData.copyToRm,
      mailBody: this.formData.message,
      subject: this.formData.subject,
      // corporateName: this.userDetails.corporateName,
      lastAction: 'SEND', //this.isMailType,
      attachment: this.attachments,
      attachmentFiles: this.attachments.length,
      parentMailId: '', //Last mail Id From Mail Chain
      firstParentId: '', //First mail Id From Mail Chain
      channel: 'WEB',
      selectedCorporateId: '', // CFE its Should blank and BBE Send from UI
    };
    if (type == 'draft') {
      mailData.lastAction = 'DRAFT';
      mailData.isDraft = true;
      this.httpService
        .httpPost('commons/emailServices/private/create', mailData)
        .subscribe((response: any) => {
          console.log(response);

          this.toasterService.showToaster({
            severity: 'success',
            detail: 'Your message has been successfully draft',
          });

          this.resetCompose();
          this.submitted = false;
        });
    } else {
      mailData.mailStatus = 'send';
      this.httpService
        .httpPost('commons/emailServices/private/create', mailData)
        .subscribe((response: any) => {
          console.log(response);

          this.toasterService.showToaster({
            severity: 'success',
            detail: 'Your message has been successfully sent',
          });
          this.resetCompose();
          this.submitted = false;
        });
    }
  }

  getMailEditMode() {
    if (this.isMailMode) {
      this.formData.category = this.viewMail.category;
      this.formData.subCategory = this.viewMail.subCategory;
      this.formData.copyToRm = this.viewMail.copyToRm;
      this.formData.subject = this.viewMail.subject;
    }
  }

  addAttachments(event: any) {
    if (event.target.files.length > 0) {
      /* File Type */
      let fileExtArray = event.target.files[0].name.split('.');
      let fileExtension = fileExtArray[fileExtArray.length - 1].toUpperCase();
      if (!this.fileFormat.includes(fileExtension)) {
        let errorMsg = `File type ${this.fileFormat[0]} and ${this.fileFormat[1]} permitted`;
        this.commonService.errorToaster(errorMsg);
        this.attachmentsRef.nativeElement.value = '';
        return;
      }
      /* File Size */
      if (this.formatFileSize(event.target.files[0].size) > this.maxFileSize) {
        let errorMsg = `File size should not be greater than ${this.maxFileSize}`;
        this.commonService.errorToaster(errorMsg);
        this.attachmentsRef.nativeElement.value = '';
        return;
      }
      this.handleFileSelect(event);
      this.attachmentsRef.nativeElement.value = '';
    }
  }

  /* Convert Attachment to  Base64*/
  handleFileSelect(evt: any) {
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.attachments.push({
        fileSize: file.size,
        originalFileName: file.name,
        fileContent: reader.result,
      });
    };
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  formatFileSize(bytes: number) {
    if (bytes == 0) return '0';
    let i = Math.floor(Math.log(bytes) / Math.log(1000));
    return parseFloat((bytes / Math.pow(1000, i)).toFixed(2));
  }

  deleteAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  resetCompose() {
    this.formData = new ComposeMail();
    this.attachments = [];
  }

  /* confirmDiscardMail() {
    let dialogObj = {
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'far fa-trash-alt',
      accept: 'discardMail',
      reject: 'closeDialog',
    };
    this.commonService.isShowConfirmDialog.next(dialogObj);
  } */
}
