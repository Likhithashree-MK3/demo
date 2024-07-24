import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { StdashboardPage } from '../stdashboard/stdashboard';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-styts',
  templateUrl: 'styts.html',
})

export class StytsPage {

  YtsList: any = [];
  YtsListCopy: any = [];
  SrchText: string;
  sortdesc: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Yet to Start";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

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

  StartClick(e) {

    console.log(e);

    const confirm = this.alertCtrl.create({
      title: 'Do you want to Start the job ?',
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
            console.log('Agree clicked');
            if (this.global.CheckInternetConnection()) {

              this.httpClient.post<any>(this.global.HostedPath + "UpdateOnStart?TechnicianID=" + this.global.UserDetails[0].Employee_IC + "&JobCardHeaderIC=" + e.JobCardHedIC, {}).subscribe(result => {

                console.log(result);

                if (result.StatusCode == 200) {

                  this.global.ToastShow("Job Started");
                  this.CallListData();
                  // this.ngOnInit(undefined);

                }
                else if (result.StatusCode == 0) {

                  this.global.ToastShow("Please close Previous job to start new JC");
                  // this.ngOnInit(undefined);

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

    this.httpClient.get<any>(this.global.HostedPath + "GetTechYetToStart?Technician_ID=" + this.global.UserDetails[0].Employee_IC
    ).subscribe(list => {

      if (list.StatusCode == 200) {

        this.YtsList = JSON.parse(list.Output);

        this.YtsList.sort((a, b) => b.T1 - a.T1);
        console.log(this.YtsList);
        this.YtsListCopy = this.YtsList;
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
    this.YtsList = this.YtsListCopy.filter(
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
    console.log(this.YtsList);
  }

  SortClick() {
    this.sortdesc = !this.sortdesc;
    if (this.sortdesc) {
      this.YtsList.sort((a, b) => b.T1 - a.T1);
    }
    else {
      this.YtsList.sort((a, b) => a.T1 - b.T1);
    }
    console.log(this.YtsList)
  }

}
