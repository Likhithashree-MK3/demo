import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DashboardPage } from '../../Supervisor/KPI/dashboard/dashboard';
import { GlobalProvider } from '../../../providers/global/global';
import { StdashboardPage } from '../../Technician/stdashboard/stdashboard';
import { SependingjcPage } from '../../Technician/sependingjc/sependingjc';
import { StytsPage } from '../../Technician/styts/styts';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})

export class WelcomePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider) {

    let that = this;

    setTimeout(function () {

      if (that.global.WelcomeNavigateType == 1) {
        that.navCtrl.setRoot(DashboardPage);
      }
      else if (that.global.WelcomeNavigateType == 2) {
        that.navCtrl.setRoot(StdashboardPage);
      }
      else if (that.global.WelcomeNavigateType == 3) {
        that.navCtrl.setRoot(StytsPage)
      }
      else if (that.global.WelcomeNavigateType == 4) {
        that.navCtrl.setRoot(SependingjcPage, { data: that.global.PendingJCData });
      }

    }, 500)

  }

  NextClick() {
    this.navCtrl.setRoot(DashboardPage);
  }

}
