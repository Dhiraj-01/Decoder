import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { BlogCreateComponent } from './components/blog/blog-create/blog-create.component';
import { BlogEditComponent } from './components/blog/blog-edit/blog-edit.component';
import { BlogViewComponent } from './components/blog/blog-view/blog-view.component';
import { BlogRecentComponent } from "./components/blog/blog-recent/blog-recent.component";
import { ContactComponent } from './components/contact/contact.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { CodeRecentComponent } from './components/code/code-recent/code-recent.component';
import { CodeViewComponent } from './components/code/code-view/code-view.component';
import { CodeIdeComponent } from './components/code/code-ide/code-ide.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { UpcomingContestComponent } from './components/upcoming-contest/upcoming-contest.component';
import { CodeUserComponent } from './components/code/code-user/code-user.component';

import { AuthGuard } from "./service/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'ide',
    component: CodeIdeComponent,
  },
  {
    path: 'ide/edit/:id',
    component: CodeIdeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'code/view/:id',
    component: CodeViewComponent,
  },
  // {
  //   path: 'code/recent',
  //   component: CodeRecentComponent,
  // },
  {
    path: 'code/:user',
    component: CodeUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upcoming-contest',
    component: UpcomingContestComponent,
  },
  {
    path: 'questions/recent',
    component: BlogRecentComponent,
  },
  {
    path: 'questions/create',
    component: BlogCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'questions/view/:id',
    component: BlogViewComponent,
  },
  {
    path: 'questions/edit/:id',
    component: BlogEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'upcoming-contest',
    component: UpcomingContestComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'profile/:user',
    component: ProfileComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
