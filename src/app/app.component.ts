import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { BitacoraService } from './core/services/bitacoraService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit{

  constructor(
    private bitacoraService: BitacoraService,
    private router: Router // Para escuchar cambios en la ruta
  ) {}
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.registrarAccion('Usuario Navegó', `Accedió a ${event.urlAfterRedirects}`);
      }
    });
  }
  registrarAccion(username: string, action: string): void {
    // Aquí puedes obtener el nombre del usuario de una sesión o autenticación JWT
    // Por ejemplo, si tienes un servicio de autenticación puedes obtener el nombre de usuario.
    const nombreUsuario = username || 'Usuario Desconocido'; // Reemplaza con el nombre real del usuario

    // Llama al servicio de BitacoraService para registrar la acción
    this.bitacoraService.registrarAccion(nombreUsuario, action).subscribe({
      next: () => {
        console.log(`Acción registrada: ${action}`);
      },
      error: (err) => {
        console.error('Error al registrar la acción en la bitácora', err);
      }
    });
  }
}
