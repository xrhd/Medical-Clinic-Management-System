import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceptPage } from './recept';

@NgModule({
  declarations: [
    ReceptPage,
  ],
  imports: [
    IonicPageModule.forChild(ReceptPage),
  ],
})
export class ReceptPageModule {}
