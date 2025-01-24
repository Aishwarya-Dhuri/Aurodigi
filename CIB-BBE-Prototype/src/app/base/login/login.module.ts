import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { InfoPanelComponent } from './@components/info-panel/info-panel.component';
import { LoginPanelComponent } from './@components/login-panel/login-panel.component';
import { SecondFactorAuthenticationComponent } from './@components/login-panel/second-factor-authentication/second-factor-authentication.component';
import { PreLoginFooterComponent } from './@components/pre-login-footer/pre-login-footer.component';
import { PreLoginHeaderComponent } from './@components/pre-login-header/pre-login-header.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [
    LoginComponent,
    PreLoginHeaderComponent,
    LoginPanelComponent,
    InfoPanelComponent,
    PreLoginFooterComponent,
    SecondFactorAuthenticationComponent,
  ],
  imports: [CommonModule, SharedModule, LoginRoutingModule],
})
export class LoginModule {}
