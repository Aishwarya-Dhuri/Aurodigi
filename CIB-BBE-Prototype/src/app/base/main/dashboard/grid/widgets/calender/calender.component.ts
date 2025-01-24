import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
})
export class CalenderComponent implements OnInit {
  date: Date = new Date();
  @Input('index') index: any;
  @Input('title') title: any;
  @Input('id') id: any;
  @Input('serviceUrl') serviceUrl: any;
  @Input('showChangeChartOption') showChangeChartOption: any;

  @Output() action = new EventEmitter<{ type: string; i?: number }>();
  events: any;
  options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    defaultDate: '2017-02-01',
    header: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    editable: true,
    eventClick: (e) => {
      // this.eventDialog = true;
      // this.clickedEvent = e.event;
      // this.changedEvent.title = this.clickedEvent.title;
      // this.changedEvent.start = this.clickedEvent.start;
      // this.changedEvent.end = this.clickedEvent.end;
    },
  };

  messages = [
    {
      heading: 'You have a payable due on 19th may for 200,00 USD',
      subHeading: 'Due by 30 days',
    },
    {
      heading: 'You have a payable due on 19th may for 200,00 USD',
      subHeading: 'Due by 30 days',
    },
    {
      heading: 'You have a payable due on 19th may for 200,00 USD',
      subHeading: 'Due by 30 days',
    },
    {
      heading: 'You have a payable due on 19th may for 200,00 USD',
      subHeading: 'Due by 30 days',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  actionEvent(e: { type: string; event?: any }) {
    this.action.emit({ type: e.type, i: this.index });
  }
}
