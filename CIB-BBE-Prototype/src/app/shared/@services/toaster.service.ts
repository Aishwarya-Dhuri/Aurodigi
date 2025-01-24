import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private message = new BehaviorSubject<Message>({});

  constructor() {}

  showToaster(message: Message): void {
    this.message.next(message);
  }

  getToasterMessage(): Observable<Message> {
    return this.message;
  }
}
