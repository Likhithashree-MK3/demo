import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-governance',
  templateUrl: 'governance.html',
})

export class GovernancePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider) {

    this.global.HeaderTitle = "Governance";


  }

}
