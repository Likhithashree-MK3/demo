import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GovernancePage } from './governance';

@NgModule({
  declarations: [
    GovernancePage,
  ],
  imports: [
    IonicPageModule.forChild(GovernancePage),
  ],
})
export class GovernancePageModule {}
