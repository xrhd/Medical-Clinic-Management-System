import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user:{ email:String; password:String; } = {email:'',password:''};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  public onCLickLogin():void{
    this.alertCtrl.create({title:'User',subTitle:`email:${this.user.email}\npassword: ${this.user.password}`}).present();
  }

}
