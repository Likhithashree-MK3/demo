import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class GlobalProvider {

  HeaderTitle: string = "";

  UserDetails: any = [{ Designation: "" }];

  IsManager: boolean = false;
  WelcomeNavigateType: number = 0;
  ProfilePhotoPath: string = "";
  PendingJCData: any;
  SESearchPage: string = "";
  userpasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  //HostedPath = "http://localhost:64500/api/EicherAPI2/";                                    //Local debug
  //HostedPath = "http://localhost/EicherWeb_Dev/api/EicherAPI/";                             //Local
  HostedPath = "https://namptest.hcltechswnp.com/Eicher_Dev/api/EicherAPI2/";               //Dev
  //HostedPath = "https://namptest.hcltechswnp.com/Eicher_QA/api/EicherAPI2/";                 //Testing
  //HostedPath = "https://namptest.hcltechswnp.com/Eicher_Pilot/api/EicherAPI/";              //Chennai
  //HostedPath = "https://wps_prod.vecv.net/Workshop_Productivity/api/EicherAPI/";            //Live
  //HostedPath = "http://10.210.3.45/Eicher_UAT/api/EicherAPI/";                              //UAT

  IsAlertOpen: boolean = false;

  load: any;

  NetworkMessage: string;

  MasterData: any = {};

  AutoUpdateDetails: any = [];

  ApiGetHeaders = new HttpHeaders({
    'Authorization': '12345Read'
  });

  ApiInsertHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public network: Network) {

  }

  public ToastShow(message: string): any {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();

  }

  public LoadingShow(val: string) {

    this.load = this.loadingCtrl.create({
      content: val
    });

    this.load.present();

  }

  public LoadingHide() {

    this.load.dismiss();

  }

  public CheckInternetConnection(): boolean {

    if (this.network.type != "none") {

      if (this.network.type != "2g") {
        return true;
      }
      else {
        this.NetworkMessage = "Poor Network connectivity";
        return false;
      }

    }
    else {
      this.NetworkMessage = "App requires connection to Internet";
      return false;
    }

  }

  public DisplayTimeFormate(value) {

    let hours = Math.floor(value / 60);

    let minutes = Math.floor(value % 60);

    let h = hours > 9 ? hours : "0" + hours;
    let m = minutes > 9 ? minutes : "0" + minutes;

    return h + ':' + m;

  }

  public IsValid(username: string): boolean {
    return this.userpasswordRegex.test(username);
  }

  public JobTypeFormat(val) {

    if (val != "" && val != null && val != undefined) {
      return val.toString().substr(0, 3);
    }
    else {
      return "";
    }

  }

  public OdoMeterFormat(val) {

    if (val != "" && val != 0 && val != null && val != undefined) {

      let v = val.toString().split("/");

      return v[0] + " km/ " + v[1] + " hrs";

    }
    else {
      return "";
    }

  }

}