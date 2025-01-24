import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-attachment-modal',
  templateUrl: './attachment-modal.component.html',
  styleUrls: ['./attachment-modal.component.scss'],
})
export class AttachmentModalComponent implements OnInit {
  @Input() isShow: boolean;
  @Output() isShowChange = new EventEmitter<boolean>();

  @Input() files?: any[];
  @Output() submit = new EventEmitter<any[]>();

  isLoaded: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.files = this.files && this.files.length > 0 ? this.files : [];
  }

  onFileUploaded(files: any): void {
    this.files = files;
  }

  reset(): void {
    this.files = [];
    this.isLoaded = false;
    setTimeout(() => {
      this.isLoaded = true;
    }, 10);
  }

  onSubmit() {
    this.isShow = false;
    this.isShowChange.emit(this.isShow);
    this.submit.emit(this.files);
  }
}
