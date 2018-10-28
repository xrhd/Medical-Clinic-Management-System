import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-singin',
  templateUrl: 'singin.html',
})
export class SinginPage {

  private user:{ 
    name:String; 
    email:String; 
    password:String; 
    confirmPassword:String
  } = {name:'', email:'',password:'', confirmPassword:''};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SinginPage');
  }

  public onCLickSingin():void{

  }

}
