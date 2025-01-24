import { Injectable } from '@angular/core';
import { ListType } from '../models/list-type.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private selectedListCode: string;
  private selectedList: ListType;
  private isBackButton: boolean;

  getSelectedListCode(): string {
    return this.selectedListCode;
  }

  setSelectedListCode(name: string) {
    this.selectedListCode = name;
  }

  getSelectedList(): ListType {
    return this.selectedList;
  }

  setSelectedList(listType: ListType) {
    this.selectedList = listType;
  }

  clearSelection(): void {
    this.selectedList = null;
    this.selectedListCode = null;
  }

  setBackButton(isBackButton: boolean): void {
    this.isBackButton = isBackButton;
  }

  getBackButton(): boolean {
    return this.isBackButton;
  }
}
