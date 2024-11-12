import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Bitacora {
  username: string;
  action: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {

  private apiUrl = 'https://clinica-seguros-backend-production.up.railway.app/api/bitacora';

  constructor(private http: HttpClient) { }

  registrarAccion(username: string, action: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar?username=${username}&action=${action}`, {});
  }

  obtenerBitacoras(): Observable<Bitacora[]> {
    return this.http.get<Bitacora[]>(`${this.apiUrl}/listar`);
  }
}
