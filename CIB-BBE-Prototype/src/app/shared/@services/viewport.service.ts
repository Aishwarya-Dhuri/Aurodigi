import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private viewport = new BehaviorSubject<string>('web');

  setViewport(viewport: string) {
    this.viewport.next(viewport);
  }

  getViewport() {
    return this.viewport;
  }
}
