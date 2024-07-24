import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { StytsPage } from '../../Technician/styts/styts';
import { StwipPage } from '../../Technician/stwip/stwip';
import { StpausedPage } from '../../Technician/stpaused/stpaused';
import { StcompletedPage } from '../../Technician/stcompleted/stcompleted';
import { StrealizationPage } from '../strealization/strealization';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';
import { NotificationsPage } from '../../Shared/notifications/notifications';

declare var google;

@IonicPage()
@Component({
  selector: 'page-stdashboard',
  templateUrl: 'stdashboard.html',
  providers: [DatePipe] // Provide DatePipe
})

export class StdashboardPage {

  @ViewChild('halfPieChart') halfPieChart: any;

  DashboardCount: any = {};
  TechnicianDashboard: any = [];
  WorkStatus: any = [];
  OverallJobcard: any = {};
  Filterdata = "Last 7 days";
  filtervalue: boolean = true;
  jchrs;
  nonjchrs;
  Graphdata: any = [];
  selectedtype: number = 2;
  daterange: boolean = false
  maxDate: string;
  minDate: string;
  fromDate: string = '01/21/2024';
  toDate: string = '03/21/2024';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public httpClient: HttpClient,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    private datePipe: DatePipe,
    public actionsheetCtrl: ActionSheetController) {

    // this.global.HeaderTitle = "Dashboard";
    this.menuCtrl.enable(true);

    const currentDate = new Date();
    this.maxDate = currentDate.toISOString().substring(0, 10); //YYYY-MM-DD
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
    this.minDate = sixMonthsAgo.toISOString().substring(0, 10); //YYYY-MM-DD

    this.initGoogleCharts();

  }

  ionViewDidEnter() {
    this.createHalfPieChart();
  }

  ngOnInit() {

    if (this.global.CheckInternetConnection()) {
      console.log(this.global.UserDetails)

      this.global.LoadingShow("Please wait...");

      //filter
      this.CallFilterData();

      //Graph
      this.httpClient.get<any>(this.global.HostedPath + "GetTechDashboardGraphCount?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=1" + "&FromeDate=02/14/2024&ToDate=03/14/2024"
      ).subscribe(jobCards => {

        if (jobCards.StatusCode == 200) {

          this.Graphdata = JSON.parse(jobCards.Output);
          console.log(this.Graphdata);

          //charts
          google.charts.setOnLoadCallback(this.drawLineChart());
          google.charts.setOnLoadCallback(this.drawColumnChart());
          // google.charts.setOnLoadCallback(this.drawDonutChart());
          this.createHalfPieChart();

        }
        else {
          console.log(jobCards);
          this.global.ToastShow("Something went wrong, Pls try again later");
        }

      }, (error) => {
        console.log(error);
        this.global.LoadingHide();
      });

      this.global.LoadingHide();
    }
    else {
      this.global.ToastShow(this.global.NetworkMessage);
    }

    this.TechnicianDashboard = [
      {
        'name': "AVL",
        'count': "4",
        'bgcolor': "assets/imgs/AVL.png"
      },
      {
        'name': "WIP",
        'count': "999",
        'bgcolor': "assets/imgs/WIP.png"
      },
      {
        'name': "YTS",
        'count': "12",
        'bgcolor': "assets/imgs/YTS.png"
      },
      {
        'name': "PAUSE",
        'count': "8",
        'bgcolor': "assets/imgs/HOLD.png"
      }
    ]

  }

  CallFilterData() {

    this.httpClient.get<any>(this.global.HostedPath + "GetTechDashboardCounts?Technician_ID=" + this.global.UserDetails[0].Employee_IC + "&Type=" + this.selectedtype + "&FromeDate=" + this.fromDate + "&ToDate=" + this.toDate
    ).subscribe(jobCards => {

      if (jobCards.StatusCode == 200) {

        this.DashboardCount = JSON.parse(jobCards.Output)[0];
        this.DashboardCount.RealizationPercValue = this.DashboardCount.RealizationPerc / 100

        console.log(this.DashboardCount);
        this.WorkStatus = [
          {
            "status": "Yet to Start",
            "count": this.DashboardCount.YTS,
            'bgcolor': "#feeeb3",
            'icon': "assets/imgs/YTSIcon.png"
          },
          {
            "status": "In Progress",
            "count": this.DashboardCount.WIP,
            'bgcolor': "#B3E8FD",
            'icon': "assets/imgs/InProgressIcon.png"
          },
          {
            "status": "Paused",
            "count": this.DashboardCount.Paused,
            'bgcolor': "#FCB4B4",
            'icon': "assets/imgs/PauseIcon.png"
          },
          {
            "status": "Completed",
            "count": this.DashboardCount.Completed,
            'bgcolor': "#DFF2CB",
            'icon': "assets/imgs/CompletedIcon.png"
          },
        ]
        this.jchrs = this.DashboardCount.JCHours;
        this.nonjchrs = this.DashboardCount.NonJCHours;

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

  drawChart() {

    console.log(this.DashboardCount);

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Status');
    data.addColumn('number', 'Count');
    data.addRows([
      ['Pending For Allocation (T2)', this.DashboardCount.T2PFA],
      ['Allocation', this.DashboardCount.Allocated],
      ['WIP', this.DashboardCount.WIP],
      ['Hold', this.DashboardCount.Hold],
      ['Completed', this.DashboardCount.Completed],
      ['ETD Exceed', this.DashboardCount.PCDExceed],

    ]);

    // Set chart options
    var options = {
      //  'width':400,
      //  'height':300,
      'pieStartAngle': 90,
      'pieEndAngle': 270,
      //  'pieHole': 0.2,
      'pieSliceBorderColor': 'transparent',
      'pieSliceText': 'value',
      'pieSliceTextStyle': {
        color: '#214a8d', // Change the color of the text
        fontSize: 12, // Set the font size (optional)
        bold: true // Set the text to bold (optional)
      },
      slices: {
        0: { color: '#d5dbe4' },
        1: { color: '#7fd8f6' },
        2: { color: '#fff2cd' },
        3: { color: '#fd7f7f' },
        4: { color: '#a8da72' },
        5: { color: '#ffd968' },
      },
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    // chart.draw(data);
    google.visualization.events.addListener(chart, 'select', function () {
      var selectedItem = chart.getSelection()[0];
      // if (selectedItem) {
      //   var value = data.getValue(selectedItem.row, 0); // Assuming the value is in the second column (index 1)
      //   console.log('Clicked value:', value);
      //   if(value=="Pending For Allocation (T2"){
      //     this.navCtrl.setRoot(ScpfalistPage);
      //   }
      //   else if(value=="Allocation"){
      //     this.navCtrl.setRoot('ScallocatedlistPage');
      //   }
      //   else if(value=="WIP"){
      //     this.navCtrl.setRoot(SciplistPage);
      //   }
      //   else if(value=="Hold"){
      //     this.navCtrl.setRoot(ScholdlistPage);
      //   }
      //   else if(value=="Completed"){
      //     this.navCtrl.setRoot('SccompletedlistPage');
      //   }
      //   else if(value=="ETD Exceed"){
      //     this.navCtrl.setRoot(ScpcdelistPage);
      //   }
      // }
    });
  }

  initGoogleCharts() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawColumnChart.bind(this));

    // Add event listener to handle window resize
    window.addEventListener('resize', () => {
      this.drawColumnChart();
      this.drawLineChart();
    });
  }

  drawLineChart() {

    // Calculate chart width and height dynamically
    const chartWidth = window.innerWidth * 1.1; // 110% of window width
    const chartHeight = window.innerHeight * 0.4; // 50% of window height

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Realization');
    data.addColumn({ type: 'string', role: 'annotation' });

    // var LineChartData = [
    //   ['05.02.24-11.02.24', 45, '45%'],
    //   ['12.02.24-18.02.24', 105, '105%'],
    //   ['19.02.24-25.02.24', 75, '75%'],
    //   ['25.02.24-28.02.24', 0, '0%']
    // ];

    console.log(this.Graphdata);

    var LineChartData = [];
    // this.Graphdata.forEach(ele => {
    //   LineChartData.push([this.datePipe.transform(ele.FromDate, 'yy.MM.dd') + '-' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd'),
    //   ele.RealizationPerc, ele.RealizationPerc + '%'])
    // });
    // console.log(LineChartData)

    this.Graphdata.forEach(ele => {
      // Combine dates into a single string
      let combinedDate = this.datePipe.transform(ele.FromDate, 'yy.MM.dd') +
        ' - ' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd');
      LineChartData.push([combinedDate, ele.RealizationPerc, ele.RealizationPerc + '%'])

      // LineChartData.push([this.datePipe.transform(ele.FromDate, 'yy.MM.dd') + '-' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd'),
      // ele.RealizationPerc, ele.RealizationPerc + '%'])
    });

    data.addRows(LineChartData);

    var options = {
      title: 'My Activity',
      titleTextStyle: {
        fontSize: 18
      },
      curveType: 'function',
      'width': chartWidth,
      'height': chartHeight,
      'legend': 'none',
      pointSize: 5,
      pointColor: 'black',
      series: {
        0: { // Series for the main line
          color: '#3E3E3E',
          lineWidth: 2
        },
        1: { // Series for annotations (scatter points)
          color: 'black',
          lineWidth: 0,
        }
      },
      annotations: {
        textStyle: {
          fontSize: 12,
          color: '#3E3E3E',
          bold: true
        },
        stem: {
          length: 10,
          color: '#ffffff'
        },
        annotationTextPosition: 'auto'
      },
      vAxis: {
        title: "% Realization",
        titleTextStyle: {
          bold: true,
          fontSize: 11,
          italic: false
        },
        gridlines: {
          color: 'transparent'
        },
        textPosition: 'none'
      },
      hAxis: {
        textStyle: {
          bold: true,
          color: '#3E3E3E',
        }
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('linechart_div'));
    chart.draw(data, options);


  }

  drawColumnChart() {

    // Calculate chart width and height dynamically
    const chartWidth = window.innerWidth * 1.1; // 110% of window width
    const chartHeight = window.innerHeight * 0.4; // 50% of window height

    // var data = google.visualization.arrayToDataTable([
    //   ['Date', 'Worked', { role: 'style' },{ role: 'annotation' }, 'Billed', { role: 'style' },{ role: 'annotation' }], // Define column headings
    //   ['05.02.24-11.02.24', 45,  'color: #294785;', 45, 30, 'color: #e33239',30],
    //   ['12.02.24-18.02.24', 85,  'color: #294785;', 85, 75, 'color: #e33239',75],
    //   ['19.02.24-25.02.24', 75,  'color: #294785;', 75, 42, 'color: #e33239',42],
    //   ['25.02.24-28.02.24', 38,  'color: #294785;', 38, 22, 'color: #e33239',22]
    // ]);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Date');
    data.addColumn('number', 'Worked');
    data.addColumn({ type: 'string', role: 'style' });
    data.addColumn({ type: 'number', role: 'annotation' });
    data.addColumn('number', 'Billed');
    data.addColumn({ type: 'string', role: 'style' });
    data.addColumn({ type: 'number', role: 'annotation' });

    // Inserting data dynamically
    // var ColumnChartData = [
    //   ['05.02.24-11.02.24', 45, 'color: #294785;', 45, 30, 'color: #e33239', 30],
    //   ['12.02.24-18.02.24', 85, 'color: #294785;', 85, 75, 'color: #e33239', 75],
    //   ['19.02.24-25.02.24', 75, 'color: #294785;', 75, 42, 'color: #e33239', 42],
    //   ['25.02.24-28.02.24', 38, 'color: #294785;', 38, 22, 'color: #e33239', 22]
    // ];
    // console.log(ColumnChartData)

    var ColumnChartData = [];
    // this.Graphdata.forEach(ele => {
    //   ColumnChartData.push([this.datePipe.transform(ele.FromDate, 'yy.MM.dd') + '-' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd'),
    //   ele.WorkedHours, 'color: #294785;', ele.WorkedHours,
    //   ele.BilledHours, 'color: #e33239;', ele.BilledHours])
    // });
    this.Graphdata.forEach(ele => {
      // ColumnChartData.push([this.datePipe.transform(ele.FromDate, 'yy.MM.dd') + '-' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd'),
      // ele.WorkedHours, 'color: #294785;', ele.WorkedHours,
      // ele.BilledHours, 'color: #e33239;', ele.BilledHours])

      // Combine dates into a single string (assuming FromDate and ToDate are valid dates)
      let combinedDate = this.datePipe.transform(ele.FromDate, 'yy.MM.dd') +
        ' - ' + this.datePipe.transform(ele.ToDate, 'yy.MM.dd');
      ColumnChartData.push([combinedDate, ele.WorkedHours, 'color: #294785;', ele.WorkedHours, ele.BilledHours, 'color: #e33239;', ele.BilledHours])
    });
    console.log(ColumnChartData)

    data.addRows(ColumnChartData);

    var options = {
      'title': "My Activity",
      titleTextStyle: {
        fontSize: 18
      },
      'width': chartWidth,
      'height': chartHeight,
      legend: {
        position: 'top', alignment: 'end', textStyle: {
          bold: true,
          fontSize: 12,
          color: '#3E3E3E'
        }
      },
      annotations: {
        textStyle: {
          color: 'white',
          fontSize: 10,
          bold: true
        },
        stem: {
          length: 0
        },
        // alwaysOutside:true,
        // textPosition: 'in'
      },
      series: {
        0: { color: '#294785' }, // Customize color for the first series
        1: { color: '#e33239' } // Customize color for the second series
      },
      vAxis: {
        title: "Realization",
        titleTextStyle: {
          bold: true,
          fontSize: 11,
          italic: false
        },
        gridlines: {
          color: 'transparent'
        },
        textPosition: 'none'
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
        },
        textStyle: {
          bold: true,
        }
      },

    }
    var modelchart = new google.visualization.ColumnChart(document.getElementById('columnchart_div'));
    modelchart.draw(data, options);
  }

  drawDonutChart() {

    console.log(this.jchrs);
    console.log(this.nonjchrs)

    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Non-JC Hours', this.nonjchrs],
      ['JC Hours', this.jchrs]
    ]);

    // Define chart options
    var options = {
      'width': 380,
      'height': 300,
      pieHole: 0.55, // Adjust the size of the hole to resemble the gauge
      pieStartAngle: -90, // Start the pie from the top
      pieSliceBorderColor: 'transparent', // Hide slice borders
      legend: {
        position: 'bottom', alignment: 'center', textStyle: {
          bold: true,
          fontSize: 12,
          color: '#b4b4b6',
          position: 'bottom',
          labels: {
            usePointStyle: true // Use point style (circle)
          }
        }
      },
      slices: {
        0: { color: '#fd7f7f', textStyle: { color: '#001868', bold: true } },
        1: { color: '#a8da72', textStyle: { color: '#001868', bold: true } }
      },
      tooltip: { trigger: 'none' },
    };

    // Instantiate and draw the chart
    var chart = new google.visualization.PieChart(document.getElementById('donutchart_div'));
    chart.draw(data, options);

    // var root = am5.Root.new("chartdiv");

    // root.setThemes([
    //   am5themes_Animated.new(root)
    // ]);

    // var chart = root.container.children.push(
    //   am5radar.RadarChart.new(root, {
    //     panX: false,
    //     panY: false,
    //     startAngle: -180,
    //     endAngle: 0,
    //   })
    // );

    // var axisRenderer = am5radar.AxisRendererCircular.new(root, {
    //   innerRadius: am5.percent(98),
    //   strokeOpacity: 0.1,
    //   minGridDistance: 20
    // });

    // axisRenderer.onPrivate("radius", function(){
    //   axisRenderer.set("minGridDistance", axisRenderer.getPrivate("radius", 1) / 5)
    // })

    // var xAxis = chart.xAxes.push(
    //   am5xy.ValueAxis.new(root, {
    //     maxDeviation: 0,
    //     min: 0,
    //     max: 100,
    //     strictMinMax: true,
    //     renderer: axisRenderer
    //   })
    // );


    // var data = google.visualization.arrayToDataTable([
    //   ['Label', 'Value'],
    //   ['Non-JC Hours', 20],
    // ]);

    // var options = {
    //   width: 400,
    //   height: 200,
    //   redFrom: 90,
    //   redTo: 100,
    //   minorTicks: 5,
    //   max: 100,  // Maximum value of the gauge
    //   greenColor: '#1ABC9C',  // Color for the green zone
    //   redColor: '#E74C3C',    // Color for the red zone
    //   // Angle for the half-circle (180 degrees)
    //   minAngle: -90,
    //   maxAngle: 90,
    //   // Display the gauge in a semi-circle
    //   animation: {
    //     duration: 1000,
    //     easing: 'out'
    //   }
    // };

    // var chart = new google.visualization.Gauge(document.getElementById('donutchart_div'));

    // chart.draw(data, options);


  }

  createHalfPieChart() {
    const canvas = this.halfPieChart.nativeElement;
    const ctx = canvas.getContext('2d');
    const divElement = canvas.parentElement; // Get the parent <div> element

    const halfPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Non-JC Hours', 'JC Hours'],
        datasets: [{
          //data: [this.DashboardCount.JCHours, this.DashboardCount.NonJCHours],
          data:[30,70],
          backgroundColor: [
            '#ff7e81', // Red for Non-JC
            '#a8da72'  // Green for JC
          ],
          borderWidth: 0 // Set border width to 0
        }]
      },
      options: {
        cutoutPercentage: 50,
        rotation: Math.PI,
        circumference: Math.PI,
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true // Use point style (circle)
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        plugins: {
          datalabels: {
            display: false // Ensure that datalabels plugin doesn't interfere
          }
        }
      },
      // Register a custom plugin for drawing data labels
      plugins: [{
        afterDatasetsDraw: function (chartInstance, easing) {
          // To only draw at the end of animation, check for easing === 1
          const ctx = chartInstance.ctx;
          chartInstance.data.datasets.forEach((dataset, i) => {
            const meta = chartInstance.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach((element, index) => {
                ctx.fillStyle = '#083a81'; // EicherBlue color
                const fontSize = 15;
                const fontStyle = '600'; // Semibold font weight
                const fontFamily = 'Hermis FB'; // Hermis FB font family
                ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                const model = element._model;
                const midAngle = model.startAngle + (model.endAngle - model.startAngle) / 2;

                // Calculate position based on segment angle
                const radius = model.outerRadius;
                const textRadius = radius * 0.8; // Adjust this value to position text closer or further from the center
                const x = model.x + textRadius * Math.cos(midAngle);
                const y = model.y + textRadius * Math.sin(midAngle);

                // Additional styles
                ctx.textAlign = 'center'; // Center text horizontally
                ctx.textBaseline = 'middle'; // Center text vertically

                // Get the data value
                const dataValue = dataset.data[index];
                // Ensure dataValue is a number
                if (typeof dataValue === 'number') {
                  // Example numbers
                  const formattedValue = (dataValue < 0 ? '0' : '') + dataValue; // Add leading zero if value is less than 10
                  ctx.fillText(formattedValue + '%', x, y);
                }
              });
            }


          });
        }
      }]
    });

  }

  WorkStatusClick(val) {

    if (val == 'YTS') {
      this.navCtrl.setRoot(StytsPage);
    } else if (val == 'WIP') {
      this.navCtrl.setRoot(StwipPage);
    } else if (val == 'Paused') {
      this.navCtrl.setRoot(StpausedPage);
    } else if (val == 'Completed') {
      this.navCtrl.setRoot(StcompletedPage);
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
    // this.FilterList.splice(data, 1);
    // this.Filterdata = "";
    this.filtervalue = false;
  }

  TypeClick() {
    this.navCtrl.setRoot(StrealizationPage)
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

  NotificationClick() {
    this.navCtrl.setRoot(NotificationsPage);
  }

}