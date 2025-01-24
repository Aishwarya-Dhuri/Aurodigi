import { Component, OnInit, Input } from '@angular/core';
import { SlabService } from '../../@services/slab.service';
import { ProfilePictureRendererComponent } from '../../@components/profile-picture-renderer/profile-picture-renderer.component';
import { CorporateAuthorizationMatrixComponent } from '../../corporate-authorization-matrix.component';
import { Profile, Slab } from '../../@models/authorization-matrix.model';
import { CurrencyService } from 'src/app/shared/@services/currency.service';

@Component({
  selector: 'app-add-slab',
  templateUrl: './add-slab.component.html',
  styleUrls: ['./add-slab.component.scss']
})
export class AddSlabComponent implements OnInit {
  @Input('parentRef') parentRef: CorporateAuthorizationMatrixComponent;
  @Input('slabFormData') slabFormData: Slab;

  isShowConflictedUsers: boolean = false;
  isShowUsers: boolean = false;

  currentProfile: Profile;

  profilesList: any[];
  filteredProfilesList: any[];

  usersColDefUrl = 'setup/security/corporateAuthorizationMatrix/private/userColDefs';
  usersRowDataUrl = 'setup/generalMaster/accountWiseAccess/private/getUsers';

  conflictedUsersRowDataUrl =
    'setup/security/corporateAuthorizationMatrix/Users/conflictedUserRowDataUrl';
  conflictedUsersColDefUrl = 'setup/security/corporateAuthorizationMatrix/Users/userColDefUrl';

  frameworkComponents = {
    profilePictureRenderer: ProfilePictureRendererComponent,
  };

  gridOptions = {
    pagination: false,
    rowSelection: 'multiple',
  };

  constructor(private slabService: SlabService, public currencyService: CurrencyService) { }

  ngOnInit(): void {
    const profiles = [
      new Profile('Executive', false, false, '', '0', '', []),
      new Profile('Admin', false, false, '', '0', '', []),
      new Profile('Chairman', false, false, '', '0', '', []),
      new Profile('CFO', false, false, '', '0', '', []),
    ];

    if (!this.slabFormData) {
      this.slabFormData = new Slab();
    } else {
      this.slabFormData.profiles.forEach((profile: Profile) => {
        const index = profiles.findIndex((p: Profile) => p.profileName == profile.profileName);

        if (index >= 0) {
          profiles[index] = profile;
        }
      });
    }

    this.slabFormData.profiles = profiles;
  }

  onAddProfileUsers(users: any[]) {

    const index = this.slabFormData.profiles.findIndex(
      (profile: Profile) => profile.profileName == this.currentProfile.profileName,
    );

    console.log(index);

    if (index >= 0) {
      const userMapped: string[] = [];

      users.forEach((user: any) => {
        userMapped.push(user.uaid);
      });

      this.slabFormData.profiles[index].usersMapped = userMapped.join(', ');
      this.slabFormData.profiles[index].users = users;
    }
  }

  onFilterProfiles(value: string) { }

  onAddSlab() {
    this.prepareSlab();
    this.parentRef.onAddSlab(this.slabFormData);
  }

  onSaveSlab() {
    this.prepareSlab();
    this.parentRef.onSaveEditSlab(this.slabFormData);
  }

  private prepareSlab() {
    const profiles = this.slabFormData.profiles.filter((profile: Profile) => profile.isChecked);

    const users: any[] = [];
    profiles.forEach((profile: Profile) => {
      users.push(...profile.users);
    });

    this.slabFormData.noOfProfiles = profiles.length;

    this.slabFormData.profiles = profiles;
    this.slabFormData.users = users;
  }

}
