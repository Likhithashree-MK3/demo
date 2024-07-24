import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DashboardPage } from '../../KPI/dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { GlobalProvider } from '../../../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-sctechwipl',
  templateUrl: 'sctechwipl.html',
})

export class SctechwiplPage {

  WIPList: any = [];
  FinalWIPList: any = [];
  IsSorted: boolean = false;

  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public navParams: NavParams) {

    this.global.HeaderTitle = "Work in Progress";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetWorkInProgressTechnicianList?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(result => {

        if (result.StatusCode == 200) {

          this.WIPList = JSON.parse(result.Output);

          this.FinalWIPList = Object.assign([], this.WIPList);

          console.log(this.WIPList);

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

    this.FinalWIPList = this.WIPList.filter(e => e.EmployeeName.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JobRole.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.EmployeeCode.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.CompetencyLevel.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.WIPFrom.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JCOrderNo.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

    console.log(this.FinalWIPList);

  }

  JCSortClick() {

    if (!this.IsSorted) {
      this.FinalWIPList.sort(({ WIPFrom: a }, { WIPFrom: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalWIPList = Object.assign([], this.WIPList);
      this.IsSorted = false;
    }

  }

}
