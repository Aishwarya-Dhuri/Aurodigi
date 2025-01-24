import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComposeComponent } from './compose/compose.component';
import { DraftComponent } from './draft/draft.component';
import { InboxComponent } from './inbox/inbox.component';
import { SentComponent } from './sent/sent.component';
import { ViewMailComponent } from './shared/components/view-mail/view-mail.component';
import { StarredComponent } from './starred/starred.component';
import { TrashComponent } from './trash/trash.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inbox',
  },
  {
    path: 'inbox',
    component: InboxComponent,
    data: {
      breadcrumb: 'Inbox',
    },
  },
  {
    path: 'sent',
    component: SentComponent,
    data: {
      breadcrumb: 'Sent',
    },
  },
  {
    path: 'starred',
    component: StarredComponent,
    data: {
      breadcrumb: 'Starred',
    },
  },
  {
    path: 'draft',
    component: DraftComponent,
    data: {
      breadcrumb: 'Draft',
    },
  },
  {
    path: 'trash',
    component: TrashComponent,
    data: {
      breadcrumb: 'Trash',
    },
  },
  {
    path: 'compose',
    component: ComposeComponent,
    data: {
      breadcrumb: 'Compose',
    },
  },
  {
    path: ':listingType',
    data: {
      breadcrumb: ':listingType',
    },
    children: [
      {
        path: 'view-mail',
        component: ViewMailComponent,
        data: {
          breadcrumb: 'View',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailboxRoutingModule {}
