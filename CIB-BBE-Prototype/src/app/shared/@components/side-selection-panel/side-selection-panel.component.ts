import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-side-selection-panel',
  templateUrl: './side-selection-panel.component.html',
  styleUrls: ['./side-selection-panel.component.scss'],
})
export class SideSelectionPanelComponent implements OnInit, OnChanges {
  @Input('dataList') dataList: any[];
  // @Input() template: TemplateRef<any>;

  @Output() onCardSelected = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    const selectedIndex = this.dataList?.findIndex((d) => d.isSelected === true);
    if (selectedIndex !== -1) {
      this.onCardClick(this.dataList[selectedIndex]);
    }
  }

  onCardClick(data: any) {
    this.dataList.map((d) => (d.isSelected = false));
    data.isSelected = true;
    this.onCardSelected.emit(data);
  }
}
