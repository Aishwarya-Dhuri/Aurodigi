import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { WidgetService } from 'src/app/base/main/@services/widget.service';
import { ActionType } from '../../@enums/widget-actions';

@Component({
  selector: 'app-widgets-header',
  templateUrl: './widgets-header.component.html',
  styleUrls: ['./widgets-header.component.scss'],
})
export class WidgetsHeaderComponent implements OnInit {
  isFullScreen: boolean;
  isModal: boolean;
  selectedOption: string;

  isMoreOptions: boolean = false;
  isChartOptions: boolean = false;

  actionType = ActionType;

  @Input('heading') heading: string;
  @Input('showChangeChartOption') showChangeChartOption: boolean = false;

  @Output() action = new EventEmitter<{ type: string; event?: any }>();
  @Output() changeOption = new EventEmitter<string>();

  constructor(private widgetService: WidgetService) {}

  ngOnInit(): void {
    this.selectedOption = '';
    this.widgetService.getIsFullScreen().subscribe((fullScreen: boolean) => {
      this.isFullScreen = fullScreen;
    });

    this.widgetService.getIsModal().subscribe((isModal: boolean) => {
      this.isModal = isModal;
    });
  }

  actionEvent(type: string, e?: any) {
    if (type === ActionType.openMenu) {
      this.isMoreOptions = true;
      return;
    }

    if (type === ActionType.changeTitle && this.isModal) {
      return;
    }

    if (type === ActionType.fullScreen) {
      this.widgetService.setIsFullScreen(true);
    } else if (type === this.actionType.closeFullScreen) {
      this.widgetService.setIsFullScreen(false);
    }

    this.action.emit({ type, event: e ? e : null });
  }

  changeChartType() {
    if (this.selectedOption) {
      this.changeOption.emit(this.selectedOption);
    }
  }
}
