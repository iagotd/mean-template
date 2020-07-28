import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { DataComponent } from './data/data.component';
import { ControlComponent } from './control/control.component';
import { AuthService } from './auth.service';
import { ThingService } from './thing.service';
import { AuthGuard } from './auth.guard';
import { DataGuard } from './data.guard';
import { ControlGuard } from './control.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmComponent,
    DataComponent,
    ControlComponent,
    ProfileComponent,
    NotFoundComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService, ThingService, AuthGuard, DataGuard, ControlGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
