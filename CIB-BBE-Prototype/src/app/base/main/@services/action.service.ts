import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Actions } from '../../@models/actions';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private _actions = new BehaviorSubject<Actions>(null);

  private showActionContainer = new BehaviorSubject<boolean>(true);

  private action = new BehaviorSubject<any>(null);

  constructor() {}

  setAction(action: any) {
    this.action.next(action);
  }

  getAction() {
    return this.action;
  }

  setShowActionContainer(showActionContainer: boolean) {
    this.showActionContainer.next(showActionContainer);
  }

  getShowActionContainer() {
    return this.showActionContainer;
  }

  setActions(actions: Actions) {
    this._actions.next(actions);
  }

  getActions() {
    return this._actions;
  }
}
