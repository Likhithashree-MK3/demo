import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-sesearch',
  templateUrl: 'sesearch.html',
})

export class SesearchPage {

  SEList: any = [];
  FinalSEList: any = [];
  SelectedSEList: any = [];
  SelectedJC: any = [];
  TempSEList: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient,
    public viewCtrl: ViewController) {

    //this.global.HeaderTitle = "Add Technician";

    this.SelectedSEList = this.navParams.get("SEList");
    this.SelectedJC = this.navParams.get("JC");

    console.log(this.SelectedSEList);
    console.log(this.SelectedJC);

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetBranchTechnicians?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(technicians => {

        if (technicians.StatusCode == 200) {

          let employees = JSON.parse(technicians.Output);

          employees.forEach(ele => {

            let emp = this.SelectedSEList.filter(a => a.Employee_IC == ele.Employee_IC);

            if (emp.length > 0) {
              ele.IsSelected = true;
              ele.LastActivity = emp[0].LastActivity;
            }
            else {
              ele.IsSelected = false;
              ele.LastActivity = 0;
            }

          });

          this.SEList = employees;
          this.FinalSEList = Object.assign([], employees);
          console.log(this.FinalSEList);

        }
        else {
          console.log(technicians);
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

  CloseClick() {
    this.viewCtrl.dismiss();
  }

  SEListClick(val) {

    val.IsSelected = !val.IsSelected;

    this.SelectedSEList = this.FinalSEList.filter(a => a.IsSelected);

  }

  SESearch(val) {

    this.FinalSEList = this.SEList.filter(p => p.Name.toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.Code.toLowerCase().trim().includes(val.toLowerCase().trim()));

    console.log(this.FinalSEList);

  };

  SaveClick() {

    let JCEmployees = [];
    this.FinalSEList.forEach(ele => {
      if (ele.IsSelected) {
        JCEmployees.push({
          JobCardHeader_IC: this.SelectedJC.JobCardHedIC,
          AssignedBy: this.global.UserDetails[0].Employee_IC,
          AssignedTechnicianID: ele.Employee_IC,
          LastActivity: ele.LastActivity
        });
      }
    });

    console.log(JCEmployees);

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.post<any>(this.global.HostedPath + "UpdateJC", JCEmployees).subscribe(result => {

        if (result.StatusCode == 200) {

          console.log(result);

          this.global.ToastShow("Submitted Succesfully");

          this.viewCtrl.dismiss();

          // switch (this.global.SESearchPage) {

          //   case "PFA":
          //     this.navCtrl.setRoot(ScpfalistPage);
          //     break;

          //   case "ETDExceeded":
          //     this.navCtrl.setRoot(ScetdelistPage);
          //     break;

          //   case "AllocatedYTS":
          //     this.navCtrl.setRoot(ScallocatedytslistPage);
          //     break;

          //   case "WIP":
          //     this.navCtrl.setRoot(ScwiplistPage);
          //     break;

          //   case "OnHold":
          //     this.navCtrl.setRoot(SconholdlistPage);
          //     break;

          //   case "Completed":
          //     this.navCtrl.setRoot(SccmptedlistPage);
          //     break;

          //     case "CompletedT5Pend":
          //     this.navCtrl.setRoot(Sccmptedt5plistPage);
          //     break;

          //     case "CompletedT5Done":
          //     this.navCtrl.setRoot(Sccmptedt5dlistPage);
          //     break;

          //   default:
          //     this.navCtrl.setRoot(DashboardPage);
          //     break;

          // }

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
    this.viewCtrl.dismiss();
  }

  GetTechnicianCount() {
    return this.FinalSEList.filter(t => t.IsSelected).length;
  }

}