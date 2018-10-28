import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private toast: ToastController) {

  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      let message;
      if(data && data.email && data.uid)
        message = `Welcome to MedMan, ${data.email}` 
      else
        message = 'No authentication details'
      this.toast
      .create({
        message: message,
        duration: 3000
      })
      .present()
    })
  }

}
