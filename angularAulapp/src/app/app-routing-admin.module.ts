import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';

//CRUD USUARIO

import { EditUserComponent } from './controllers/crud-usuario/edit-user/edit-user.component';
import { EditAsigComponent } from './controllers/crud-asignaturas/edit-asig/edit-asig.component';
import { CrearAsigComponent } from './controllers/crud-asignaturas/crear-asig/crear-asig.component';
import { CrudUsuarioComponent } from './controllers/crud-usuario/crud-usuario.component';
import { CrudProfComponent } from './controllers/crud-prof/crud-prof.component';
import { CrudAsignaturasComponent } from './controllers/crud-asignaturas/crud-asignaturas.component';
import { CrudImparteComponent } from './controllers/crud-imparte/crud-imparte.component';
import {CrudReservaComponent} from './controllers/crud-reserva/crud-reserva.component';
import { CrudValoracionesComponent } from './controllers/crud-valoraciones/crud-valoraciones.component';
import { AdminGuardGuard } from './services/guards/admin-guard.guard';
import { PanelComponent } from './controllers/panel/panel.component';
import { CrudReportesComponent } from './controllers/crud-reportes/crud-reportes.component';

//CRUD ALUMNO
import { CrudAlumnoComponent } from './controllers/crud-alumno/crud-alumno.component';
import { InfoComponent } from './controllers/crud-alumno/info/info.component';


export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent, 
    canActivate: [AdminGuardGuard],
    children:[
      { path: 'crud-usuario', component: CrudUsuarioComponent },
      { path: 'crud-prof', component: CrudProfComponent },
      { path: 'crud-alumno', component: CrudAlumnoComponent },
      { path: 'crud-imparte', component: CrudImparteComponent },
      { path: 'crud-reserva', component: CrudReservaComponent},
      { path: 'crud-valoraciones', component: CrudValoracionesComponent},
      { path: 'crud-reportes', component: CrudReportesComponent},
      { path: 'edit-user/:id', component: EditUserComponent },
      { path: 'crud-asignaturas', component: CrudAsignaturasComponent},
      { path: 'edit-asig/:id', component: EditAsigComponent},
      { path: 'crear-asig', component: CrearAsigComponent},
      { path: 'info/:id', component:InfoComponent},
      { path: 'panel', component:PanelComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AppAdminRoutingModule { }
