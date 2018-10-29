import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Profile } from '../../model/profile'
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  private profile = {firstName:'',lastName:'',userName:''} as Profile

  constructor(private afAuth: AngularFireAuth, 
              private afDatabase: AngularFireDatabase,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  creatProfile() {
    this.afAuth.authState.take(1).subscribe(user => {
      this.afDatabase.object(`profile/${user.email.toString()}`).set(this.profile)
        .then(() => {
          this.navCtrl.setRoot(LoginPage);
          this.navCtrl.popToRoot();
        })
    })
  }
}
