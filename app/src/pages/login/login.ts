import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SinginPage } from '../singin/singin';
import { HomePage } from '../home/home';

import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private user:{ email:string; password:string; } = {email:'',password:''};

  constructor(private afAuth:AngularFireAuth,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  public async onCLickLogin(){
    try{
      const { email, password } = this.user;
      const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if(result){
        this.goToHomePage(this.user);
      }
    }catch(err){
      let title,subtitle;
      switch (err.code) {
        case "auth/wrong-password":
          title = 'Senha Incorreta';
          subtitle = "A senha é inválida ou antiga";
          break;
        case "auth/user-not-found":
          title = 'Usuario não foi encontrado';
          subtitle = "Não há registro de usuário correspondente a este email";
          break;
      }

      this.alertCtrl.create({title:title, subTitle:subtitle,buttons:['OK']}).present();
    }
  }

  private goToHomePage(user):void{
    this.navCtrl.setRoot(HomePage,{"user":user});
    this.navCtrl.popToRoot();
  }
  public onClickGoToSinginPage():void{
    this.navCtrl.push(SinginPage.name);
  }

}
