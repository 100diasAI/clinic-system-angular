import { Component, OnInit } from '@angular/core';
import { BitacoraService } from '../../core/services/bitacoraService';

interface Bitacora {
  username: string;
  action: string;
  timestamp: string;
}

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {

  // Asegúrate de declarar 'bitacoras' como un arreglo de 'Bitacora'
  bitacoras: Bitacora[] = [];

  constructor(private bitacoraService: BitacoraService) { }

  ngOnInit(): void {
    this.cargarBitacoras();
  }

  cargarBitacoras(): void {
    this.bitacoraService.obtenerBitacoras().subscribe(data => {
      this.bitacoras = data;  // Ahora esto no dará el error
    });
  }

  registrarAccion(): void {
    const username = 'usuarioEjemplo'; // Este valor debe provenir de la sesión o JWT del usuario
    const action = 'Acción de ejemplo'; // Aquí puede ser cualquier acción relevante
    this.bitacoraService.registrarAccion(username, action).subscribe(() => {
      this.cargarBitacoras();
    });
  }
}
