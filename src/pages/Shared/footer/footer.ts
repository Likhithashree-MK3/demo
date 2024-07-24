import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { DashboardPage } from '../../Supervisor/KPI/dashboard/dashboard';
import { StdashboardPage } from '../../Technician/stdashboard/stdashboard';
import { CommunicationPage } from '../communication/communication';

@IonicPage()
@Component({
  selector: 'page-footer',
  templateUrl: 'footer.html',
})

export class FooterPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider) {
  }

  DashboardClick() {

    if (this.global.WelcomeNavigateType == 1) {
      this.navCtrl.setRoot(DashboardPage);
    }
    else if (this.global.WelcomeNavigateType == 2 || this.global.WelcomeNavigateType == 3) {
      this.navCtrl.setRoot(StdashboardPage);
    }

  }

  CommunicationClick(){
    this.navCtrl.setRoot(CommunicationPage);
  }

}