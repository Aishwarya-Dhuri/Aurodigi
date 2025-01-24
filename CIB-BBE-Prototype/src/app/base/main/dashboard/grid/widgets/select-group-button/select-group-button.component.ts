import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Select } from 'src/app/shared/@models/select.model';

@Component({
  selector: 'app-select-group-button',
  templateUrl: './select-group-button.component.html',
  styleUrls: ['./select-group-button.component.scss'],
})
export class SelectGroupButtonComponent implements OnInit {
  @Input() options: Select[] = [];
  @Input() selectedOption: Select;
  @Output() onSelection = new EventEmitter<Select>();
  @Output() onSelectionLabel = new EventEmitter<String>();
  @Output() onSelectionValue = new EventEmitter<String>();

  constructor() {}

  ngOnInit(): void {
    if (this.options.length == 0) {
      this.options = [
        { id: 'daily', displayName: 'Daily' },
        { id: 'weekly', displayName: 'Weekly' },
        { id: 'monthly', displayName: 'Monthly' },
      ];
      this.selectedOption = this.options[1];
    }

    if (!this.selectedOption && this.options.length > 0) this.selectedOption = this.options[0];
  }

  onOptionChanged(option: Select): void {
    this.selectedOption = option;
    this.onSelection.emit(this.selectedOption);
    this.onSelectionLabel.emit(this.selectedOption.displayName);
    this.onSelectionValue.emit(this.selectedOption.id);
  }
}
