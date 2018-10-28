import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SinginPage } from '../singin/singin';

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
    
  }

  public onClickGoToSinginPage():void{
    this.navCtrl.push(SinginPage.name);
  }

}
