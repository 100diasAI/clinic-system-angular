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
  httpParamsHelper: HttpParamsHelper;

  constructor(private readonly http: HttpClient) {
    this.httpParamsHelper = new HttpParamsHelper();
  }

  getPagedSpecialties(
    params?: SpecialtyPageRequestParams,
  ): Observable<PageRequestResponseData<Specialty>> {
    return this.http.get<PageRequestResponseData<Specialty>>(
      `${environment.apiUrl}/specialties/paged`,
      {
        params: this.httpParamsHelper.setupHttpParams(params),
      },
    );
  }

  getSpecialtyById(specialtyId: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${environment.apiUrl}/specialties/${specialtyId}`);
  }

  createSpecialty(specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>): Observable<Specialty> {
    return this.http.post<Specialty>(`${environment.apiUrl}/specialties`, specialty);
  }

  updateSpecialty(specialty: Omit<Specialty, 'createdAt' | 'updatedAt'>, specialtyId: string): Observable<Specialty> {
    return this.http.put<Specialty>(`${environment.apiUrl}/specialties/${specialtyId}`, specialty);
  }

  deleteSpecialty(specialtyId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/specialties/${specialtyId}`);
  }
  
}