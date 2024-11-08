import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Specialty } from '../models/Specialty';
import { environment } from '@environments/environment.development';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { SpecialtyPageRequestParams } from '@app/shared/models/SpecialtyPageRequestParams';
import { HttpParamsHelper } from '@app/shared/helpers/httpParamsHelper';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private apiUrl = `${environment.apiUrl}/specializations`;
  private httpParamsHelper = new HttpParamsHelper();

  constructor(private readonly http: HttpClient) {}

  getAllSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(this.apiUrl);
  }

  getSpecialtyById(id: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}/${id}`);
  }

  createSpecialty(specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>): Observable<Specialty> {
    return this.http.post<Specialty>(this.apiUrl, specialty);
  }

  updateSpecialty(id: string, specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}/${id}`, specialty);
  }

  deleteSpecialty(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}