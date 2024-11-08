import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { Schedule } from '@core/models/schedule.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl1 = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  createSchedule(schedule: Schedule): Observable<Schedule> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<Schedule>(`${this.apiUrl1}`, schedule, { headers })
      .pipe(
        tap(response => console.log('Respuesta del servidor:', response)),
        catchError(error => {
          console.error('Error en createSchedule:', error);
          return throwError(() => error);
        })
      );
  }

  getDoctorSchedules(doctorId: string): Observable<Schedule[]> {
    console.log('Realizando petición para doctor:', doctorId);
    return this.http.get<Schedule[]>(`${this.apiUrl1}/doctor/${doctorId}`).pipe(
      tap(response => console.log('Respuesta completa del servidor:', JSON.stringify(response, null, 2)))
    );
  }

  updateSchedule(scheduleId: string, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.apiUrl1}/${scheduleId}`, schedule);
  }
}