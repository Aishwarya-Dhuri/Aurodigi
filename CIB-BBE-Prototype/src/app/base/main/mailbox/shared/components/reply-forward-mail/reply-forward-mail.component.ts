import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reply-forward-mail',
  templateUrl: './reply-forward-mail.component.html',
  styleUrls: ['./reply-forward-mail.component.scss'],
})
export class ReplyForwardMailComponent implements OnInit {
  @Input() isMailType: string;
  @Input() viewMail: any;
  constructor() {}

  ngOnInit(): void {}
}
