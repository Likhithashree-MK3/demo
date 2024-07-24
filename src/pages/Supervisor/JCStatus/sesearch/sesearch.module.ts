import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SesearchPage } from './sesearch';

@NgModule({
  declarations: [
    SesearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SesearchPage),
  ],
})
export class SesearchPageModule {}
