import { Component} from '@angular/core';
import * as _ from 'lodash';

import { IonicPage, NavController, NavParams, ToastController, AlertController, Item , PopoverController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { toUnicode } from 'punycode';
import { last } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData:Observable<any>;
  userStatus;

  optionCtrlArray = [
    'profile'
  ]

  optionCtrlIndex = 0
  dataSearch;

  items = []

  constructor(private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private toast: ToastController,
              private alertCtrl: AlertController,
              public popoverCtrl: PopoverController
  ) {}

  ionViewWillLoad() {
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
        duration: 6000
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

  public onClickSearch() {
    if(this.dataSearch){
      let option = this.optionCtrlArray[this.optionCtrlIndex] 
      if(option == 'profile')
        this.onClickProfile()
    }
  }

  private onClickProfile() {
    this.afDatabase.database.ref(`profile/`).once('value')
      .then(async snapshot => {
        let something = await snapshot.exportVal()
        this.items = []

        for (let uid in something)
        {
          let find = false
          let items = []
          for (let itemType in something[uid])
          {
            let item = something[uid][itemType]
            if(item == this.dataSearch || this.dataSearch=='*')
              find = true
          }
          if(find){
            const user = something[uid]
            this.items.push(`${user['lastName']} ${user['firstName']}, @${user['userName']}`)
          }
        }

        console.log(this.dataSearch, this.items)
      })
  }
}
