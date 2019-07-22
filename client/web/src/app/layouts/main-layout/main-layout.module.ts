import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAINLAYOUT_ROUTES } from './main-layout.routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(MAINLAYOUT_ROUTES)
  ],
  exports: [
  ],
  providers: []
})
export class MainLayoutModule { }
