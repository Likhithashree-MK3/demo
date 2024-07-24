import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RealizationPage } from '../realization/realization';
import { HttpClient } from '@angular/common/http';
import { GlobalProvider } from '../../../../providers/global/global';

declare var google;

@IonicPage()
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html',
})

export class StatisticsPage {

  TodaysDate: any;
  GraphDetials: any;
  JCTypeDetials: any;
  ModelTypeDetials: any;

  constructor(public navCtrl: NavController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public navParams: NavParams) {

      this.global.HeaderTitle = "Statistics";

    //google.charts.setOnLoadCallback(this.drawChart());

  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      let date = new Date();
      this.TodaysDate = date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + ((date.getDate() + 1) > 9 ? (date.getDate()) : ("0" + (date.getDate())));

      this.httpClient.get<any>(this.global.HostedPath + "GetRealizationStatisticsGraph?BranchID=" + this.global.UserDetails[0].BranchID + "&Type=5&FromeDate=" + this.TodaysDate + "&ToDate=" + this.TodaysDate).subscribe(result => {

        if (result.StatusCode == 200) {

          this.GraphDetials = JSON.parse(result.Output);

          console.log(this.GraphDetials);

          var JCDetails = [['Status', 'Realization', { role: 'annotation' }]]

          this.GraphDetials.JCType.forEach(ele => {

            JCDetails.push([ele.Jobtype, ele.RealizationPerc, (ele.RealizationPerc + '%')])

          });

          var ModelDetails = [['Model', 'Count', { role: 'annotation' }]]

          this.GraphDetials.ModelType.forEach(ele => {

            ModelDetails.push([ele.ModelType, ele.RealizationPerc, ele.RealizationPerc])

          });

          google.charts.setOnLoadCallback(this.drawChart(JCDetails, ModelDetails));

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
    this.navCtrl.setRoot(RealizationPage);
  }

  drawChart(JCDetails, ModelDetails) {

    var data = google.visualization.arrayToDataTable(JCDetails);

    var options = {
      //title: 'JC Type',
      annotations: {
        textStyle: {
          fontSize: 12,
          color: '#000000',
          bold: true
        },
        alwaysOutside: true,
        stem: {
          length: 0,
        },
      },
      titleTextStyle: {
        fontSize: 18
      },
      width: 400,
      height: 300,
      legend: 'none',
      vAxis: {
        //title: "JC Type",
        titleTextStyle: {
          bold: true,
          fontSize: 13,
        },
        gridlines: {
          color: 'transparent'
        },
        textStyle: {
          bold: true,
        }
      },
      hAxis: {
        title: "Realization %",
        titleTextStyle: {
          bold: true,
          fontSize: 13,
        },
        gridlines: {
          color: 'transparent'
        }
      }
    }

    var chart = new google.visualization.BarChart(document.getElementById('chart_jc'));
    chart.draw(data, options);

    //Model
    var modeldata = google.visualization.arrayToDataTable(ModelDetails);

    var modeloptions = {
      //title: "Model Type",
      width: 400,
      height: 300,
      legend: 'none',
      annotations: {
        textStyle: {
          color: 'black',
          fontSize: 12,
          bold: true
        },
        stem: {
          length: 0
        },
        alwaysOutside: true
      },

      vAxis: {
        title: "Realization %",
        titleTextStyle: {
          bold: true,
          fontSize: 13,
        },
        gridlines: {
          color: 'transparent'
        },
        viewWindow: {
          min: 0,
          max: 100
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
        },
        slantedText: true,
        slantedTextAngle: -45,
        textStyle: {
          bold: true,
        }
      },

    }

    var modelchart = new google.visualization.ColumnChart(document.getElementById('chart_model'));
    modelchart.draw(modeldata, modeloptions);


  }

}