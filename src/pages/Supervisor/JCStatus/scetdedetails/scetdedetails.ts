import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { SesearchPage } from '../sesearch/sesearch';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { ScetdelistPage } from '../scetdelist/scetdelist';

@IonicPage()
@Component({
  selector: 'page-scetdedetails',
  templateUrl: 'scetdedetails.html',
})

export class ScetdedetailsPage {
  
  SelectedJC: any = {};

  JobDetails: any = {};
  JobsList: any = [];
  SelectedSEList: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient,
    public modalCtrl: ModalController) {

    this.SelectedJC = this.navParams.get("data");

    this.global.HeaderTitle = "JC " + this.SelectedJC.OrderNo;

    console.log(this.SelectedJC);

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetJobCardDetails?JobCardID=" + this.SelectedJC.JobCardHedIC).subscribe(jobs => {

        if (jobs.StatusCode == 200) {

          this.JobDetails = JSON.parse(jobs.Output).JobCardOrderDetails;
          this.JobsList = JSON.parse(jobs.Output).GetJCJobDetails; this.SelectedSEList = JSON.parse(jobs.Output).GetJobCardTechnicianList;

          console.log(JSON.parse(jobs.Output));

        }
        else {
          console.log(jobs);
          this.global.ToastShow("Something went wrong, Pls try again later");
        }

        this.global.LoadingHide();

      }, (error) => {
        console.log(error);
        this.global.LoadingHide();
      });

    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }

  }

  SelectTechnicianClick() {

    this.global.SESearchPage = "ETDExceeded";                                  
     const modal = this.modalCtrl.create(SesearchPage, { SEList: this.SelectedSEList, JC: this.SelectedJC });
    modal.present();                    
    
    modal.onDidDismiss(data => {
      this.navCtrl.setRoot(ScetdelistPage);
    })

  }

  SubmitClick() {

    let employees = [];
    this.SelectedSEList.forEach(ele => {

      if (ele.IsSelected) {
        employees.push({
          JobCardHeaderID: ele.JobCardHeader_IC,
          AssignedBy: this.global.UserDetails[0].Employee_IC,
          AssignedTechnicianID: ele.Employee_IC,
          LastActivity: ele.LastActivity
        });
      }

    });

    console.log(employees);

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.post<any>(this.global.HostedPath + "UpdateJC", employees).subscribe(result => {

        if (result.StatusCode == 200) {

          console.log(result);

          this.global.ToastShow("Submitted Succesfully");

          this.navCtrl.setRoot(ScetdelistPage);

        }
        else {
          console.log(result);
          this.global.ToastShow("Something went wrong, Pls try again later");
        }

        this.global.LoadingHide();

      }, (error) => {
        console.log(error);
        this.global.LoadingHide();
      });

    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }

  }

}
