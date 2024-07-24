import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { StdashboardPage } from '../stdashboard/stdashboard';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-stwip',
  templateUrl: 'stwip.html',
})

export class StwipPage {

  WipList: any = [];
  WipListCopy: any = [];
  SrchText: string;
  sortdesc: boolean = true;

  selectedPauseActivity: string = '';
  JobCardHedIC: number;
  PauseActivityList: any = [];
  isResionForPauseOpen: boolean = false
  PauseActivityResion: string = "";
  PauseIconPath: string = this.global.HostedPath.split("api")[0] + "UploadedFiles/PauseActivity/";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "In Progress";

  }

  ngOnInit() {
    if (this.global.CheckInternetConnection()) {
      console.log(this.global.UserDetails)
      this.global.LoadingShow("Please wait...");
      this.CallListData();
      this.global.LoadingHide();
    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }
  }

  BackClick() {
    this.navCtrl.setRoot(StdashboardPage);
  }

  PauseClick1(e) {

    const confirm = this.alertCtrl.create({
      title: 'Do you want to Pause the job ?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'BtnCancelPopup',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          cssClass: 'BtnYesPopup',
          handler: () => {

            let PauseAlert = this.alertCtrl.create();
            PauseAlert.setTitle('Reason');

            this.global.MasterData.PauseActivity.forEach(ele => {

              PauseAlert.addInput({
                type: 'radio',
                value: ele.ShortName,
                label: ele.PauseReason,
                checked: false
              });

            });

            PauseAlert.addButton({
              text: 'Reset',
              cssClass: "BtnResetPopup"
            });

            PauseAlert.addButton({
              text: 'Yes',
              cssClass: "BtnYesPopup",
              handler: val => {

                console.log(val);

                if (val == "OT") {

                  const prompt = this.alertCtrl.create({
                    title: 'Reason',
                    message: "Please Enter Other reason",
                    inputs: [
                      {
                        name: 'reason',
                        placeholder: 'Reason'
                      },
                    ],
                    buttons: [
                      {
                        text: 'Cancel',
                        cssClass: "BtnCancelPopup",
                        handler: data => {
                          //PauseAlert.present();
                        }
                      },
                      {
                        text: 'Yes',
                        cssClass: "BtnYesPopup",
                        handler: data => {

                          console.log(data);

                          if (data.reason == "") {
                            this.global.ToastShow("Please Enter Other reason");
                            return false;
                          }
                          else {
                            this.UpdatePuase(e.JobCardHedIC, val, data.reason);
                          }
                        }

                      }]
                  });
                  prompt.present();

                }
                else {
                  let res = this.global.MasterData.PauseActivity.find(a => a.ShortName == val).PauseReason;
                  this.UpdatePuase(e.JobCardHedIC, val, res);
                }

              }

            });

            PauseAlert.present();

          }
        }
      ]
    });
    confirm.present();
  }

  PauseClick(e) {

    this.PauseActivityList = this.global.MasterData.PauseActivity;

    const confirm = this.alertCtrl.create({
      title: 'Do you want to Pause the job ?',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'BtnCancelPopup',
          handler: () => {
            console.log('Disagree clicked');
            this.isResionForPauseOpen = false;
          }
        },
        {
          text: 'Yes',
          cssClass: 'BtnYesPopup',
          handler: () => {

            console.log("PauseActivityList");
            console.log(this.PauseActivityList);

            this.JobCardHedIC = e.JobCardHedIC;
            console.log("JobCardHedIC");
            console.log(this.JobCardHedIC);

            this.isResionForPauseOpen = true;

          }
        }
      ]
    });
    confirm.present();
  }

  ClosePauseContainer() {
    this.isResionForPauseOpen = false;
  }

  ConfirmResionForPause() {

    console.log(this.selectedPauseActivity);

    if (this.selectedPauseActivity == "OT") {

      if (this.PauseActivityResion == "") {
        this.global.ToastShow("Please Enter Other reason");
        return false;
      }
      else {
        this.UpdatePuase(this.JobCardHedIC, this.selectedPauseActivity, this.PauseActivityResion);
        this.isResionForPauseOpen = false;
      }
    }
    else {
      let res = this.global.MasterData.PauseActivity.find(a => a.ShortName == this.selectedPauseActivity).PauseReason;
      this.UpdatePuase(this.JobCardHedIC, this.selectedPauseActivity, res);
      this.isResionForPauseOpen = false;
    }

  }

  PauseActivityListClick(val) {

    setTimeout(() => {
      if (val.ShortName == "OT") {
        document.getElementById("ResionForPauseListContainer").scrollTop = 200;
      }
    }, 10);

  }

  CompleteClick(e) {

    const confirm = this.alertCtrl.create({
      title: 'Do you want to Complete the job ?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'BtnCancelPopup',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          cssClass: 'BtnYesPopup',
          handler: () => {

            if (this.global.CheckInternetConnection()) {

              this.httpClient.post<any>(this.global.HostedPath + "UpdateOnComplete?TechnicianID=" + this.global.UserDetails[0].Employee_IC + "&JobCardHeaderIC=" + e.JobCardHedIC, {}).subscribe(result => {
                console.log(result);
                if (result.StatusCode == 200) {

                  // this.global.ToastShow("Job Submitted Successfully");
                  // this.ngOnInit(undefined);
                  this.CallListData();

                  const alert = this.alertCtrl.create({

                    title: '<img src="assets/imgs/thumbs-up.png">',
                    subTitle: '<center>Great Job!!!<br/> Keep up the good work!!!<center>',
                    buttons: [{
                      text: 'OK',
                      cssClass: 'BtnOkPopup',
                      handler: () => {

                        console.log('Ok clicked');
                      }
                    }]
                  });
                  alert.present();

                }
                else {
                  console.log(result);
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
        }
      ]
    });
    confirm.present();
  }

  CallListData() {

    this.httpClient.get<any>(this.global.HostedPath + "GetTechInProgress?Technician_ID=" + this.global.UserDetails[0].Employee_IC
    ).subscribe(list => {

      if (list.StatusCode == 200) {

        this.WipList = JSON.parse(list.Output);

        this.WipList.sort((a, b) => b.T1 - a.T1);
        console.log(this.WipList);
        this.WipListCopy = this.WipList;
      }
      else {
        console.log(list);
        this.global.ToastShow("Something went wrong, Pls try again later");
      }
    }, (error) => {
      console.log(error);
      this.global.LoadingHide();
    });
  }

  Search() {
    console.log(this.SrchText)
    this.WipList = this.WipListCopy.filter(
      p => p.Jobtype.toLowerCase().trim().includes(this.SrchText.toLowerCase().trim()) ||
        p.OrderNo.toString().includes(this.SrchText.trim()) ||
        p.VehicleNo.toLowerCase().includes(this.SrchText.toLowerCase().trim()) ||
        p.IsAppointmentDone.toString().includes(this.SrchText.trim()) ||
        p.CustomerName.toLowerCase().includes(this.SrchText.toLowerCase().trim()) ||
        p.ServiceAdvisor.toString().includes(this.SrchText.trim()) ||
        p.Ageing.toString().includes(this.SrchText.trim()) ||
        p.T1.toString().includes(this.SrchText.trim()) ||
        p.EDD.toString().includes(this.SrchText.trim()) ||
        p.ETD.toString().includes(this.SrchText.trim())
    );
    console.log(this.WipList);
  }

  SortClick() {
    this.sortdesc = !this.sortdesc;
    if (this.sortdesc) {
      this.WipList.sort((a, b) => b.T1 - a.T1);
    }
    else {
      this.WipList.sort((a, b) => a.T1 - b.T1);
    }
    console.log(this.WipList)
  }

  UpdatePuase(JC, ShortName, reason) {

    if (this.global.CheckInternetConnection()) {

      this.httpClient.post<any>(this.global.HostedPath + "UpdateOnPause?TechnicianID=" + this.global.UserDetails[0].Employee_IC + "&JobCardHeaderIC=" + JC + "&ShortName=" + ShortName + "&Reason=" + reason, {}).subscribe(result => {

        if (result.StatusCode == 200) {

          this.global.ToastShow("Job Paused");
          this.CallListData();

        }
        else {
          console.log(result);
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

}