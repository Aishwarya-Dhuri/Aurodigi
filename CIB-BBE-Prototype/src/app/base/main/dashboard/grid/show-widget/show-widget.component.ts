import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionType } from '../@enums/widget-actions';

@Component({
  selector: 'app-show-widget',
  templateUrl: './show-widget.component.html',
  styleUrls: ['./show-widget.component.scss'],
})
export class ShowWidgetComponent implements OnInit {
  @Input('widgetComponent') widgetComponent: {
    title: string;
    component: any;
    serviceUrl?: any;
  };
  @Output() action = new EventEmitter<{ type: string }>();

  outputs: any;

  constructor() {}

  ngOnInit(): void {
    this.outputs = {
      action: (event: any) => this.closeModal(event),
    };
  }

  closeModal(e?: any) {
    this.action.emit({ type: e ? e.type : ActionType.closeModal });
  }
}
