import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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

  constructor(private afAuth: AngularFireAuth,
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private toast: ToastController
  ) {}

  ionViewWillLoad() {
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

}
