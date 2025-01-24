import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  private mode!: string;
  private id!: any;
  private extraData!: any;

  getMode() {
    return this.mode;
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  getId() {
    return this.id;
  }

  setId(id: any) {
    this.id = id;
  }

  setExtraData(data: any) {
    this.extraData = data;
  }

  getExtraData() {
    return this.extraData;
  }

  clearAll() {
    this.id = null;
    this.mode = null;
    this.extraData = null;
  }
}
