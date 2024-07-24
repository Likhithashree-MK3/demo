import { Component } from '@angular/core';
import { AlertController, App, IonicApp, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { DashboardPage } from '../../Supervisor/KPI/dashboard/dashboard';
import { RealizationPage } from '../../Supervisor/KPI/realization/realization';
import { ScpfalistPage } from '../../Supervisor/JCStatus/scpfalist/scpfalist';
import { ScetdelistPage } from '../../Supervisor/JCStatus/scetdelist/scetdelist';
import { ScallocatedytslistPage } from '../../Supervisor/JCStatus/scallocatedytslist/scallocatedytslist';
import { ScwiplistPage } from '../../Supervisor/JCStatus/scwiplist/scwiplist';
import { SconholdlistPage } from '../../Supervisor/JCStatus/sconholdlist/sconholdlist';
import { SccmptedlistPage } from '../../Supervisor/JCStatus/sccmptedlist/sccmptedlist';
import { Sccmptedt5plistPage } from '../../Supervisor/JCStatus/sccmptedt5plist/sccmptedt5plist';
import { Sccmptedt5dlistPage } from '../../Supervisor/JCStatus/sccmptedt5dlist/sccmptedt5dlist';
import { StdashboardPage } from '../../Technician/stdashboard/stdashboard';
import { LoginPage } from '../login/login';
import { NotificationsPage } from '../notifications/notifications';

@IonicPage()
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})

export class HeaderPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    public alertCtrl: AlertController,
    public platform: Platform,
    public ionicApp: IonicApp) {

  }

  HomeClick() {

    // if (this.global.UserDetails[0].Designation == 'Floor Supervisor') {
    //   this.navCtrl.setRoot(DashboardPage);
    // }
    // else {
    //   this.navCtrl.setRoot(SejoblistPage);
    // }

  }

  BackButtonClick() {

    const overlayView = this.ionicApp._overlayPortal._views[0];

    if (!(overlayView && overlayView.dismiss)) {

      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();

      console.log(activeView.name);

      switch (activeView.name) {

        case "LoginPage":
        case "WelcomePage":
          this.platform.exitApp();
          break;

        case "DashboardPage":
        case "StdashboardPage":
          if (!this.global.IsAlertOpen) {
            this.RegistrationBackClick("Are you sure, you want to Logout?");
          }
          break;

        case "UtilizationPage":
        case "RealizationPage":
        case "ProductivityPage":
        case "SctechavlPage":
        case "SctechwiplPage":
        case "SctechytsPage":
        case "SctechpausePage":
        case "ScpfalistPage":
        case "ScetdelistPage":
        case "ScallocatedytslistPage":
        case "ScwiplistPage":
        case "SconholdlistPage":
        case "SccmptedlistPage":
        case "Sccmptedt5plistPage":
        case "Sccmptedt5dlistPage":

        case "GovernancePage":
          this.navCtrl.setRoot(DashboardPage);
          break;

        case "NotificationsPage":
        case "CommunicationPage":
        case "ProfilePage":
          if (this.global.WelcomeNavigateType == 1) {
            this.navCtrl.setRoot(DashboardPage);
          }
          else if (this.global.WelcomeNavigateType == 2 || this.global.WelcomeNavigateType == 3) {
            this.navCtrl.setRoot(StdashboardPage);
          }
          break;

        case "StatisticsPage":
          this.navCtrl.setRoot(RealizationPage);
          break;

        case "ScpfadetailsPage":
          this.navCtrl.setRoot(ScpfalistPage);
          break;

        case "ScetdedetailsPage":
          this.navCtrl.setRoot(ScetdelistPage);
          break;

        case "ScallocatedytsdetailsPage":
          this.navCtrl.setRoot(ScallocatedytslistPage);
          break;

        case "ScwipdetailsPage":
          this.navCtrl.setRoot(ScwiplistPage);
          break;

        case "SconholddetailsPage":
          this.navCtrl.setRoot(SconholdlistPage);
          break;

        case "SccmpteddetailsPage":
          this.navCtrl.setRoot(SccmptedlistPage);
          break;

        case "Sccmptedt5pdetailsPage":
          this.navCtrl.setRoot(Sccmptedt5plistPage);
          break;

        case "Sccmptedt5ddetailsPage":
          this.navCtrl.setRoot(Sccmptedt5dlistPage);
          break;

        case "StrealizationPage":
        case "StytsPage":
        case "StwipPage":
        case "StpausedPage":
        case "StcompletedPage":
          this.navCtrl.setRoot(StdashboardPage);
          break;

        case "ModalCmp":
          break;

        default:
          this.navCtrl.setRoot(LoginPage);
          break;

      }

    }

  }

  LogoutClick() {
    if (!this.global.IsAlertOpen) {
      this.RegistrationBackClick("Are you sure, you want to Logout?");
    }
  }

  RegistrationBackClick(msg) {

    this.global.IsAlertOpen = true;

    const confirm = this.alertCtrl.create({
      title: "Confirm",
      message: msg,
      buttons: [
        {
          text: 'No',
          cssClass: "BtnTwoPopup",
          handler: () => {
            this.global.IsAlertOpen = false;
          }
        },
        {
          text: 'Yes',
          cssClass: "BtnTwoPopup",
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
            this.global.IsAlertOpen = false;
            localStorage.clear();
          }
        }
      ],
      enableBackdropDismiss: false
    });

    confirm.present();

  }

  NotificationClick() {
    this.navCtrl.setRoot(NotificationsPage);
  }

}