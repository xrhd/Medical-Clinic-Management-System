import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinginPage } from './singin';

@NgModule({
  declarations: [
    SinginPage,
  ],
  imports: [
    IonicPageModule.forChild(SinginPage),
  ],
})
export class SinginPageModule {}
