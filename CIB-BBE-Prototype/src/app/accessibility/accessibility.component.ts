import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessibilityConfig } from './@models/accessibility.model';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
})
export class AccessibilityComponent implements OnInit, OnDestroy {
  isShowAccessibilityModal: boolean;
  accessibilityConfig: AccessibilityConfig = new AccessibilityConfig();
  isBigWhiteCursor: boolean = false;
  isBigBlackCursor: boolean = false;
  isReadingGuide: boolean;
  cursorTop: any;
  cursorLeft: any;
  readingGuideLeft: any;
  readingGuideTop: any;
  isLoggedInUser: boolean = true;

  offsetX: number = 0;
  offsetY: number = 0;

  constructor() {
    if (JSON.parse(localStorage.getItem('accessibility'))) {
      this.accessibilityConfig = JSON.parse(localStorage.getItem('accessibility'));
    } else {
      this.accessibilityConfig = new AccessibilityConfig();
    }
  }

  ngOnInit(): void {}

  @HostListener('document:mousemove', ['$event'])
  onMousemove($event: any): void {
    if (this.isReadingGuide) {
      this.readingGuideTop = $event.pageY - 20 + 'px';
      const windowWidth = window.innerWidth;
      if (windowWidth - 205 > $event.pageX && $event.pageX > 200) {
        this.readingGuideLeft = $event.pageX - 200 + 'px';
      }
    }
    if (this.isBigWhiteCursor || this.isBigBlackCursor) {
      this.cursorTop = $event.pageY - -2 + 'px';
      this.cursorLeft = $event.pageX - 5 + 'px';
    }
  }

  dragStart(e: any) {
    const element: any = document.getElementById('accessibility-btn').style;
    const left = +element.left.replace('px', '');
    const top = +element.top.replace('px', '');

    this.offsetX = e.clientX - left;
    this.offsetY = e.clientY - top;
    console.log(
      'start',
      e.clientX,
      e.clientY,
      element.left,
      element.top,
      this.offsetX,
      this.offsetY,
    );
  }
  dragEnd(e: any) {
    this.accessibilityConfig.iconTop = e.clientY - this.offsetY + 'px';
    this.accessibilityConfig.iconLeft = e.clientX - this.offsetX + 'px';
    console.log('end', this.accessibilityConfig.iconTop, this.accessibilityConfig.iconLeft);
    localStorage.setItem('accessibility', JSON.stringify(this.accessibilityConfig));
  }
  accept(): void {
    this.isShowAccessibilityModal = false;
    this.accessibilityConfig.isInterfaceEnabled = false;
    localStorage.setItem('accessibility', JSON.stringify(this.accessibilityConfig));
  }
  cancel(): void {
    this.isShowAccessibilityModal = false;
  }

  onReadingGuideClick(value: boolean): void {
    this.isReadingGuide = value;
  }

  onWhiteCursorClick(value: boolean): void {
    this.isBigWhiteCursor = value;
    if (this.isBigWhiteCursor) {
      document.body.style.setProperty('cursor', 'none');
    } else {
      document.body.style.setProperty('cursor', 'pointer');
    }
  }

  onBlackCursorClick(value: boolean): void {
    this.isBigBlackCursor = value;
    if (this.isBigBlackCursor) {
      document.body.style.setProperty('cursor', 'none');
    } else {
      document.body.style.setProperty('cursor', 'pointer');
    }
  }
  ngOnDestroy() {}
}
