import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DraggableItem } from '../@models/dynamic-form-builder';

@Injectable({
  providedIn: 'root',
})
export class DynamicFormBuilderService {
  private draggedItem: DraggableItem | null;
  private isGridEdit = new BehaviorSubject<boolean>(true);

  constructor() {}

  setGridEdit(isGridEdit: boolean): void {
    this.isGridEdit.next(isGridEdit);
  }

  getGridEdit(): Observable<boolean> {
    return this.isGridEdit;
  }

  setDraggedItem(draggedItem: DraggableItem): void {
    this.draggedItem = draggedItem;
  }

  getDraggedItem(): DraggableItem {
    return this.draggedItem;
  }
}
