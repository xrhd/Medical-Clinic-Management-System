import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkspacePage } from './workspace';

export interface consultation {
  doctor: string,
  patient: string,
  date: Date,
  info: string,
  report: string
}

@NgModule({
  declarations: [
    WorkspacePage,
  ],
  imports: [
    IonicPageModule.forChild(WorkspacePage),
  ],
})
export class WorkspacePageModule {}
