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

  private profile = {firstName:'',lastName:'',userName:'', mail:'', status:''} as Profile

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
    if(this.profile.userName){
      this.afAuth.authState.take(1).subscribe(user => {

        this.profile['mail'] = user.email
        this.profile['status'] = 'patient'

        this.afDatabase.object(`profile/${user.uid}`).set(this.profile)
          .then(() => {
            this.navCtrl.setRoot(LoginPage);
            this.navCtrl.popToRoot();
          })
      })
    }
    
  }
}
