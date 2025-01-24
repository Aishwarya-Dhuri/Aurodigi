import { NgModule } from '@angular/core';

import { MailboxComponent } from './mailbox.component';
import { MailboxRoutingModule } from './mailbox-routing.module';

/* Core Component */
import { ComposeComponent } from './compose/compose.component';
import { StarredComponent } from './starred/starred.component';
import { DraftComponent } from './draft/draft.component';
import { TrashComponent } from './trash/trash.component';
import { InboxComponent } from './inbox/inbox.component';
import { SentComponent } from './sent/sent.component';

/* Shared Module */
import { SharedMailboxModule } from './shared/shared-mailbox.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    MailboxComponent,
    ComposeComponent,
    StarredComponent,
    DraftComponent,
    TrashComponent,
    InboxComponent,
    SentComponent,
  ],
  imports: [CommonModule, SharedMailboxModule, SharedModule],
  exports: [MailboxComponent],
  providers: [],
})
export class MailboxModule {}
