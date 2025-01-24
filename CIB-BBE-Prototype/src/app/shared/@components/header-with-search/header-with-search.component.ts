import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-with-search',
  templateUrl: './header-with-search.component.html',
  styleUrls: ['./header-with-search.component.scss'],
})
export class HeaderWithSearchComponent implements OnInit {
  @Input('heading') heading: string;
  @Input('enableSearch') enableSearch?: boolean = true;
  @Input('enableClose') enableClose?: boolean = false;

  @Output() search = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  enableSearchInput: boolean = false;
  searchValue: string;

  constructor() {}

  ngOnInit(): void {}

  onSearchInput() {
    this.search.emit(this.searchValue);
  }
}
