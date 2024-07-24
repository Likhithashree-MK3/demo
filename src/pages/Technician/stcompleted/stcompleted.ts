import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StdashboardPage } from '../stdashboard/stdashboard';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-stcompleted',
  templateUrl: 'stcompleted.html',
})

export class StcompletedPage {

  clickedindex: any;
  DisplayRow: boolean = false;

  YtsList: any = [];
  YtsListCopy: any = [];
  SrchText: string;
  sortdesc: boolean = true;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Completed";

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {
      console.log(this.global.UserDetails)
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

  ViewClick(ind) {
    this.DisplayRow = !this.DisplayRow;
    this.clickedindex = ind;
  }

  CallListData() {

    this.httpClient.get<any>(this.global.HostedPath + "GetTechCompleted?Technician_ID=" + this.global.UserDetails[0].Employee_IC).subscribe(list => {

      if (list.StatusCode == 200) {

        this.YtsList = JSON.parse(list.Output);

        this.YtsList.sort((a, b) => b.T1 - a.T1);
        console.log(this.YtsList);
        this.YtsListCopy = this.YtsList
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
        p.CustomerName.toLowerCase().includes(this.SrchText.toLowerCase().trim()) ||
        p.ServiceAdvisor.toString().includes(this.SrchText.trim()) ||
        p.Ageing.toString().includes(this.SrchText.trim()) ||
        p.T1.toString().includes(this.SrchText.trim()) ||
        p.EDD.toString().includes(this.SrchText.trim()) ||
        p.ETD.toString().includes(this.SrchText.trim()) ||
        p.StartDateTime.toString().includes(this.SrchText.trim()) ||
        p.EndDateTime.toString().includes(this.SrchText.trim())
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
