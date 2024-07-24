import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationsPage } from '../notifications/notifications';
import { GlobalProvider } from '../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-communication',
  templateUrl: 'communication.html',
})
export class CommunicationPage {

  SelectedFilter = "2";
  SelectedFilterName = "Last 7 Days";

  communicationDetails = [{
    id: 1,
    date: '23 Jan 2024',
    msg: 'Recall Campain is relese. please refer document',
  }, {
    id: 2,
    date: '23 Jan 2024',
    msg: 'Recall Campain is relese. please refer document',
  },
  {
    id: 3,
    date: '23 Jan 2024',
    msg: 'Recall Campain is relese. please refer document',
  },

  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController) {

    this.global.HeaderTitle = "Communication Section";

  }


  // ================================================================ BACKTO NOTIFICATION ==========================================================//
  backToNotification() {
    this.navCtrl.setRoot(NotificationsPage)
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
            // this.ngOnInit();
          }
        },
        {
          text: 'Last 7 Days',
          handler: () => {
            this.SelectedFilter = "2";
            this.SelectedFilterName = "Last 7 Days";
            // this.ngOnInit();
          }
        },
        {
          text: 'MTD',
          handler: () => {
            this.SelectedFilter = "3";
            this.SelectedFilterName = "MTD";
            // this.ngOnInit();
          }
        },
        {
          text: 'LM',
          handler: () => {
            this.SelectedFilter = "4";
            this.SelectedFilterName = "LM";
            // this.ngOnInit();
          }
        },
        {
          text: 'YTD',
          handler: () => {
            this.SelectedFilter = "5";
            this.SelectedFilterName = "YTD";
            // this.ngOnInit();
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

}
