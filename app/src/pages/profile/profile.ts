import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { Profile } from '../../model/profile'


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
              public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  creatProfile() {
    this.afAuth.authState.take(1).subscribe(auth => {
      this.afDatabase.list(`profile/{auth.uid}`).push(this.profile)
        .then(() => {
          this.navCtrl.push('HomePage')
        })
    })
  }

}
