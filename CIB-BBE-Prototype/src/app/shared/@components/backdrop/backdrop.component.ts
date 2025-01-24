import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
})
export class BackdropComponent implements OnInit, OnDestroy {
  @Input('background') background: string;
  @Input('zIndex') zIndex: number;

  @Output() close = new EventEmitter<void>();

  constructor(@Inject(DOCUMENT) private document: any) {}

  ngOnInit(): void {
    this.document.addEventListener('keydown', (e: any) => {
      if (e.keyCode == 27) {
        e.preventDefault();
        this.close.emit();
      }
    });
  }

  ngOnDestroy() {
    this.document.removeAllListeners();
  }
}
