import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CommunicationPage } from '../communication/communication';
import { DashboardPage } from '../../Supervisor/KPI/dashboard/dashboard';
import { GlobalProvider } from '../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})

export class NotificationsPage {

  isAlertOpen: boolean;
  isNotificationOpen: boolean;
  isOverflow: boolean = false;
  AlertSelectedMessageIDs: number[] = [];
  NotificationSelectedMessageIDs: number[] = [];
  isSelectAllAlertChecked: boolean = false;
  isSelectAllNotificationChecked: boolean = false;
  maxLengthOfMessage: number = 40;
  searchText: string = '';
  filteredAlertMessages: any[] = [];
  filteredNotificationMessages: any[] = [];
  iscardOpen: boolean = false;
  matchingItems: string[] = ['High', 'Medium', 'Low'];
  checkedItems: { [key: string]: boolean } = {};
  previousCheckedItems: { [key: string]: boolean } = {};
  checkedItemsCount: number = 0;

  AlertMessagesReadingCount: number = 0;
  NotificationMessagesReadingCount: number = 0;

  alertMessages = [{
    id: 2,
    name: 'Lokhi',
    date: '23 Jan 2024',
    msg: 'this JC ID go early to home, to yalanka, Bengalure',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'High'
  },
  {
    id: 3,
    name: 'Syed',
    date: '23 Jan 2024',
    msg: 'this JC ID Pause the Job card, he cross more than 15 min',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'High'
  },
  {
    id: 1,
    name: 'Abhi',
    date: '23 Jan 2024',
    msg: 'this JC ID breake the Breake Time',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'Medium'
  },
  {
    id: 4,
    name: 'Madhu',
    date: '23 Jan 2024',
    msg: 'this JC ID breake the Breake Time',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'Low'
  },
  ];

