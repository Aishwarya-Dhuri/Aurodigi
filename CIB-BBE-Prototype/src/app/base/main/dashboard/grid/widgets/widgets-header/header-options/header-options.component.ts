import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-options',
  templateUrl: './header-options.component.html',
  styleUrls: ['./header-options.component.scss'],
})
export class HeaderOptionsComponent implements OnInit {
  @Output() remove = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
