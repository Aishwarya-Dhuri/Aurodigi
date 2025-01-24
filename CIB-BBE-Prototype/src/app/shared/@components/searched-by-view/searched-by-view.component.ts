import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Filter } from '../dynamic-search/@models/filter.model';

@Component({
  selector: 'app-searched-by-view',
  templateUrl: './searched-by-view.component.html',
  styleUrls: ['./searched-by-view.component.scss'],
})
export class SearchedByViewComponent implements OnInit {
  @Input('filters') filters: Filter[] = [];
  @Output() onClear = new EventEmitter<void>();
  @Output() onModify = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClearClick(): void {
    this.onClear.emit();
  }

  onModifyClick(): void {
    this.onModify.emit();
  }
}
