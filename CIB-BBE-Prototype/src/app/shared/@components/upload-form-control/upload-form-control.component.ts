import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'upload-form-control',
  templateUrl: './upload-form-control.component.html',
  styleUrls: ['./upload-form-control.component.scss'],
})
export class UploadFormControlComponent implements OnInit {
  @Input() url: string;
  @Input() isMultiple: boolean;
  @Input() isHideUploadList: boolean;
  @Input() files: any[];
  @Input() hideDragDropContainerOnFIleUpload?: boolean = false;
  @Input() hideNoFileMessage?: boolean = false;

  @Output() onSelected = new EventEmitter<any>();
  @Output() onUploaded = new EventEmitter<any>();

  constructor() {
    if (!this.files) {
      this.files = [];
    }
  }

  ngOnInit(): void {}

  /**
   * on file drop handler
   */
  onFileDropped(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.prepareFilesList(files);
    }
  }

  onFileDrapoverAndLeave($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
    this.onUploaded.emit(this.files);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    //do file upload
    setTimeout(() => {
      if (index === this.files.length) {
        this.onUploaded.emit(this.files);
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            this.files[index].fileName = this.files[index].name;
            //this.files[index].sysFileName = 'sys10051991_' + this.files[index].name;
            this.files[index].status = 'Complete';
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 100);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.status = 'Uploading';
      item.fileName = item.name;
      item.fileSize = item.size;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
    this.onSelected.emit(this.files);
  }
}
