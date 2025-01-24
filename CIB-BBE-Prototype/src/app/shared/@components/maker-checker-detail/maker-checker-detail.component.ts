import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-maker-checker-detail',
  templateUrl: './maker-checker-detail.component.html',
  styleUrls: ['./maker-checker-detail.component.scss'],
})
export class MakerCheckerDetailComponent implements OnInit {
  @Input() formData: any;
  @Input() classes: string;
  @Input() isShowOnlyValues?: boolean;

  constructor() {}

  ngOnInit(): void {
    if (!this.isShowOnlyValues) this.classes = this.classes ? this.classes + ' aps-card' : '';
  }
}
