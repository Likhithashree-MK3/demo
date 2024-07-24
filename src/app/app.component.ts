import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, App, IonicApp, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

import { LoginPage } from '../pages/Shared/login/login';
import { GlobalProvider } from '../providers/global/global';
import { DashboardPage } from '../pages/Supervisor/KPI/dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { RealizationPage } from '../pages/Supervisor/KPI/realization/realization';
import { ScpfalistPage } from '../pages/Supervisor/JCStatus/scpfalist/scpfalist';
import { ScetdelistPage } from '../pages/Supervisor/JCStatus/scetdelist/scetdelist';
import { ScallocatedytslistPage } from '../pages/Supervisor/JCStatus/scallocatedytslist/scallocatedytslist';
import { ScwiplistPage } from '../pages/Supervisor/JCStatus/scwiplist/scwiplist';
import { SconholdlistPage } from '../pages/Supervisor/JCStatus/sconholdlist/sconholdlist';
import { SccmptedlistPage } from '../pages/Supervisor/JCStatus/sccmptedlist/sccmptedlist';
import { Sccmptedt5plistPage } from '../pages/Supervisor/JCStatus/sccmptedt5plist/sccmptedt5plist';
import { Sccmptedt5dlistPage } from '../pages/Supervisor/JCStatus/sccmptedt5dlist/sccmptedt5dlist';
import { StdashboardPage } from '../pages/Technician/stdashboard/stdashboard';
import { ProfilePage } from '../pages/Shared/profile/profile';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public global: GlobalProvider,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public app: App,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public ionicApp: IonicApp) {

    this.initializeApp();

    this.platform.registerBackButtonAction(() => {
      this.BackButtonClick();
    });

  }

  initializeApp() {

    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });

  }

  AboutClick() {

    console.log(this.global.AutoUpdateDetails)

    let AboutAlert = this.alertCtrl.create({
      title: 'About',
      message: '<center><span>' + this.global.AutoUpdateDetails[0].ApplicationName + '</span> <br/><span></span><br/>Version :' + this.global.AutoUpdateDetails[0].AppStoreVersion + '<br/><span></span><br/>Size : ' + this.global.AutoUpdateDetails[0].AppSize + ' MB<center>',
      buttons: [
        {
          text: 'OK',
          cssClass: 'BtnOnePopup',
          handler: data => {

          }
        }
      ],
      enableBackdropDismiss: false

    });

    AboutAlert.present();

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
          this.nav.setRoot(DashboardPage);
          break;

        case "NotificationsPage":
        case "CommunicationPage":
        case "ProfilePage":
          if (this.global.WelcomeNavigateType == 1) {
            this.nav.setRoot(DashboardPage);
          }
          else if (this.global.WelcomeNavigateType == 2 || this.global.WelcomeNavigateType == 3) {
            this.nav.setRoot(StdashboardPage);
          }
          break;

        case "StatisticsPage":
          this.nav.setRoot(RealizationPage);
          break;

        case "ScpfadetailsPage":
          this.nav.setRoot(ScpfalistPage);
          break;

        case "ScetdedetailsPage":
          this.nav.setRoot(ScetdelistPage);
          break;

        case "ScallocatedytsdetailsPage":
          this.nav.setRoot(ScallocatedytslistPage);
          break;

        case "ScwipdetailsPage":
          this.nav.setRoot(ScwiplistPage);
          break;

        case "SconholddetailsPage":
          this.nav.setRoot(SconholdlistPage);
          break;

        case "SccmpteddetailsPage":
          this.nav.setRoot(SccmptedlistPage);
          break;

        case "Sccmptedt5pdetailsPage":
          this.nav.setRoot(Sccmptedt5plistPage);
          break;

        case "Sccmptedt5ddetailsPage":
          this.nav.setRoot(Sccmptedt5dlistPage);
          break;

        case "StrealizationPage":
        case "StytsPage":
        case "StwipPage":
        case "StpausedPage":
        case "StcompletedPage":
          this.nav.setRoot(StdashboardPage);
          break;

        case "ModalCmp":
          break;

        default:
          this.nav.setRoot(LoginPage);
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
            this.nav.setRoot(LoginPage);
            this.global.IsAlertOpen = false;
            localStorage.clear();
          }
        }
      ],
      enableBackdropDismiss: false
    });

    confirm.present();

  }

  ProfilePencilClick() {

    this.nav.setRoot(ProfilePage);

  }

  FileChangeMethod(e) {

    console.log(e.target.files[0])

    var formData = new FormData();

    formData.append("Photo_1", e.target.files[0]);

    this.httpClient.post(this.global.HostedPath + 'UploadFile?EmpCode=' + this.global.UserDetails[0].Code, formData).subscribe(imageUploadData => {

      console.log(imageUploadData);

    }, error => {

      console.log(error);

      this.global.ToastShow("Failed to-upload attachments");

    });

  }

}