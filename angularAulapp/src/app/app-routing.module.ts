import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivarComponent } from './components/activar/activar.component'
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterStep2Component } from './components/register-step2/register-step2.component';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { LoginSiGuardGuard } from './services/guards/loginSi-guard.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AppAdminRoutingModule } from './app-routing-admin.module';
import { ProfileEditPasswordComponent } from './components/profile-edit-password/profile-edit-password.component';
import { ProfileEditPasswordEmailComponent } from './components/profile-edit-password-email/profile-edit-password-email.component';
import { CrudProfComponent } from './controllers/crud-prof/crud-prof.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import {ProfileProfesorComponent} from './components/profile-profesor/profile-profesor.component';
import {ProfileAsignaturaComponent} from './components/profile-asignatura/profile-asignatura.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario.component';
import { GestionarCuentaComponent } from './components/panel-usuario/gestionar-cuenta/gestionar-cuenta.component';
import { SolicitudesComponent } from './components/panel-usuario/solicitudes/solicitudes.component';
import { FacturasComponent } from './components/panel-usuario/facturas/facturas.component';
import { VideoconferenciaComponent } from './components/panel-usuario/videoconferencia/videoconferencia.component';
import { HistorialComponent } from './components/panel-usuario/historial/historial.component';
import { ProfesoresfavComponent } from './components/panel-usuario/profesoresfav/profesoresfav.component';



export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginSiGuardGuard] },
  { path: 'buscador', component: BuscadorComponent},
  { path: 'register', component: RegisterComponent, canActivate: [LoginSiGuardGuard] },
  { path: 'register-step2', component: RegisterStep2Component },
  { path: 'register-step2/:id', component: RegisterStep2Component },
  { path: 'profile', component: ProfileComponent, canActivate: [LoginGuardGuard] },
  { path: 'profile-asignatura/:id', component: ProfileAsignaturaComponent},
  { path: 'profile-profesor/:id', component: ProfileProfesorComponent},
  { path: 'profile-edit/:id', component:ProfileEditComponent, canActivate: [LoginGuardGuard]},
  { path: 'profile-edit-password/:id', component:ProfileEditPasswordComponent, canActivate: [LoginGuardGuard]},
  { path: 'profile-edit-password-email/:token', component:ProfileEditPasswordEmailComponent},
  { path: 'recuperar', component: RecuperarComponent},
  { path: 'activar/:token', component: ActivarComponent },
  { path: 'panel-usuario', component: PanelUsuarioComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/gestionar-cuenta', component: GestionarCuentaComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/solicitudes', component: SolicitudesComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/facturas', component: FacturasComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/historial', component: HistorialComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/profesoresfav', component: ProfesoresfavComponent, canActivate: [LoginGuardGuard] },
  { path: 'panel-usuario/videoconferencia', component: VideoconferenciaComponent, canActivate: [LoginGuardGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AppAdminRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