  notificationMessage = [{
    id: 1,
    name: 'Darshan',
    date: '23 Jan 2024',
    msg: 'this JC ID breake the Breake Time',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'High'
  },
  {
    id: 2,
    name: 'Vinay',
    date: '23 Jan 2024',
    msg: 'this JC ID go early to home, to yalanka, Bengalure',
    isReadMessage: false,
    isClickViewMore: false,
    priority: 'Medium'
  }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global:GlobalProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {

      this.global.HeaderTitle="Notification";

    this.isAlertOpen = true;
    this.isNotificationOpen = false;
    console.log("\nAlert Message");
    console.log(this.alertMessages);
    console.log("\nNotification Message");
    console.log(this.notificationMessage);

    // // WE ACN ADD SORTING IN FEATURE , IF NEED TO SORT PRIORITY
    // this.alertMessages.sort(function(a,b){
    //   return a.name.localeCompare(b.name);
    // });

    // console.log("\nAlert Message After Sort");
    // console.log(this.alertMessages);

    this.filteredAlertMessages = this.alertMessages;
    this.filteredNotificationMessages = this.notificationMessage;
    this.ReadingCountAlertMessages();
    this.ReadingCountNotificationMessages();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  // ================================================================ ALERT PAGE ===================================================================//
  openAlertMessages() {
    // alert("Alert");
    this.isAlertOpen = true;
    this.isNotificationOpen = false;
    this.isSelectAllAlertChecked = false;
    this.isSelectAllNotificationChecked = false;
    // this.AlertSelectedMessageIDs = [];
    // this.NotificationSelectedMessageIDs = [];

  }


  // ================================================================ NOTIFICATION PAGE ===========================================================//
  openNotificationMessages() {
    // alert("Notification");
    this.isAlertOpen = false;
    this.isNotificationOpen = true;
    this.isSelectAllAlertChecked = false;
    this.isSelectAllNotificationChecked = false;
    // this.AlertSelectedMessageIDs = [];
    // this.NotificationSelectedMessageIDs = [];
  }

  // ================================================================ DELETE ALERT ===============================================================//

  // SELECTED MESSAGES IDs STORING IN ARRAY
  AlertSelectedMessage(id: number) {

    let index = this.AlertSelectedMessageIDs.indexOf(id);
    if (index > -1) {
      this.AlertSelectedMessageIDs.splice(index, 1);      // Remove The ID if already selected
    } else {
      this.AlertSelectedMessageIDs.push(id);            // Add ID The if not selected
    }
    console.log(this.AlertSelectedMessageIDs);
  }

  // SELECT ALL AND STORE ALL MESSAGES IDs IN ARRAY
  SelectAllAlertMessages() {

    if (!this.isSelectAllAlertChecked) {

      this.AlertSelectedMessageIDs = [];
      for (let item of this.alertMessages) {

        let index = this.AlertSelectedMessageIDs.indexOf(item.id);
        if (index > -1) {
          this.AlertSelectedMessageIDs.splice(index, 1);      // Remove The ID if already selected
        } else {
          this.AlertSelectedMessageIDs.push(item.id);            // Add ID The if not selected
        }
      }
      console.log(this.AlertSelectedMessageIDs);
      this.isSelectAllAlertChecked = true;
    }
    else {
      this.AlertSelectedMessageIDs = [];
      console.log(this.AlertSelectedMessageIDs);
      this.isSelectAllAlertChecked = false;
    }


  }

  deleteAlerts() {

    // alert("Delete Alert");
    if (this.AlertSelectedMessageIDs.length != 0) {

      const confirm = this.alertCtrl.create({
        // title: 'Use this lightsaber?',
        message: 'Are you sure you want to delete selected Messages?',
        cssClass: 'buttonCss',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              for (let id of this.AlertSelectedMessageIDs) {

                const index = this.alertMessages.findIndex(msg => msg.id === id);
                // If the id exists, remove it from the array
                if (index !== -1) {
                  this.alertMessages.splice(index, 1);
                }
              }
              this.AlertSelectedMessageIDs = [];
              console.log('Deleted Sucessfully');
              console.log(this.alertMessages);
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      this.ShowToastMessage("Please select message to delete!", "bottom");
    }
  }

  ShowToastMessage(message: string, position: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  // ================================================================ DELETE NOTIFICATION =======================================================//
  // SELECTED NOTIFICATIONS IDs STORING IN ARRAY
  NotificationSelectedMessage(id: number) {

    let index = this.NotificationSelectedMessageIDs.indexOf(id);
    if (index > -1) {
      this.NotificationSelectedMessageIDs.splice(index, 1);      // Remove The ID if already selected
    } else {
      this.NotificationSelectedMessageIDs.push(id);            // Add ID The if not selected
    }
    console.log(this.NotificationSelectedMessageIDs);
  }

  // SELECT ALL AND STORE ALL NOTIFICATIONS IDs IN ARRAY
  SelectAllNotificationMessages() {

    if (!this.isSelectAllNotificationChecked) {

      this.NotificationSelectedMessageIDs = [];
      for (let item of this.notificationMessage) {

        let index = this.NotificationSelectedMessageIDs.indexOf(item.id);
        if (index > -1) {
          this.NotificationSelectedMessageIDs.splice(index, 1);      // Remove The ID if already selected
        } else {
          this.NotificationSelectedMessageIDs.push(item.id);            // Add ID The if not selected
        }
      }
      console.log(this.NotificationSelectedMessageIDs);
      this.isSelectAllNotificationChecked = true;
    }
    else {
      this.NotificationSelectedMessageIDs = [];
      console.log(this.NotificationSelectedMessageIDs);
      this.isSelectAllNotificationChecked = false;
    }
  }

  deleteNotifications() {
    // alert("Delete Notifications");
    if (this.NotificationSelectedMessageIDs.length != 0) {

      const confirm = this.alertCtrl.create({
        // title: 'Use this lightsaber?',
        message: 'Are you sure you want to delete selected Notification?',
        cssClass: 'buttonCss',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              for (let id of this.NotificationSelectedMessageIDs) {

                const index = this.notificationMessage.findIndex(msg => msg.id === id);
                // If the id exists, remove it from the array
                if (index !== -1) {
                  this.notificationMessage.splice(index, 1);
                }
              }
              this.NotificationSelectedMessageIDs = [];
              console.log('Deleted Sucessfully');
              console.log(this.notificationMessage);
            }
          }
        ]
      });
      confirm.present();
    }
    else {
      this.ShowToastMessage("Please select Notification to delete!", "bottom");
    }
  }

  // ================================================================ ALERT AUTO CHECK ===========================================================//
  isAlertMessageSelected(id: number): boolean {
    return this.AlertSelectedMessageIDs.indexOf(id) !== -1;
  }

  // ================================================================ NOTIFICATION AUTO CHECK ====================================================//
  isNotificationMessageSelected(id: number): boolean {
    return this.NotificationSelectedMessageIDs.indexOf(id) !== -1;
  }

  // ================================================================ SEARCH MESSAGE =============================================================//
  filterAlertMessages() {
    if (this.searchText.trim() === '') {
      this.filteredAlertMessages = this.alertMessages; // If search text is empty, show all messages
    } else {
      this.filteredAlertMessages = this.alertMessages.filter(message =>
        message.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        message.msg.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Filter messages based on name or msg
    }
  }

  // ================================================================ SEARCH NOTIFICATION ========================================================//
  filterNotificationMessages() {
    if (this.searchText.trim() === '') {
      this.filteredNotificationMessages = this.notificationMessage; // If search text is empty, show all messages
    } else {
      this.filteredNotificationMessages = this.notificationMessage.filter(message =>
        message.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        message.msg.toLowerCase().includes(this.searchText.toLowerCase())
      ); // Filter messages based on name or msg 
    }
  }

  // ================================================================ COUNT - READ AND UNREAD =====================================================//
  ReadingCountAlertMessages() {

    this.AlertMessagesReadingCount = 0;
    for (let i of this.alertMessages) {
      if (i.isReadMessage == false) {
        this.AlertMessagesReadingCount++;
      }
    }
    console.log("AlertMessagesReadingCount : " + this.AlertMessagesReadingCount);
  }

  ReadingCountNotificationMessages() {

    this.NotificationMessagesReadingCount = 0;
    for (let i of this.notificationMessage) {
      if (i.isReadMessage == false) {
        this.NotificationMessagesReadingCount++;
      }
    }
    console.log("NotificationMessagesReadingCount : " + this.NotificationMessagesReadingCount);

  }
  // ================================================================ ALERT - READ AND UNREAD =====================================================//

  alertReadMessage(item) {
    item.isReadMessage = true;
    this.ReadingCountAlertMessages();
  }

  // ================================================================ NOTIFICATION - READ AND UNREAD =============================================//

  notificationReadMessage(item) {
    item.isReadMessage = true;
    this.ReadingCountNotificationMessages();
  }

  // ================================================================ BACKTO DASHBOARD ==========================================================//
  backToDashBoard() {
    this.navCtrl.setRoot(DashboardPage);
  }

  // ================================================================ GO TO COMMUNICATION ======================================================//
  CommunicationClick() {
    this.navCtrl.setRoot(CommunicationPage);
  }

  // ================================================================ SHOW MORE ================================================================//
  showFullMessage(item: any) {
    item.isClickViewMore = !item.isClickViewMore;
  }

  // ================================================================ FILTER ===================================================================//
  FilterClick() {

    console.log("Length of CheckedItemsCount " + this.getCheckedItemCount());
    this.iscardOpen = !this.iscardOpen;
  }

  BtnOk() {

    // Update previousCheckedItems to current state before any changes are made
    this.previousCheckedItems = { ...this.checkedItems };
    console.log(this.checkedItems);

    // CLOSING MODEL
    this.iscardOpen = !this.iscardOpen;
  }

  BtnCancel() {

    // RESTORE PREVIOUS STATE OF CHECKEDITEMS
    this.checkedItems = { ...this.previousCheckedItems };
    console.log(this.checkedItems);

    // CLOSING MODEL 
    this.iscardOpen = !this.iscardOpen;
  }

  getCheckedItemCount(): number {

    this.checkedItemsCount = 0;
    for (const key in this.checkedItems) {
      if (this.checkedItems[key]) {
        this.checkedItemsCount++;
      }
    }
    // console.log("Length of CheckedItemsCount " + this.checkedItemsCount);
    return this.checkedItemsCount;
  }

  // ================================================================ REMOVE FILTER ==============================================================//
  removeItem(item: string) {

    delete this.checkedItems[item];
    console.log(this.checkedItems);
  }

}
