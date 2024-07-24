import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DashboardPage } from '../../KPI/dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { GlobalProvider } from '../../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-sctechpause',
  templateUrl: 'sctechpause.html',
})

export class SctechpausePage {

  PauseList: any = [];
  FinalPauseList: any = [];
  IsSorted: boolean = false;

  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public navParams: NavParams) {

    this.global.HeaderTitle = "Pause";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetPausedTechnicianList?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(result => {

        if (result.StatusCode == 200) {

          this.PauseList = JSON.parse(result.Output);

          this.FinalPauseList = Object.assign([], this.PauseList);

          console.log(this.PauseList);

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

  BackClick() {
    this.navCtrl.setRoot(DashboardPage);
  }

  JCSearch(val) {

    this.FinalPauseList = this.PauseList.filter(e => e.EmployeeName.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JobRole.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.EmployeeCode.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.CompetencyLevel.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.PausedFrom.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.PausedReason.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

    console.log(this.FinalPauseList);

  }

  JCSortClick() {

    if (!this.IsSorted) {
      this.FinalPauseList.sort(({ PausedFrom: a }, { PausedFrom: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalPauseList = Object.assign([], this.PauseList);
      this.IsSorted = false;
    }

  }

}
