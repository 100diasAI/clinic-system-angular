import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/Doctor';
import { CreateDoctorDTO } from '../models/CreateDoctorDTO';
import { UpdateDoctorDTO } from '../models/UpdateDoctorDTO';
import { environment } from '@environments/environment.development';
import { PageRequestResponseData } from '@app/shared/models/PageRequestResponseData';
import { DoctorPageRequestParams } from '@app/shared/models/DoctorPageRequestParams';
import { HttpParamsHelper } from '@app/shared/helpers/httpParamsHelper';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/doctors';
  private httpParamsHelper = new HttpParamsHelper();

  constructor(private http: HttpClient) {}

  getPagedDoctors(params?: DoctorPageRequestParams): Observable<PageRequestResponseData<Doctor>> {
    return this.http.get<PageRequestResponseData<Doctor>>(`${this.apiUrl}/paged`, {
      params: this.httpParamsHelper.setupHttpParams(params)
    });
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }

  createDoctor(doctor: CreateDoctorDTO): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/create`, doctor);
  }

  updateDoctor(id: string, doctor: UpdateDoctorDTO): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

