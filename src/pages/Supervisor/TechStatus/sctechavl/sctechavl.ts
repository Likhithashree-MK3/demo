import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DashboardPage } from '../../KPI/dashboard/dashboard';
import { HttpClient } from '@angular/common/http';
import { GlobalProvider } from '../../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-sctechavl',
  templateUrl: 'sctechavl.html',
})
export class SctechavlPage {

  AvlList: any = [];
  FinalAvlList: any = [];
  IsSorted: boolean = false;

  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public navParams: NavParams) {

      this.global.HeaderTitle = "Available";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetAvailableTechnicianList?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(result => {

        if (result.StatusCode == 200) {

          this.AvlList = JSON.parse(result.Output);

          this.FinalAvlList = Object.assign([], this.AvlList);

          console.log(this.AvlList);

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

    this.FinalAvlList = this.AvlList.filter(e => e.EmployeeName.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JobRole.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.EmployeeCode.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.CompetencyLevel.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.AvailableFrom.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

    console.log(this.FinalAvlList);

  }

  JCSortClick() {

    if (!this.IsSorted) {
      this.FinalAvlList.sort(({ AvailableFrom: a }, { AvailableFrom: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalAvlList = Object.assign([], this.AvlList);
      this.IsSorted = false;
    }

  }  

}