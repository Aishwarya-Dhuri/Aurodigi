import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ComposeMailComponent } from './components/compose-mail/compose-mail.component';
import { ListingComponent } from './components/listing/listing.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ViewMailComponent } from './components/view-mail/view-mail.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { GenericSearchComponent } from './components/generic-search/generic-search.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { ConfirmdialogComponent } from './components/confirmdialog/confirmdialog.component';
import { TrimmedMailComponent } from './components/trimmed-mail/trimmed-mail.component';
import { ReplyForwardMailComponent } from './components/reply-forward-mail/reply-forward-mail.component';

import { ngPrimeModule } from '../ngPrime.module';
/* Service */
import { CommonService } from './services/common.service';
import { AuthInterceptor } from './services/http_interceptor';

/* Pipes */
import { SafeHtmlPipePipe } from './pipes/safe-html-pipe.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MailRendererComponent } from './components/listing/@components/mail-renderer/mail-renderer.component';
import { AttachmentRendererComponent } from './components/listing/@components/attachment-renderer/attachment-renderer.component';
import { DateTimeRendererComponent } from './components/listing/@components/date-time-renderer/date-time-renderer.component';
import { CKEditorModule } from 'ckeditor4-angular';

const commonComponent = [
  HeaderComponent,
  BreadcrumbComponent,
  ComposeMailComponent,
  ListingComponent,
  SideNavComponent,
  ViewMailComponent,
  PaginationComponent,
  ActionButtonComponent,
  TrimmedMailComponent,
  ReplyForwardMailComponent,
  GenericSearchComponent,
  ToasterComponent,

  ConfirmdialogComponent,
  SafeHtmlPipePipe,
];

@NgModule({
  declarations: [
    ...commonComponent,
    MailRendererComponent,
    AttachmentRendererComponent,
    DateTimeRendererComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    SharedModule,
    EditorModule,
    CommonModule,
  ],
  exports: [...commonComponent],
  providers: [CommonService],
})
export class SharedMailboxModule {}
