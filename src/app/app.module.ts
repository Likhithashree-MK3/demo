import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';
import { GlobalProvider } from '../providers/global/global';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from '../pages/Shared/login/login';
import { WelcomePage } from '../pages/Shared/welcome/welcome';
import { HeaderPage } from '../pages/Shared/header/header';
import { DashboardPage } from '../pages/Supervisor/KPI/dashboard/dashboard';
import { UtilizationPage } from '../pages/Supervisor/KPI/utilization/utilization';
import { RealizationPage } from '../pages/Supervisor/KPI/realization/realization';
import { ProductivityPage } from '../pages/Supervisor/KPI/productivity/productivity';
import { SctechavlPage } from '../pages/Supervisor/TechStatus/sctechavl/sctechavl';
import { SctechwiplPage } from '../pages/Supervisor/TechStatus/sctechwipl/sctechwipl';
import { SctechytsPage } from '../pages/Supervisor/TechStatus/sctechyts/sctechyts';
import { SctechpausePage } from '../pages/Supervisor/TechStatus/sctechpause/sctechpause';
import { StatisticsPage } from '../pages/Supervisor/KPI/statistics/statistics';
import { SesearchPage } from '../pages/Supervisor/JCStatus/sesearch/sesearch';
import { ScpfalistPage } from '../pages/Supervisor/JCStatus/scpfalist/scpfalist';
import { ScetdelistPage } from '../pages/Supervisor/JCStatus/scetdelist/scetdelist';
import { ScpfadetailsPage } from '../pages/Supervisor/JCStatus/scpfadetails/scpfadetails';
import { ScetdedetailsPage } from '../pages/Supervisor/JCStatus/scetdedetails/scetdedetails';
import { ScallocatedytslistPage } from '../pages/Supervisor/JCStatus/scallocatedytslist/scallocatedytslist';
import { ScallocatedytsdetailsPage } from '../pages/Supervisor/JCStatus/scallocatedytsdetails/scallocatedytsdetails';
import { ScwiplistPage } from '../pages/Supervisor/JCStatus/scwiplist/scwiplist';
import { ScwipdetailsPage } from '../pages/Supervisor/JCStatus/scwipdetails/scwipdetails';
import { SconholdlistPage } from '../pages/Supervisor/JCStatus/sconholdlist/sconholdlist';
import { SconholddetailsPage } from '../pages/Supervisor/JCStatus/sconholddetails/sconholddetails';
import { SccmptedlistPage } from '../pages/Supervisor/JCStatus/sccmptedlist/sccmptedlist';
import { SccmpteddetailsPage } from '../pages/Supervisor/JCStatus/sccmpteddetails/sccmpteddetails';
import { Sccmptedt5plistPage } from '../pages/Supervisor/JCStatus/sccmptedt5plist/sccmptedt5plist';
import { Sccmptedt5pdetailsPage } from '../pages/Supervisor/JCStatus/sccmptedt5pdetails/sccmptedt5pdetails';
import { Sccmptedt5dlistPage } from '../pages/Supervisor/JCStatus/sccmptedt5dlist/sccmptedt5dlist';
import { Sccmptedt5ddetailsPage } from '../pages/Supervisor/JCStatus/sccmptedt5ddetails/sccmptedt5ddetails';

import { StdashboardPage } from '../pages/Technician/stdashboard/stdashboard';
import { StrealizationPage } from '../pages/Technician/strealization/strealization';
import { StytsPage } from '../pages/Technician/styts/styts';
import { StwipPage } from '../pages/Technician/stwip/stwip';
import { StcompletedPage } from '../pages/Technician/stcompleted/stcompleted';
import { StpausedPage } from '../pages/Technician/stpaused/stpaused';
import { SependingjcPage } from '../pages/Technician/sependingjc/sependingjc';
import { FooterPage } from '../pages/Shared/footer/footer';
import { NotificationsPage } from '../pages/Shared/notifications/notifications';
import { CommunicationPage } from '../pages/Shared/communication/communication';
import { ProfilePage } from '../pages/Shared/profile/profile';
import { GovernancePage } from '../pages/Shared/governance/governance';

@NgModule({
  declarations: [
    MyApp,

    //Shared
    LoginPage,
    WelcomePage,
    HeaderPage,
    FooterPage,
    NotificationsPage,
    CommunicationPage,
    ProfilePage,
    GovernancePage,

    //Supervisor
    DashboardPage,
    UtilizationPage,
    RealizationPage,
    ProductivityPage,
    SctechavlPage,
    SctechwiplPage,
    SctechytsPage,
    SctechpausePage,
    StatisticsPage,
    SesearchPage,
    ScpfalistPage,
    ScpfadetailsPage,
    ScetdelistPage,
    ScetdedetailsPage,
    ScallocatedytslistPage,
    ScallocatedytsdetailsPage,
    ScwiplistPage,
    ScwipdetailsPage,
    SconholdlistPage,
    SconholddetailsPage,
    SccmptedlistPage,
    SccmpteddetailsPage,
    Sccmptedt5plistPage,
    Sccmptedt5pdetailsPage,
    Sccmptedt5dlistPage,
    Sccmptedt5ddetailsPage,

    //Technician
    StdashboardPage,
    StrealizationPage,
    SependingjcPage,
    StytsPage,
    StwipPage,
    StpausedPage,
    StcompletedPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    //Shared
    LoginPage,
    WelcomePage,
    HeaderPage,
    FooterPage,
    NotificationsPage,
    CommunicationPage,
    ProfilePage,
    GovernancePage,

    //Supervisor
    DashboardPage,
    UtilizationPage,
    RealizationPage,
    ProductivityPage,
    SctechavlPage,
    SctechwiplPage,
    SctechytsPage,
    SctechpausePage,
    StatisticsPage,
    SesearchPage,
    ScpfalistPage,
    ScpfadetailsPage,
    ScetdelistPage,
    ScetdedetailsPage,
    ScallocatedytslistPage,
    ScallocatedytsdetailsPage,
    ScwiplistPage,
    ScwipdetailsPage,
    SconholdlistPage,
    SconholddetailsPage,
    SccmptedlistPage,
    SccmpteddetailsPage,
    Sccmptedt5plistPage,
    Sccmptedt5pdetailsPage,
    Sccmptedt5dlistPage,
    Sccmptedt5ddetailsPage,

    //Technician
    StdashboardPage,
    StrealizationPage,
    SependingjcPage,
    StytsPage,
    StwipPage,
    StpausedPage,
    StcompletedPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalProvider,
    Network,
    Camera
  ]
})

export class AppModule { }
