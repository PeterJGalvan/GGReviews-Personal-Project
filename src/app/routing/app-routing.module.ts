import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from '../feed/feed.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { GameComponent } from '../game/game.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';
import { RegistrationComponent } from '../registration/registration.component';
import { SigninComponent } from '../signin/signin.component';

export const routes: Routes = [
  { path: '', component: SigninComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'feed/:id', component: FeedComponent },
  { path: 'reviews/:id', component: FeedComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'game/:id', component: GameComponent },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
