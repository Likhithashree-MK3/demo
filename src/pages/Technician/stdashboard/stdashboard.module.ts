import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StdashboardPage } from './stdashboard';

@NgModule({
  declarations: [
    StdashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(StdashboardPage),
  ],
})
export class StdashboardPageModule {}
