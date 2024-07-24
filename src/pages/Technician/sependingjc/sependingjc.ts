import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { StdashboardPage } from '../stdashboard/stdashboard';
import { StytsPage } from '../styts/styts';

@IonicPage()
@Component({
  selector: 'page-sependingjc',
  templateUrl: 'sependingjc.html',
})

export class SependingjcPage {

  JCList: any = [];
  PauseTime: any;
  PauseReason: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient,
    public menuCtrl: MenuController) {

    this.global.HeaderTitle = "Pending Job Card";

    this.JCList = this.navParams.get("data");

    console.log(this.JCList);

    this.JCList[0].StatusName = this.global.MasterData.JobCardStatus.find(s => s.JobCardStatus_IC == this.JCList[0].Status).Status;

  }

  SubmitClick() {

    let jcDetails = {
      TechnicianID: this.global.UserDetails[0].Employee_IC,
      JobCardHeader_IC: this.JCList[0].JobCardHeader_IC,
      PauseDatetime: this.PauseTime.toString(),
      Reason: this.PauseReason,
      JobCardProgressDetailer_IC: this.JCList[0].JobCardProgressDetailer_IC
    }

    console.log(jcDetails);

    let d1, d2;

    if (this.PauseTime == undefined) {
      this.global.ToastShow("Please enter Pause time");
    } else {
      d1 = new Date(this.JCList[0].JobCardProgressResumeDatetime);
      d2 = new Date(this.JCList[0].JobCardProgressResumeDatetime);
      d2.setHours(this.PauseTime.split(":")[0])
      d2.setMinutes(this.PauseTime.split(":")[1])

      if (d2 > d1) {

        if (this.PauseReason != "") {

          if (this.global.CheckInternetConnection()) {

            this.httpClient.post<any>(this.global.HostedPath + "UpdateTechnicianPendingJC", jcDetails).subscribe(jobCards => {

              if (jobCards.StatusCode == 200) {

                this.global.ToastShow("Updated Successfully, you can continue working now");

                this.httpClient.get<any>(this.global.HostedPath + "GetTechDashboardCounts?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=1" + "&FromeDate=02/14/2024&ToDate=03/14/2024"
                ).subscribe(jobCards => {

                  console.log(jobCards);

                  if (jobCards.StatusCode == 200) {

                    if (JSON.parse(jobCards.Output)[0].YTS > 0) {
                      this.navCtrl.setRoot(StytsPage)
                    }
                    else {
                      this.navCtrl.setRoot(StdashboardPage);
                    }

                  }
                  else {
                    console.log(jobCards);
                    this.global.ToastShow("Something went wrong, Pls try again later");
                  }

                });

                //this.navCtrl.setRoot(SejoblistPage);

              }
              else {
                console.log(jobCards);
                this.global.ToastShow("Something went wrong, Pls try again later");
              }

            }, (error) => {
              console.log(error);
            });

          }
          else {
            this.global.ToastShow(this.global.NetworkMessage);
          }

        }
        else {
          this.global.ToastShow("Please enter Resume Reason");
        }

      }
      else {
        this.global.ToastShow("Please enter greater than Previous Resume date");
      }

    }

  }

}