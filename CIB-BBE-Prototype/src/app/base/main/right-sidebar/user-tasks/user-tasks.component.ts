import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.scss'],
})
export class UserTasksComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closeSidebar() {
    this.close.emit();
  }
}
