import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilizationPage } from './utilization';

@NgModule({
  declarations: [
    UtilizationPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilizationPage),
  ],
})
export class UtilizationPageModule {}
