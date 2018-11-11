import { Component} from '@angular/core';
import * as _ from 'lodash';

import { IonicPage, NavController, NavParams, ToastController, AlertController, Item , PopoverController, Platform} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { toUnicode } from 'punycode';
import { last } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-workspace',
  templateUrl: 'workspace.html',
})
// export class WorkspacePage {

//   constructor(public navCtrl: NavController, public navParams: NavParams) {
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad WorkspacePage');
//   }

// }

export class WorkspacePage {

  profileData:Observable<any>;
  userStatus;

  optionCtrlArray = [
    'profile'
  ]

  optionCtrlIndex = 0
  dataSearch;

  items = []


  
  pages = {
    page1:"Working",
    page2:"Calendar",
    page3:"User"
  }
  pageView;

  private _agendaList:{
    servico:any;
    local:any;
  }[][] = new Array(31);

  data = {}  as {
    "ano":string,
    "mes":string,
    "dia":string
  }

  private _calendario:{
    date:any;
    daysInThisMonth: any;
    daysInLastMonth: any;
    daysInNextMonth: any;
    monthNames: string[];
    currentMonth: any;
    currentYear: any;
    currentDate: any;
  }; 



  constructor(private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private platform: Platform,
              private toast: ToastController,
              private alertCtrl: AlertController,
              public popoverCtrl: PopoverController
  ) {


    this.platform.ready().then(()=>{      
      this.setCalendario();
      this.getDaysOfMonth();
    });
  }

  ionViewWillLoad() {

  let d = new Date();

  this.data.ano = d.getFullYear().toString();
  this.data.mes = d.getMonth().toString();
  this.data.dia = d.getDate().toString();

  this.pageView = this.pages.page1;



    this.userStatus = this.getUserStatus()
    this.afAuth.authState.subscribe(data => {
      let message;
      if(data && data.email && data.uid){
        message = `Welcome to MedMan, ${data.email}`;
        this.profileData = this.afDatabase.object(`profile/${data.uid}`).valueChanges();
        
      }else
        message = 'No authentication details';
      this.toast
      .create({
        message: message,
        duration: 2000
      })
      .present()
    })
  }

  getUserStatus() {
    this.afAuth.authState.take(1).subscribe(async auth => {
      this.afDatabase.database.ref(`userStatus/${auth.uid}`).once('value')
        .then(async snapshot => {
          this.userStatus = await snapshot.child('status').exportVal()
          console.log('user status', this.userStatus)
        })
    })
  }

  showMenu(){
    let alert = this.alertCtrl.create({title:'Selecione um módulo'});
    alert.addButton({text:'Cancel'});
    alert.addButton({
      text:'Ok',
      handler: data =>{
        this.optionCtrlIndex =  parseInt(data);
      }
    });

    let i = 0;
    this.optionCtrlArray.map((name)=>{
      alert.addInput({
        type:'radio',
        label:name,
        value:i.toString()
      });
      i++;
    });

    alert.present();    
  }

  setItems() {
    this.afAuth.authState.subscribe(async auth => {
      this.afDatabase.database.ref(`${this.optionCtrlArray[this.optionCtrlIndex]}/`).once('value')
        .then(async snapshot => {
          let something = await snapshot.exportVal()
          this.items = []
          for (let item in something)
            this.items.push(`${item}: ${something[item].valueOf()}`.toString())
          console.log(this.items)
        })
    })
  }




  setPageView(pageView:string){
    this.pageView = pageView;
  }

  isPageView(pageView:string){
    if(this.pageView == pageView) return true;
    return false;
  }

  // -----------  AgendaList --------------

  private updateAgendaList():void{
    // let dateEvents:{servico:any;local:any;}[] = new Array();
    // dateEvents.push({
    //   servico:{
    //     id:12,
    //     data: "2018-08-15T04:15:00",
    //     local_id:12,
    //     preco:36.40,
    //     categoria_id:1,
    //     duracao: "40 min",
    //     nClientes:1
    //   },
    //   local:{
    //     id:12,
    //     endereco:"Rua afonso quaresma, 31",
    //     lat:13,
    //     lng:12
    //   }
    // });
    // dateEvents.push({
    //   servico:{
    //     id:13,
    //     data: "2018-08-15T05:15:00",
    //     local_id:12,
    //     preco:36.40,
    //     categoria_id:1,
    //     duracao:"60 min",
    //     nClientes:5
    //   },
    //   local:{
    //     id:12,
    //     endereco:"Rua afonso quaresma, 31",
    //     lat:13,
    //     lng:12
    //   }
    // });

    // let agendaList:{servico:any;local:any}[][] = new Array(31);
    // agendaList[15] =  dateEvents;
    // this.setAgendaList(agendaList);
  }

  private setAgendaList(agendaList:{servico:any;local:any;}[][]):void{
    this._agendaList = agendaList;
  }

  // -----------  Calendar -----------------

  private setCalendario():void{
    this._calendario = {
      date:new Date(),
      daysInThisMonth: null,
      daysInLastMonth: null,
      daysInNextMonth: null,
      monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ],
      currentMonth: null,
      currentYear: null,
      currentDate: null,
    };
  }

  private getDaysOfMonth():void {
    this._calendario.daysInThisMonth = new Array();
    this._calendario.daysInLastMonth = new Array();
    this._calendario.daysInNextMonth = new Array();
    this._calendario.currentMonth = this._calendario.monthNames[this._calendario.date.getMonth()];
    this._calendario.currentYear = this._calendario.date.getFullYear();
    if(this._calendario.date.getMonth() === new Date().getMonth()) {
      this._calendario.currentDate = new Date().getDate();
    } else {
      this._calendario.currentDate = 999;
    }

    var firstDayThisMonth = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth(), 
      1
    ).getDay();
    var prevNumOfDays = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth(),
      0
    ).getDate();
    for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
      this._calendario.daysInLastMonth.push(i);
    }
  
    var thisNumOfDays = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth()+1, 
      0
    ).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      this._calendario.daysInThisMonth.push(i+1);
    }
  
    var lastDayThisMonth = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth()+1, 
      0
    ).getDay();
    var nextNumOfDays = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth()+2, 
      0
    ).getDate();
    for (var i = 0; i < (6-lastDayThisMonth); i++) {
      this._calendario.daysInNextMonth.push(i+1);
    }
    var totalDays = 
      this._calendario.daysInLastMonth.length
      +this._calendario.daysInThisMonth.length
      +this._calendario.daysInNextMonth.length;
    if(totalDays<36) {
      for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
        this._calendario.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth():void {
    this._calendario.date = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth(), 
      0
    );
    this.getDaysOfMonth();
  }
  goToNextMonth():void {
    this._calendario.date = new Date(
      this._calendario.date.getFullYear(), 
      this._calendario.date.getMonth()+2, 
      0
    );
    this.getDaysOfMonth();
  }
  setCalendarCurrentDate(day:Number):void{
    this._calendario.currentDate = day;
  }
  getCalendarCurrentDate():Number{
    return this._calendario.currentDate;
  }
  getCalendarCurrentDateEvents(day:Number):{servico:any,local:any}[]{
    return this._agendaList[parseInt(day.toString())];
  }
  getTimeFromEvent(date:String):String{
    let dt:Date = new Date(date.toString());
    return dt.getHours().toString()+":"+dt.getMinutes().toString();
  }
  checkEvent(day:number):boolean{
    if(this._agendaList[day]!=null){ return true; }
    return false;
  }
}
