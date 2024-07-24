import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { StdashboardPage } from '../stdashboard/stdashboard';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@IonicPage()
@Component({
  selector: 'page-strealization',
  templateUrl: 'strealization.html',
  providers: [DatePipe] // Provide DatePipe
})

export class StrealizationPage {

  RealizationData: any = {};
  RealizationList: any = [];
  RealizationListCopy: any = [];
  Filterdata = "Last 7 days";
  selectedtype: number = 2;
  filtervalue: boolean = true;
  today: any;
  SrchText: string;
  sortdesc: boolean = true;
  daterange: boolean = false;
  maxDate: string;
  minDate: string;
  fromDate: string = '01/21/2024';
  toDate: string = '03/21/2024';


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public httpClient: HttpClient,
    private datePipe: DatePipe,
    public actionsheetCtrl: ActionSheetController) {

    this.global.HeaderTitle = "Realization";

    var date = new Date();
    this.today = this.datePipe.transform(date, 'dd.MM.yyy');
    console.log(this.RealizationList)

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {
      console.log(this.global.UserDetails)

      this.global.LoadingShow("Please wait...");
      //filter
      this.CallFilterData();

      this.global.LoadingHide();
    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }
  }

  presentCheckboxAlert() {
    // let alert = this.alertCtrl.create({
    //   title: 'Duration',
    //   inputs: [
    //     {
    //       type: 'radio',
    //       label: 'Last Day',
    //       value: '1'
    //     },
    //     {
    //       type: 'radio',
    //       label: 'Last 7 days',
    //       value: '2',
    //       checked: true,
    //     },
    //     {
    //       type: 'radio',
    //       label: 'MTD',
    //       value: '3',
    //     },
    //     {
    //       type: 'radio',
    //       label: 'LM',
    //       value: '4',
    //     },
    //     {
    //       type: 'radio',
    //       label: 'YTD',
    //       value: '5',
    //     },
    //     {
    //       type: 'radio',
    //       label: 'Date Range',
    //       value: '6'
    //     },
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'BtnCancelPopup',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'OK',
    //       cssClass: 'BtnYesPopup',
    //       handler: data => {
    //         console.log('radio data:', data);
    //         this.selectedtype = data;
    //         switch (data) {
    //           case '1':
    //             this.Filterdata = 'Last Day';
    //             break;
    //           case '2':
    //             this.Filterdata = 'Last 7 days';
    //             break;
    //           case '3':
    //             this.Filterdata = 'MTD';
    //             break;
    //           case '4':
    //             this.Filterdata = 'LM';
    //             break;
    //           case '5':
    //             this.Filterdata = 'YTD';
    //             break;
    //           case '6':
    //             this.Filterdata = 'date range';
    //             break;
    //           default:
    //             break;
    //         }
    //         console.log(this.Filterdata);
    //         this.filtervalue = true;
    //         this.CallFilterData();
    //       }
    //     }
    //   ]
    // });
    // alert.present();

    let actionSheet = this.actionsheetCtrl.create({
      title: 'Duration',
      cssClass: 'action-sheets-basic-page',

      buttons: [
        {
          text: 'Last Day',
          handler: () => {
            console.log('Last Day');
            this.Filterdata = 'Last Day';
            this.selectedtype = 1;
            this.filtervalue = true;
            this.daterange = false;
            this.CallFilterData();
          }
        },
        {
          text: 'Last 7 days',
          handler: () => {
            console.log('Last 7 days');
            this.Filterdata = 'Last 7 days';
            this.selectedtype = 2;
            this.filtervalue = true;
            this.daterange = false;
            this.CallFilterData();
          }
        },
        {
          text: 'MTD',
          handler: () => {
            console.log('MTD');
            this.Filterdata = 'MTD';
            this.selectedtype = 3;
            this.filtervalue = true;
            this.daterange = false;
            this.CallFilterData();
          }
        },
        {
          text: 'LM',
          handler: () => {
            console.log('LM');
            this.Filterdata = 'LM';
            this.selectedtype = 4;
            this.filtervalue = true;
            this.daterange = false;
            this.CallFilterData();
          }
        },
        {
          text: 'YTD',
          handler: () => {
            console.log('YTD');
            this.Filterdata = 'YTD';
            this.selectedtype = 5;
            this.filtervalue = true;
            this.daterange = false;
            this.CallFilterData();
          }
        },
        {
          text: 'Date range',
          handler: () => {
            console.log('Date range');
            this.Filterdata = 'Date range';
            this.selectedtype = 6;
            this.filtervalue = false;
            this.daterange = true;
            // this.CallFilterData();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  RemoveFilteredata() {
    // console.log(data);
    // this.FilterList.splice(data, 1);
    this.filtervalue = false;

  }

  CallFilterData() {   

    this.httpClient.get<any>(this.global.HostedPath + "GetTechRealizationDashboardCounts?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=" + this.selectedtype + "&FromeDate=" + this.fromDate + "&ToDate=" + this.toDate
    ).subscribe(jobCards => {

      if (jobCards.StatusCode == 200) {
        console.log(JSON.parse(jobCards.Output)[0])
        this.RealizationData = JSON.parse(jobCards.Output)[0];
        console.log(this.RealizationData)

        //List 
        this.httpClient.get<any>(this.global.HostedPath + "GetTechRealizationDashboardList?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=" + this.selectedtype + "&FromeDate=" + this.fromDate + "&ToDate=" + this.toDate
        ).subscribe(list => {
          this.RealizationList = JSON.parse(list.Output);
          console.log(this.RealizationList);
          this.RealizationList.sort((a, b) => b.RealizationPerc - a.RealizationPerc);
          console.log(this.RealizationList);
          this.RealizationListCopy = this.RealizationList
          console.log(this.RealizationListCopy);
        }, (error) => {
          console.log(error);
          this.global.LoadingHide();
        });
      }
      else {
        console.log(jobCards);
        this.global.ToastShow("Something went wrong, Pls try again later");
      }
    }, (error) => {
      console.log(error);
      this.global.LoadingHide();
    });
  }

  BackClick() {
    this.navCtrl.setRoot(StdashboardPage);
  }

  removeMinus(value) {
    return Math.abs(value); // Returns the absolute value of the number
  }

  Search() {
    console.log(this.SrchText)
    this.RealizationList = this.RealizationListCopy.filter(
      p => p.Jobtype.toLowerCase().trim().includes(this.SrchText.toLowerCase().trim()) ||
        p.OrderNo.toString().includes(this.SrchText.trim()) ||
        p.RealizationPerc.toString().includes(this.SrchText.trim()) ||
        p.RealizationDiff.toString().includes(this.SrchText.trim()) ||
        p.BilledHours.toString().includes(this.SrchText.trim()) ||
        p.WorkedHours.toString().includes(this.SrchText.trim()) ||
        p.Ageing.toString().includes(this.SrchText.trim())
    );
    console.log(this.RealizationList);
  }

  SortClick() {
    this.sortdesc = !this.sortdesc;
    if (this.sortdesc) {
      this.RealizationList.sort((a, b) => b.RealizationPerc - a.RealizationPerc);
    }
    else {
      this.RealizationList.sort((a, b) => a.RealizationPerc - b.RealizationPerc);
    }
    console.log(this.RealizationList)
  }

  FromDateChange(event: any) {
    console.log('fromDate:', this.fromDate);
  }

  ToDateChange(event: any) {
    console.log('To Date:', this.toDate);
  }

  customDateClick() {
    console.log(this.fromDate + "and" + this.toDate)
    if ((this.fromDate == null || this.fromDate == undefined) || (this.toDate == null || this.toDate == undefined)) {
      this.global.ToastShow("Please select date")
    }
    else {
      this.CallFilterData();
    }
  }

}
