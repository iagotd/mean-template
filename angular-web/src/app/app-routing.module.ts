import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { DataComponent } from './data/data.component';
import { ControlComponent } from './control/control.component'
import { ProfileComponent } from './profile/profile.component'
import { WelcomeComponent } from './welcome/welcome.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { AuthGuard } from './auth.guard';
import { DataGuard } from './data.guard';
import { ControlGuard } from './control.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'data', component: DataComponent, canActivate: [DataGuard] },
  { path: 'control', component: ControlComponent, canActivate: [ControlGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm/:email/:token', component: ConfirmComponent },
  { path: 'confirm', component: ConfirmComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

