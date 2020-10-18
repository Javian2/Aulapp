import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AlertModule } from './_alert';
import { AppRoutingModule } from './app-routing.module';
import { AppAdminRoutingModule } from './app-routing-admin.module';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

//COMUNES

import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';

//COMPONENTES

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ActivarComponent } from './components/activar/activar.component';
import { LoginComponent } from './components/login/login.component';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AdminComponent } from './components/admin/admin.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ProfileProfesorComponent } from './components/profile-profesor/profile-profesor.component';
import { ProfileAsignaturaComponent } from './components/profile-asignatura/profile-asignatura.component';
import { VideoconferenciaComponent } from './components/panel-usuario/videoconferencia/videoconferencia.component';

//RUTAS

import { routes } from './app-routing.module';
import { adminRoutes } from './app-routing-admin.module';


//SERVICIOS 

import { UsuarioService } from './services/usuario/usuario.service';
import { LoginGuardGuard } from './services/guards/login-guard.guard';
import { LoginSiGuardGuard } from './services/guards/loginSi-guard.guard';
import { SubirArchivoService } from './services/subir-archivo/subir-archivo.service';
import { AdminGuardGuard } from './services/guards/admin-guard.guard';
import {ProfesorService} from './services/usuario/profesor.service';
import { AlumnoService } from './services/usuario/alumno.service';
import { AsignaturaService } from './services/asignaturas/asignaturas.service';
import { NavbarService } from './services/navbar/navbar.service';
import { ReservaService } from './services/reservas/reserva.service';
import {HorariosService} from './services/horarios/horarios.service';
import {ProfesoresFavService} from './services/profesores-fav/profesores-fav.service';

//FORMULARIOS

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//CRUDS

import { CrudUsuarioComponent } from './controllers/crud-usuario/crud-usuario.component';
import { EditUserComponent } from './controllers/crud-usuario/edit-user/edit-user.component';
import { ProfileEditPasswordComponent } from './components/profile-edit-password/profile-edit-password.component';
import { ProfileEditPasswordEmailComponent } from './components/profile-edit-password-email/profile-edit-password-email.component';
import { CrudProfComponent } from './controllers/crud-prof/crud-prof.component';
import { CrudAsignaturasComponent } from './controllers/crud-asignaturas/crud-asignaturas.component';
import { ImagenPipe } from './pipes/imagen.pipe';
import { FilterPipe } from './pipes/filter.pipe';

import{FilterNombrePipe} from './pipes/filterUsu.pipe';
import{FilterBuscadorPipe} from './pipes/filterBuscador.pipe';
import { FilterReservaPipe } from './pipes/filterReserva.pipe';

import { CrudAlumnoComponent } from './controllers/crud-alumno/crud-alumno.component';
import { EditAsigComponent } from './controllers/crud-asignaturas/edit-asig/edit-asig.component';
import { CrearAsigComponent } from './controllers/crud-asignaturas/crear-asig/crear-asig.component';
import { InfoComponent } from './controllers/crud-alumno/info/info.component';
import { PanelComponent } from './controllers/panel/panel.component';

//PAGINATION

import {NgxPaginationModule} from 'ngx-pagination';
import { RegisterStep2Component } from './components/register-step2/register-step2.component';

//PIPES
/* import { ImagenPipe } from './pipes/imagen.pipe'; */

//REGISTER-STEP2

import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FooterComponent } from './components/shared/footer/footer.component';
import { CrudImparteComponent } from './controllers/crud-imparte/crud-imparte.component';
import { FilterAsigPipe } from './pipes/filterAsig.pipe';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario.component';
import { NavbarPanelusuarioComponent } from './components/shared/navbar-panelusuario/navbar-panelusuario.component';
import { GestionarCuentaComponent } from './components/panel-usuario/gestionar-cuenta/gestionar-cuenta.component';
import { SolicitudesComponent } from './components/panel-usuario/solicitudes/solicitudes.component';
import { FacturasComponent } from './components/panel-usuario/facturas/facturas.component';
import { CrudReservaComponent } from './controllers/crud-reserva/crud-reserva.component';
import { SidebarPanelusuarioComponent } from './components/shared/sidebar-panelusuario/sidebar-panelusuario.component';


//CALENDARIO

import { CalendarioComponent } from './components/panel-usuario/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CrudValoracionesComponent } from './controllers/crud-valoraciones/crud-valoraciones.component';
import { CrudReportesComponent } from './controllers/crud-reportes/crud-reportes.component';
import { HistorialComponent } from './components/panel-usuario/historial/historial.component';
import { TAGComponent } from './components/panel-usuario/videoconferencia/tag/tag.component';
import { ProfesoresfavComponent } from './components/panel-usuario/profesoresfav/profesoresfav.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    ProfileEditComponent,
    AdminComponent,
    SidebarComponent,
    CrudUsuarioComponent,
    EditUserComponent,
    ProfileEditPasswordComponent,
    CrudProfComponent,
    ImagenPipe,
    FilterPipe,
    FilterNombrePipe,
    FilterBuscadorPipe,
    FilterAsigPipe,
    FilterReservaPipe,
    CrudAlumnoComponent,
    CrudAsignaturasComponent, 
    BuscadorComponent, 
    EditAsigComponent, 
    ProfileProfesorComponent, 
    ProfileAsignaturaComponent,
    CrearAsigComponent,
    RegisterStep2Component,
    FooterComponent,
    InfoComponent,
    PanelComponent,
    FacturasComponent,
    CrudImparteComponent,
    ActivarComponent,
    RecuperarComponent,
    ProfileEditPasswordEmailComponent,
    PanelUsuarioComponent,
    NavbarPanelusuarioComponent,
    GestionarCuentaComponent,
    SolicitudesComponent,
    CrudReservaComponent,
    SidebarPanelusuarioComponent,
    VideoconferenciaComponent,
    CalendarioComponent,
    CrudValoracionesComponent,
    CrudReportesComponent,
    HistorialComponent,
    TAGComponent,
    ProfesoresfavComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppAdminRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    RouterModule.forRoot(adminRoutes),
    NgxPaginationModule,
    AutocompleteLibModule,
    AlertModule,
    MDBBootstrapModule.forRoot(), 
    FullCalendarModule
  ],
  providers: [
    UsuarioService,
    ProfesorService,
    LoginGuardGuard,
    LoginSiGuardGuard,
    SubirArchivoService,
    AdminGuardGuard,
    AlumnoService,
    AsignaturaService,
    NavbarService,
    ReservaService,
    HorariosService,
    ProfesoresFavService

  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
