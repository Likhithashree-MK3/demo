import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { UtilizationPage } from '../utilization/utilization';
import { RealizationPage } from '../realization/realization';
import { ProductivityPage } from '../productivity/productivity';
import { ScpfalistPage } from '../../JCStatus/scpfalist/scpfalist';
import { ScetdelistPage } from '../../JCStatus/scetdelist/scetdelist';
import { ScallocatedytslistPage } from '../../JCStatus/scallocatedytslist/scallocatedytslist';
import { ScwiplistPage } from '../../JCStatus/scwiplist/scwiplist';
import { SconholdlistPage } from '../../JCStatus/sconholdlist/sconholdlist';
import { SccmptedlistPage } from '../../JCStatus/sccmptedlist/sccmptedlist';
import { Sccmptedt5plistPage } from '../../JCStatus/sccmptedt5plist/sccmptedt5plist';
import { Sccmptedt5dlistPage } from '../../JCStatus/sccmptedt5dlist/sccmptedt5dlist';
import { SctechavlPage } from '../../TechStatus/sctechavl/sctechavl';
import { SctechwiplPage } from '../../TechStatus/sctechwipl/sctechwipl';
import { SctechytsPage } from '../../TechStatus/sctechyts/sctechyts';
import { SctechpausePage } from '../../TechStatus/sctechpause/sctechpause';
import { NotificationsPage } from '../../../Shared/notifications/notifications';

@IonicPage()

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {

  DashboardDetails: any = {};
  SelectedFilter = "2";
  SelectedFilterName = "Last 7 Days";
  SearchFromDate: any;
  SearchToDate: any;
  Last6Month: any;
  TodaysDate: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController) {

    this.menuCtrl.enable(true);

    let date = new Date();
    let date1 = new Date();

    let d1 = new Date(date.setMonth(date.getMonth() - 6));
    this.Last6Month = d1.getFullYear() + "-" + ((d1.getMonth() + 1) > 9 ? (d1.getMonth() + 1) : ("0" + (d1.getMonth() + 1))) + "-" + ((d1.getDate() + 1) > 9 ? (d1.getDate()) : ("0" + (d1.getDate())));

    this.TodaysDate = date1.getFullYear() + "-" + ((date1.getMonth() + 1) > 9 ? (date1.getMonth() + 1) : ("0" + (date1.getMonth() + 1))) + "-" + ((date1.getDate() + 1) > 9 ? (date1.getDate()) : ("0" + (date1.getDate())));

  }

  ngOnInit() {

    console.log(this.global.IsManager);

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

      this.httpClient.get<any>(this.global.HostedPath + "GetSupDashboardCounts?BranchID=" + this.global.UserDetails[0].BranchID + "&Type=" + this.SelectedFilter + "&FromeDate=" + fromDate + "&ToDate=" + toDate).subscribe(result => {

        if (result.StatusCode == 200) {

          this.DashboardDetails = JSON.parse(result.Output)[0];
          this.DashboardDetails.UtilizationPercRange = this.DashboardDetails.UtilizationPerc / 100;
          this.DashboardDetails.RealizationPercRange = this.DashboardDetails.RealizationPerc / 100;
          this.DashboardDetails.ProductivityPercRange = this.DashboardDetails.ProductivityPerc / 100;

          console.log(this.DashboardDetails);

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

  JcBtnClick(value) {

    if (value == "Pending") {
      this.navCtrl.setRoot(ScpfalistPage);
    }
    else if (value == "ETD") {
      this.navCtrl.setRoot(ScetdelistPage);
    }
    else if (value == "AllocatedYTS") {
      this.navCtrl.setRoot(ScallocatedytslistPage);
    }
    else if (value == "WIP") {
      this.navCtrl.setRoot(ScwiplistPage);
    }
    else if (value == "Hold") {
      this.navCtrl.setRoot(SconholdlistPage);
    }
    else if (value == "Completed") {
      this.navCtrl.setRoot(SccmptedlistPage);
    }
    else if (value == "Completed T5 Pending") {
      this.navCtrl.setRoot(Sccmptedt5plistPage);
    }
    else if (value == "Completed T5 Done") {
      this.navCtrl.setRoot(Sccmptedt5dlistPage);
    }

  }

  TechAVLClick() {
    this.navCtrl.setRoot(SctechavlPage);
  }

  TechWIPClick() {
    this.navCtrl.setRoot(SctechwiplPage);
  }

  TechYTSClick() {
    this.navCtrl.setRoot(SctechytsPage)
  }

  TechPAUSEClick() {
    this.navCtrl.setRoot(SctechpausePage)
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
    //this.FilterList.splice(data, 1);
  }

  UtilizationClick(e) {

    this.navCtrl.setRoot(UtilizationPage)

  }

  RealizationClick(e) {

    this.navCtrl.setRoot(RealizationPage)

  }

  ProductivityClick(e) {

    this.navCtrl.setRoot(ProductivityPage)

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

  NotificationClick() {
    this.navCtrl.setRoot(NotificationsPage);
  }

}