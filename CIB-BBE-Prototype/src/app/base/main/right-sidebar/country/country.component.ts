import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closeSidebar() {
    this.close.emit();
  }
}
