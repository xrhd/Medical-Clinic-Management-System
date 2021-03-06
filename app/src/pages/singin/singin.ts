import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';


@IonicPage()
@Component({
  selector: 'page-singin',
  templateUrl: 'singin.html',
})
export class SinginPage {

  private user:{ 
    name:string; 
    email:string; 
    password:string; 
    confirmPassword:string
  } = {name:'', email:'',password:'', confirmPassword:''};

  constructor(private afAuth:AngularFireAuth,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SinginPage');
  }

  private loadingDefault(message){
    return this.loadingCtrl.create({
      content: message
    });

  }

  public async onCLickSingin(){
    let load = this.loadingDefault("Criando sua conta.");
    load.present();
    try {
      const { email, password } = this.user;
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      this.goToProfilePage(result);
    } 
    catch (err) {
      let title,subtitle;
      switch (err.code) {
        case "auth/weak-password":
          title = 'Senha fraca';
          subtitle = 'A senha deve ter ao menos 6 caracteres';
          break;
        case "auth/email-already-in-use":
          title = 'Email já está em uso';
          subtitle = 'O endereço de email já esta em uso por outra conta';
          break;
        default:
          title = 'Sem Conecxão';
          subtitle = "Seu dispositivo não encontra-se conectado a internet";
          break;
      }
      this.alertCtrl.create({title:title, subTitle:subtitle,buttons:['OK']}).present();
    }
    finally{
      load.dismiss();
    }
    
  }

  private goToProfilePage(user):void{
    this.modalCtrl.create(ProfilePage,{"user":user},{ enableBackdropDismiss: false }).present();
  }

}

