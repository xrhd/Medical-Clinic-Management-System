import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SinginPage } from '../singin/singin';
import { HomePage } from '../home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import { WorkspacePage } from '../workspace/workspace';

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
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private loadingDefault(message){
    return this.loadingCtrl.create({
      content: message
    });

  }

  public async onCLickLogin(){

    let load = this.loadingDefault("Acessando sua conta.");
    load.present();
    try{
      const { email, password } = this.user;
      const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if(result){
        this.navCtrl.push(WorkspacePage.name);
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
        default:
          title = 'Sem Conecxão';
          subtitle = "Seu dispositivo não encontra-se conectado a internet";
          break;
      }

      this.alertCtrl.create({title:title, subTitle:subtitle,buttons:['OK']}).present();
    }finally{
      load.dismiss();
    }
  }
  public onClickGoToSinginPage():void{
    this.navCtrl.push(SinginPage.name);
  }

}
