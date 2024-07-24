import { Component } from '@angular/core';
import { AlertController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  Username: string = "";
  Password: string = "";
  ApplicationID: number = 1;
  ApplicationVersion: number = 5;
  showPassword: boolean = false;
  currentversion: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public menuCtrl: MenuController) {

    this.menuCtrl.enable(false);

  }

  ngOnInit() {

    let localSession = JSON.parse(localStorage.getItem("Session"));

    console.log(localSession);

    if (localSession != null && localSession.length > 0) {

      let lastLoginDate = new Date(localSession[0].LastLoginDate.toString().split("T")[0]).getTime();

      let today = new Date();
      let year = today.getFullYear();
      let month = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1);
      let day = today.getDate() > 9 ? today.getDate() : "0" + today.getDate();
      let date = new Date(year + "-" + month + "-" + day).getTime();

      if (lastLoginDate == date) {

        this.Username = localSession[0].Username;
        this.Password = localSession[0].Password;

        // this.LoginClick();

      }
      else {
        localStorage.clear();
      }

    }

  }

  LoginClick() {

    if (this.Username != "" && this.Username != undefined && this.Username != null &&
      this.Password != "" && this.Password != undefined && this.Password != null) {

      if (this.global.CheckInternetConnection()) {

        this.global.LoadingShow("Please wait...");

        this.httpClient.post<any>(this.global.HostedPath + "GetLoginDetails?Username=" + this.Username.trim() + "&Password=" + this.Password.trim(), {}).subscribe(loginDetails => {

          if (loginDetails.StatusCode == 200) {

            this.global.UserDetails = JSON.parse(loginDetails.Output);

            console.log(this.global.UserDetails);

            if (this.global.UserDetails.length > 0) {

              localStorage.setItem("Session", JSON.stringify(this.global.UserDetails));

              if (this.global.UserDetails[0].ProfilePhoto == "") {
                this.global.UserDetails[0].ProfilePhotoPath = "assets/imgs/profile.png";
              }
              else {
                this.global.UserDetails[0].ProfilePhotoPath = this.global.HostedPath.split("api")[0] + "/UploadedFiles/" + this.global.UserDetails[0].ProfilePhoto;
              }

              this.CheckAutoUpdate(this.global.UserDetails[0].Designation);

            }
            else {
              this.global.ToastShow("Entered invalid Username or Password");
              this.global.LoadingHide();
            }

          }
          else {
            console.log(loginDetails);
            this.global.ToastShow("Something went wrong, Pls try again later");
            this.global.LoadingHide();
          }


        }, (error) => {
          console.log(error);
          this.global.LoadingHide();
        });

      }
      else {
        this.global.ToastShow(this.global.NetworkMessage);
      }

    }
    else {
      this.global.ToastShow("Please enter Username and Password");
    }

  }

  GetAllMasters(user) {

    this.httpClient.get<any>(this.global.HostedPath + "GetAllMasters").subscribe(masters => {

      if (masters.StatusCode == 200) {

        this.global.MasterData = JSON.parse(masters.Output);

        console.log(this.global.MasterData);

        if (user == "Works Manager") {

          this.global.IsManager = true;
          this.global.WelcomeNavigateType = 1;
          this.navCtrl.setRoot(WelcomePage);

        }
        else if (user == "Floor Supervisor") {

          this.global.IsManager = false;
          this.global.WelcomeNavigateType = 1;
          this.navCtrl.setRoot(WelcomePage);

        }
        else if (user == "Technician" || user == "Assistant Technician" || user == "Electrician") {

          this.CheckTechinicianPendingJC();

        }
        else {
          this.global.ToastShow("You are not valid user");
        }

      }
      else {
        console.log(masters);
        this.global.ToastShow("Something went wrong, Pls try again later");
      }

      this.global.LoadingHide();

    }, (error) => {
      console.log(error);
      this.global.LoadingHide();
    });

  }

  CheckTechinicianPendingJC() {

    this.httpClient.get<any>(this.global.HostedPath + "GetTechnicianPendingJC?TechnicianID=" + this.global.UserDetails[0].Employee_IC).subscribe(jobCards => {

      if (jobCards.StatusCode == 200) {

        let jc = JSON.parse(jobCards.Output);

        if (jc.length > 0) {
          this.global.WelcomeNavigateType = 4;
          this.global.PendingJCData = jc;
          this.navCtrl.setRoot(WelcomePage);
        }
        else {

          this.httpClient.get<any>(this.global.HostedPath + "GetTechDashboardCounts?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=1" + "&FromeDate=02/14/2024&ToDate=03/14/2024"
          ).subscribe(jobCards => {

            console.log(jobCards);

            if (jobCards.StatusCode == 200) {

              if (JSON.parse(jobCards.Output)[0].YTS > 0) {
                this.global.WelcomeNavigateType = 3;
              }
              else {
                this.global.WelcomeNavigateType = 2;
              }

              this.navCtrl.setRoot(WelcomePage);

            }
            else {
              console.log(jobCards);
              this.global.ToastShow("Something went wrong, Pls try again later");
            }

          });

        }

      }
      else {
        console.log(jobCards);
        this.global.ToastShow("Something went wrong, Pls try again later");
      }

    }, (error) => {
      console.log(error);
    });

  }

  CheckAutoUpdate(user) {

    this.httpClient.get<any>(this.global.HostedPath + "GetAutoUpdateAppDetails?ApplicationID=" + this.ApplicationID).subscribe(autoUpdateDetails => {

      if (autoUpdateDetails.StatusCode == 200) {

        let autoUpdate = JSON.parse(autoUpdateDetails.Output);

        console.log(autoUpdate);

        this.global.AutoUpdateDetails = autoUpdate;

        if (autoUpdate.length > 0) {

          if ((autoUpdate[0].AppVersion > this.ApplicationVersion) && autoUpdate[0].AndroidUpdate) {

            this.global.IsAlertOpen = true;

            let d = new Date(autoUpdate[0].FromDate).toString().split(" ");
            let fromDate = d[2] + "-" + d[1] + "-" + d[3];

            let RegisterAlert = this.alertCtrl.create({
              title: 'Update Availability',
              message: '<p style="font-weight:600;display:block">Please update the new version</p>Version : ' + autoUpdate[0].AppStoreVersion + '<br/>Size : ' + autoUpdate[0].AppSize + '<br/>Release Date : ' + fromDate,
              buttons: [
                {
                  text: 'Update',
                  cssClass: 'BtnOnePopup',
                  handler: data => {
                    this.global.IsAlertOpen = false;
                    window.location.href = autoUpdate[0].Android_Link;
                  }
                }
              ],
              enableBackdropDismiss: false
            });

            RegisterAlert.present();

          }
          else {
            this.GetAllMasters(user);
          }

        }
        else {
          this.GetAllMasters(user);
        }

      }
      else {
        console.log(autoUpdateDetails);
        this.global.LoadingHide();
        this.global.ToastShow("Something went wrong, Pls try again later");
      }

    }, (error) => {
      console.log(error);
      this.global.LoadingHide();
    });

  }

  ShowClick() {
    this.showPassword = !this.showPassword;
  }

  ForgotPasswordClick() {

    if (this.global.CheckInternetConnection()) {

      if (this.Username != "") {

        this.global.LoadingShow("Please wait");

        let NewPW = this.Username.substring(0, 1).toUpperCase() + this.GeneratePassword() + "@" + Math.floor(Math.random() * (999 - 100 + 1) + 100);

        this.httpClient.post<any>(this.global.HostedPath + "UpdatePassword?Username=" + this.Username + "&NewPassword=" + NewPW, {}).subscribe(result => {

          this.global.LoadingHide();

          if (result.StatusCode == 200) {

            this.SendPWSMS(NewPW, result.Output);

          }
          else if (result.StatusCode == 0) {

            this.global.ToastShow("Mobile number is not registered, Pls contact Admin");
          }
          else if (result.StatusCode == 4) {

            this.global.ToastShow("Invalid Username");
          }
          else {
            console.log(result);
            this.global.ToastShow("Something went wrong, Pls try again later");
          }

        }, (error) => {
          console.log(error);
          this.global.LoadingHide();
        });

      }
      else {
        this.global.ToastShow("Please enter Username");
      }

    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }

  }

  SendPWSMS(NewPW, mobile) {

    let msg = "Dear " + this.Username + ", Your new password for Eicher ProfiTech Application is " + NewPW + ", Please do not share this password with anyone. Regards, Eicher";

    this.httpClient.get<any>("https://easygosms.in/api/url_api.php?api_key=fSdgaXWDCFLiM3zp&pass=3cMkYVhy9m&senderid=EICHER&dlttempid=1707170988831080871&dlttagid=&message=" + msg + "&dest_mobileno=" + mobile + "&mtype=TXT").subscribe(result => {

      console.log(result);

      this.global.ToastShow("New Password has been sent to your registered mobile number");
      localStorage.clear();

    }, (error) => {

      console.log(error);

      this.global.ToastShow("New Password has been sent to your registered mobile number");
      localStorage.clear();

    });

  }

  GeneratePassword() {
    var length = 5,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

}