import { Injectable } from '@angular/core';
import { Menu } from '../@models/menus';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private selectedMenu!: Menu;
  private selectedEntityName!: string;
  private selectedServiceUrl!: string;
  private isDynamicFormBuilderMenu!: boolean;

  setSelectedMenu(selectedMenu: Menu) {
    this.selectedMenu = selectedMenu;
  }

  getSelectedMenu(): Menu {
    return this.selectedMenu;
  }

  setSelectedEntityName(entityName: string) {
    this.selectedEntityName = entityName;
  }

  getSelectedEntityName(): string {
    return this.selectedEntityName;
  }

  setSelectedServiceUrl(selectedServiceUrl: string) {
    this.selectedServiceUrl = selectedServiceUrl;
  }

  getSelectedServiceUrl(): string {
    return this.selectedServiceUrl;
  }

  setIsDynamicFormBuilderMenu(isDynamicFormBuilderMenu: boolean): void {
    this.isDynamicFormBuilderMenu = isDynamicFormBuilderMenu;
  }

  getIsDynamicFormBuilderMenu(): boolean {
    return this.isDynamicFormBuilderMenu;
  }
}
