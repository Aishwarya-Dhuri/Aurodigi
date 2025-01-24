import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
})
export class WidgetsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  closeSidebar() {
    this.close.emit();
  }
}
