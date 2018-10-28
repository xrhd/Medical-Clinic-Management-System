import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SinginPage } from '../singin/singin';
import { HomePage } from '../home/home';

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
    this.goToHomePage(this.user);
  }

  private goToHomePage(user):void{
    this.navCtrl.setRoot(HomePage,{"user":user});
    this.navCtrl.popToRoot();
  }
  public onClickGoToSinginPage():void{
    this.navCtrl.push(SinginPage.name);
  }

}
