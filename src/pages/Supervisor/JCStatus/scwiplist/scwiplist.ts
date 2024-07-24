import { Component } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScwipdetailsPage } from '../scwipdetails/scwipdetails';
import { HttpClient } from '@angular/common/http';
import { GlobalProvider } from '../../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-scwiplist',
  templateUrl: 'scwiplist.html',
})

export class ScwiplistPage {

  JCList: any = [];
  FinalJCList: any = [];
  FilterList = [];
  FilterStatusList = [];
  IsSorted: boolean = false;
  iscardOpen: boolean = false;
  checkedItems: { [key: string]: boolean } = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController) {

    this.global.HeaderTitle = "Work in Progress";

  }

  ngOnInit(val) {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "GetWorkInProgressJobCardList?BranchID=" + this.global.UserDetails[0].BranchID).subscribe(jobCards => {

        if (jobCards.StatusCode == 200) {

          this.JCList = JSON.parse(jobCards.Output);

          console.log(this.JCList);

          this.FinalJCList = Object.assign([], this.JCList);

          if (val != undefined) {
            val.complete();
          }

        }
        else {
          console.log(jobCards);
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

  JCListClick(jc) {
    if (!this.global.IsManager) {
      this.navCtrl.setRoot(ScwipdetailsPage, { data: jc });
    }
  }

  JCSearch(val) {

    this.FinalJCList = this.JCList.filter(p => p.OrderNo.toLowerCase().trim().includes(val.toString().toLowerCase().trim())
      || p.VehicleNo.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.JobType.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.CustomerName.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.IsKAMCustomer.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.AgeingHours.toString().toLowerCase().trim().includes(val.toLowerCase().trim())
    );

    console.log(this.FinalJCList);

  };

  JCSortClick() {

    if (!this.IsSorted) {
      this.FinalJCList.sort(({ AgeingHours: a }, { AgeingHours: b }) => b - a);
      this.IsSorted = true;
    }
    else {
      this.FinalJCList = Object.assign([], this.JCList);
      this.IsSorted = false;
    }

  }

  FilterClick() {

    this.JCList.forEach(ele => {

      let i = this.FilterStatusList.filter(j => j.name == ele.JobType).length;

      if (i == 0 && ele.JobType != "") {
        this.FilterStatusList.push({
          name: ele.JobType,
          isSelected: false,
          ColorName: ele.ColorName
        });
      }

    });

    this.iscardOpen = !this.iscardOpen;

    console.log(this.FilterStatusList);

  }

  FilterApplyClick() {

    let tempList = this.FilterStatusList.filter(s => s.isSelected);

    console.log(tempList);

    if (tempList.length > 0) {

      this.FilterList = [];
      this.FinalJCList = [];

      this.JCList.filter((ele) => {

        let l = tempList.filter(a => a.name == ele.JobType);

        if (l.length > 0) {
          this.FinalJCList.push(ele);
        }

      });

      console.log(this.FinalJCList);

      this.iscardOpen = !this.iscardOpen;

    }
    else {

      this.iscardOpen = !this.iscardOpen;

      this.FinalJCList = Object.assign([], this.JCList);

    }

  }

  FilterCancelClick() {
    this.iscardOpen = !this.iscardOpen;
  }

  RemoveFilteredata(data) {

    data.isSelected = false;

    let tempList = this.FilterStatusList.filter(s => s.isSelected);

    console.log(tempList);

    if (tempList.length > 0) {

      this.FilterList = [];
      this.FinalJCList = [];

      this.JCList.filter((ele) => {

        let l = tempList.filter(a => a.name == ele.JobType);

        if (l.length > 0) {
          this.FinalJCList.push(ele);
        }

      });

      console.log(this.FinalJCList);

    }
    else {

      this.FinalJCList = Object.assign([], this.JCList);

    }

    this.iscardOpen = false;

  }

}