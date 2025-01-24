import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-broadcast-messages',
  templateUrl: './broadcast-messages.component.html',
  styleUrls: ['./broadcast-messages.component.scss'],
})
export class BroadcastMessagesComponent implements OnInit {
  play: boolean;
  broadcastMessage: string;
  interval: any;

  broadcastMessageIndex: number;
  noOfMessages: number;
  broadcastMessages: string[] = [
    'Save on internet with the credit card, get 0% into APR',
    'Save on internet with the credit card, get 50% into APR',
    'Save on internet with the credit card, get 100% into APR',
  ];

  constructor() {}

  ngOnInit(): void {
    this.broadcastMessageIndex = 0;
    this.noOfMessages = this.broadcastMessages.length;
    this.broadcastMessage = this.broadcastMessages[0];
    this.playPause(true);
  }

  previous() {
    if (this.broadcastMessageIndex === 0) {
      return;
    }

    this.broadcastMessageIndex -= 1;
    this.changeMessage(this.broadcastMessageIndex);
  }

  next() {
    if (this.broadcastMessageIndex === this.noOfMessages - 1) {
      return;
    }
    this.broadcastMessageIndex += 1;
    this.changeMessage(this.broadcastMessageIndex);
  }

  playPause(play: boolean) {
    this.play = play;

    if (!this.play) {
      clearInterval(this.interval);
      return;
    }

    let i = this.broadcastMessageIndex;
    this.broadcastMessage = this.broadcastMessages[i];

    const broadcastMessagesMaxIndex = this.noOfMessages - 1;
    this.interval = setInterval(() => {
      i++;
      this.changeMessage(i);

      if (i === broadcastMessagesMaxIndex) {
        i = -1;
      }
    }, 5000);
  }

  changeMessage(i: number) {
    this.broadcastMessage = this.broadcastMessages[i];
  }
}
