import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { DashboardPage } from '../dashboard/dashboard';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-utilization',
  templateUrl: 'utilization.html',
})

export class UtilizationPage {

  UtilizationDetails: any = {};
  EmployeeListUtilization: any = [];
  FinalEmployeeListUtilization: any = [];
  EmployeeDetailsUtilization: any = {};
  FilterList = ["Last 7 days"];
  clickedindex;
  isExpanded: boolean = false;
  SelectedFilter = "2";
  SelectedFilterName = "Last 7 Days";
  LastDay: any;
  SearchFromDate: any;
  SearchToDate: any;
  Last6Month: any;
  TodaysDate: any;
  IsSorted: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {

    this.global.HeaderTitle = "Utilization";

    this.LastDay = new Date(new Date().setDate(new Date().getDate() - 1));

    let date = new Date();
    let date1 = new Date();

    let d1 = new Date(date.setMonth(date.getMonth() - 6));
    this.Last6Month = d1.getFullYear() + "-" + ((d1.getMonth() + 1) > 9 ? (d1.getMonth() + 1) : ("0" + (d1.getMonth() + 1))) + "-" + ((d1.getDate() + 1) > 9 ? (d1.getDate()) : ("0" + (d1.getDate())));

    this.TodaysDate = date1.getFullYear() + "-" + ((date1.getMonth() + 1) > 9 ? (date1.getMonth() + 1) : ("0" + (date1.getMonth() + 1))) + "-" + ((date1.getDate() + 1) > 9 ? (date1.getDate()) : ("0" + (date1.getDate())));

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      let fromDate;
      let toDate;

      if (this.SelectedFilter == "6") {
        let d1 = new Date(this.SearchFromDate);
        fromDate = d1.getFullYear() + "-" + ((d1.getMonth() + 1) > 9 ? (d1.getMonth() + 1) : ("0" + (d1.getMonth() + 1))) + "-" + ((d1.getDate() + 1) > 9 ? (d1.getDate()) : ("0" + (d1.getDate())));
        let d2 = new Date(this.SearchToDate);
        toDate = d2.getFullYear() + "-" + ((d2.getMonth() + 1) > 9 ? (d2.getMonth() + 1) : ("0" + (d2.getMonth() + 1))) + "-" + ((d2.getDate() + 1) > 9 ? (d2.getDate()) : ("0" + (d2.getDate())));
      }
      else {
        fromDate = this.TodaysDate;
        toDate = this.TodaysDate;
      }

      this.httpClient.get<any>(this.global.HostedPath + "GetDashboardUtilization?BranchID=" + this.global.UserDetails[0].BranchID + "&Type=" + this.SelectedFilter + "&FromeDate=" + fromDate + "&ToDate=" + toDate).subscribe(result => {

        if (result.StatusCode == 200) {

          this.UtilizationDetails = JSON.parse(result.Output)[0];

          console.log(this.UtilizationDetails);

          this.httpClient.get<any>(this.global.HostedPath + "GetEmployeeListUtilization?BranchID=" + this.global.UserDetails[0].BranchID + "&Type=" + this.SelectedFilter + "&FromeDate=" + fromDate + "&ToDate=" + toDate).subscribe(result => {

            if (result.StatusCode == 200) {

              this.EmployeeListUtilization = JSON.parse(result.Output);

              this.FinalEmployeeListUtilization = Object.assign([], this.EmployeeListUtilization);

              console.log(this.FinalEmployeeListUtilization);

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
          console.log(result);
          this.global.ToastShow("Something went wrong, Pls try again later");
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

  BackClick() {
    this.navCtrl.setRoot(DashboardPage);
  }

  FilterClick1() {

    let alert = this.alertCtrl.create({
      title: 'Duration',
      inputs: [
        {
          type: 'radio',
          label: 'YTD',
          value: "5",
          checked: (this.SelectedFilter == "5") ? true : false
        },
        {
          type: 'radio',
          label: 'LM',
          value: "4",
          checked: (this.SelectedFilter == "4") ? true : false
        },
        {
          type: 'radio',
          label: 'MTD',
          value: "3",
          checked: (this.SelectedFilter == "3") ? true : false
        },
        {
          type: 'radio',
          label: 'Last 7 Days',
          value: "2",
          checked: (this.SelectedFilter == "2") ? true : false
        },
        {
          type: 'radio',
          label: 'Last Day',
          value: "1",
          checked: (this.SelectedFilter == "1") ? true : false
        },
        {
          type: 'radio',
          label: 'Date Range',
          value: "6",
          checked: (this.SelectedFilter == "6") ? true : false
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: (data) => {

            this.SelectedFilter = data;

            switch (data) {
              case "1":
                this.SelectedFilterName = "Last Day";
                break;
              case "2":
                this.SelectedFilterName = "Last 7 Days";
                break;
              case "3":
                this.SelectedFilterName = "MTD";
                break;
              case "4":
                this.SelectedFilterName = "LM";
                break;
              case "5":
                this.SelectedFilterName = "YTD";
                break;
              case "6":
                this.SelectedFilterName = "Date Range";
                break;
              default:
                this.SelectedFilterName = "Last 7 Days";
                break;
            }

            if (this.SelectedFilter != "6") {
              this.ngOnInit();
            }

          }
        }
      ]
    });
    alert.present();

  }

  FilterClick() {

    let actionSheet = this.actionSheetCtrl.create({

      title: 'Select filter option',
      buttons: [
        {
          text: 'Last Day',
          handler: () => {
            this.SelectedFilter = "1";
            this.SelectedFilterName = "Last Day";
            this.ngOnInit();
          }
        },
        {
          text: 'Last 7 Days',
          handler: () => {
            this.SelectedFilter = "2";
            this.SelectedFilterName = "Last 7 Days";
            this.ngOnInit();
          }
        },
        {
          text: 'MTD',
          handler: () => {
            this.SelectedFilter = "3";
            this.SelectedFilterName = "MTD";
            this.ngOnInit();
          }
        },
        {
          text: 'LM',
          handler: () => {
            this.SelectedFilter = "4";
            this.SelectedFilterName = "LM";
            this.ngOnInit();
          }
        },
        {
          text: 'YTD',
          handler: () => {
            this.SelectedFilter = "5";
            this.SelectedFilterName = "YTD";
            this.ngOnInit();
          }
        },
        {
          text: 'Date Range',
          handler: () => {
            this.SelectedFilter = "6";
            this.SelectedFilterName = "Date Range";
          }
        }
      ],
      enableBackdropDismiss: true
    });

    actionSheet.present();

  }

  RemoveFilteredata(data) {
    console.log(data);
    this.FilterList.splice(data, 1);
  }

  DownArrowClick(i, emp) {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      let fromDate = "12-12-2024";

      this.httpClient.get<any>(this.global.HostedPath + "GetEmployeeDetailsUtilization?EmployeeID=" + emp.EmployeeID + "&CurrentDate=" + fromDate).subscribe(result => {

        if (result.StatusCode == 200) {

          this.EmployeeDetailsUtilization = JSON.parse(result.Output)[0];

          console.log(this.EmployeeDetailsUtilization);

          this.clickedindex = i;
          this.isExpanded = !this.isExpanded;

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

  EmployeeSearch(val) {

    this.FinalEmployeeListUtilization = this.EmployeeListUtilization.filter(e => e.EmployeeName.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.CompetencyLevel.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.UtilizationPerc.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.UtilizationDiff.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.JobRole.toLowerCase().trim().includes(val.toLowerCase().trim())
      || e.EmployeeCode.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

  }

  EmployeeSortClick() {

    if (!this.IsSorted) {
      this.FinalEmployeeListUtilization.sort(({ UtilizationPerc: a }, { UtilizationPerc: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalEmployeeListUtilization = Object.assign([], this.EmployeeListUtilization);
      this.IsSorted = false;
    }

  }

  SearchClick() {

    if (this.SearchFromDate != undefined && this.SearchFromDate != null && this.SearchFromDate != ""
      && this.SearchToDate != undefined && this.SearchToDate != null && this.SearchToDate != "") {

      this.ngOnInit();

    }
    else {
      this.global.ToastShow("Please enter From date and To date");
    }

  }

}
