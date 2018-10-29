import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData:Observable<any>;
  userStatus;

  optionCtrlArray = [
    'Paciente',
    'Consulta',
    'Atestado',
    'Relatório',
    'Agenda'
  ]
  optionCtrlIndex = 0;



  constructor(private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private toast: ToastController,
              private alertCtrl: AlertController
  ) {}

  ionViewWillLoad() {
    this.userStatus = this.getUserStatus()
    this.afAuth.authState.subscribe(data => {
      let message;
      if(data && data.email && data.uid){
        message = `Welcome to MedMan, ${data.email}`;
        this.profileData = this.afDatabase.object(`profile/${data.uid}`).valueChanges();
        console.log(this.profileData);
        
      }else
        message = 'No authentication details';
      this.toast
      .create({
        message: message,
        duration: 3000
      })
      .present()
    })
  }

  getUserStatus() {
    this.afAuth.authState.take(1).subscribe(async auth => {
      this.afDatabase.database.ref(`userStatus/${auth.uid}`).once('value')
        .then(async snapshot => {
          this.userStatus = await snapshot.exportVal()
        })
    })
  }

  public onClickAdd(){

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
}
