import { NgModule } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
// import { CKEditorModule } from 'ckeditor4-angular';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const commonModule = [
  InputTextModule,
  DropdownModule,
  BreadcrumbModule,
  ButtonModule,
  RippleModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  RadioButtonModule,
  CalendarModule,
  SidebarModule,
  // CKEditorModule,
  DividerModule,
  ToastModule,
  ConfirmDialogModule,
];

@NgModule({
  declarations: [],
  imports: [...commonModule],
  exports: [...commonModule],
  providers: [],
})
export class ngPrimeModule {}
