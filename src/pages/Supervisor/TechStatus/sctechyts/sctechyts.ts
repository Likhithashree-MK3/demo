import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { DashboardPage } from '../../KPI/dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-sctechyts',
  templateUrl: 'sctechyts.html',
})

export class SctechytsPage {

  YtsList: any = [];
  FinalYtslList: any = [];
  IsSorted: boolean = false;

  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public navParams: NavParams) {

      this.global.HeaderTitle = "Yet to Start";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetYetToStartTechnicianList?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(result => {

        if (result.StatusCode == 200) {

          this.YtsList = JSON.parse(result.Output);

          this.FinalYtslList = Object.assign([], this.YtsList);

          console.log(this.YtsList);

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

    this.FinalYtslList = this.YtsList.filter(e => e.EmployeeName.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JobRole.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.EmployeeCode.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.CompetencyLevel.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.AvailableFrom.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

    console.log(this.FinalYtslList);

  }

  JCSortClick() {

    if (!this.IsSorted) {
      this.FinalYtslList.sort(({ AvailableFrom: a }, { AvailableFrom: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalYtslList = Object.assign([], this.YtsList);
      this.IsSorted = false;
    }

  }

}
