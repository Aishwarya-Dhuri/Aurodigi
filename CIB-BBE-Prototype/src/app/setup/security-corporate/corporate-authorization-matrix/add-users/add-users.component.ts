import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/shared/@services/http.service';
import { SlabService } from '../@services/slab.service';
import { ProfilePictureRendererComponent } from '../@components/profile-picture-renderer/profile-picture-renderer.component';
import { RenderAvatarGroupComponent } from '../@components/render-avatar-group/render-avatar-group.component';
import { CorporateAuthorizationMatrixComponent } from '../corporate-authorization-matrix.component';
import { CurrencyService } from 'src/app/shared/@services/currency.service';
import { Slab } from '../@models/authorization-matrix.model';
import { ActionRendererComponent } from '../@components/action-renderer/action-renderer.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  @ViewChild('usersListing') usersListingGrid: any;

  @Input('parentRef') parentRef: CorporateAuthorizationMatrixComponent;

  listType: 'list' | 'card' = 'card';

  accountUsers: boolean = false;

  usersColDefs: any[] = [
    {
      headerName: 'User ID',
      field: 'uaid',
      cellRenderer: 'profilePictureRenderer',
    },
    {
      headerName: 'First Name',
      field: 'firstName',
    },
    {
      headerName: 'Last Name',
      field: 'lastName',
    },
  ];
  usersRowData: any[] = [];

  slabColDefs: any[] = [
    {
      headerName: 'Start Slab Range',
      field: 'slabStartRange',
      cellRenderer: 'currencyRenderer',
    },
    {
      headerName: 'End Slab Range',
      field: 'slabEndRange',
      cellRenderer: 'currencyRenderer',
    },
    {
      headerName: 'No. of Profiles',
      field: 'noOfProfiles',
    },
    {
      headerName: 'Users',
      field: 'users',
      cellRenderer: 'renderAvatarGroup',
    },
    {
      headerName: 'Actions',
      field: '',
      cellRenderer: 'actionsRenderer',
    },
  ];

  currentSlab: Slab = null;

  context = {
    componentParent: this,
  };

  frameworkComponents = {
    renderAvatarGroup: RenderAvatarGroupComponent,
    actionsRenderer: ActionRendererComponent,
  };

  userFrameworkComponents = {
    profilePicIdRenderer: ProfilePictureRendererComponent,
  };

  gridOptions = {
    rowModelType: 'clientSide',
  };

  constructor(
    private slabService: SlabService,
    private httpService: HttpService,
    public currencyService: CurrencyService,
  ) { }

  ngOnInit(): void {
    console.log(this.currencyService.getCurrencyName());
  }

  onEditSlab(i: number) {
    this.parentRef.onEditSlab(i);
  }

  onDeleteSlab(i: number) {
    this.parentRef.onDeleteSlab(i);
  }

  onClickUsers(users: any[]) {
    this.usersRowData = users;
    if (this.usersListingGrid) {
      this.usersListingGrid.setRowData(users);
    }
    this.accountUsers = true;
  }

}
