import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';

import { AdminPage } from '../admin/admin';
import { DoctorPage } from '../doctor/doctor';
import { ReceptPage } from '../recept/recept';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData:Observable<any>;
  userStatus;

  objectsControl = [
    {
      name:'Paciente'
    },
    {
      name:'Consulta'
    },
    {
      name:'Atestado'
    },
    {
      name:'Relatório'
    },
    {
      name:'Agenda'
    },
  ]

  constructor(private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private toast: ToastController
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

  onClickAdmin() {
    if(this.userStatus == 'admin') {
      this.navCtrl.push(AdminPage.name);
    }
  }

  onClickDoctor() {
    if(this.userStatus == 'admin' || this.userStatus=='doctor') {
      this.navCtrl.push(DoctorPage.name);
    }
  }

  onClickRecept() {
    if(this.userStatus == 'admin' || this.userStatus=='recpt') {
      this.navCtrl.push(ReceptPage.name);
    }
  }

  public onClickAdd(){
    
  }
}
