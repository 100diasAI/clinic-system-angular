import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createDoctor } from '../models/CreateDoctor';
import { environment } from '@environments/environment.development';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { DoctorPageRequestParams } from '@app/shared/models/DoctorPageRequestParams';
import { HttpParamsHelper } from '@app/shared/helpers/httpParamsHelper';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;
  private httpParamsHelper = new HttpParamsHelper();

  constructor(private http: HttpClient) {}

  getPagedDoctors(params?: DoctorPageRequestParams): Observable<PageRequestResponseData<createDoctor>> {
    return this.http.get<PageRequestResponseData<createDoctor>>(`${this.apiUrl}/paged`, {
      params: this.httpParamsHelper.setupHttpParams(params)
    });
  }

  getDoctorById(id: string): Observable<createDoctor> {
    return this.http.get<createDoctor>(`${this.apiUrl}/${id}`);
  }

  createDoctor(doctor: Omit<createDoctor, 'id'>): Observable<createDoctor> {
    return this.http.post<createDoctor>(this.apiUrl, doctor);
  }

  updateDoctor(doctor: Partial<createDoctor>, id: string): Observable<createDoctor> {
    return this.http.put<createDoctor>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

