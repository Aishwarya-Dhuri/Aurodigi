import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
})
export class QuickLinksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closeSidebar() {
    this.close.emit();
  }
}
