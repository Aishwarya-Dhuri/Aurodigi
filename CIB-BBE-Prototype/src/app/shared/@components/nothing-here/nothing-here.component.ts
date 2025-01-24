import { Component, Input, OnInit } from '@angular/core';
import { ViewportService } from '../../@services/viewport.service';

@Component({
  selector: 'app-nothing-here',
  templateUrl: './nothing-here.component.html',
  styleUrls: ['./nothing-here.component.scss'],
})
export class NothingHereComponent implements OnInit {
  @Input() message: string;
  @Input() messageClasses?: string;
  @Input() colSize?: number;
  @Input() headingClasses?: string;

  colClass: string;

  constructor(private viewportService: ViewportService) {}

  ngOnInit(): void {
    this.viewportService.getViewport().subscribe((viewport: string) => {
      if (viewport !== 'web') {
        this.colClass = 'p-col-8';
      } else {
        this.colSize = this.colSize ? this.colSize : 2;
        this.colClass = 'p-col-' + this.colSize;
      }
    });
    this.colSize = this.colSize ? this.colSize : 2;
    this.colClass = 'p-col-' + this.colSize;
    this.messageClasses = this.messageClasses
      ? this.messageClasses
      : 'text-color-light-shade-1 text-size-16';
    this.headingClasses = this.headingClasses ? this.headingClasses : 'text-bold text-size-20';
  }
}
