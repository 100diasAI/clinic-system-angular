import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DoctorService } from '@core/services/doctor.service';
import { Doctor } from '@core/models/Doctor';
import { AddScheduleComponent } from '../../components/add-schedule/add-schedule.component';
import { ScheduleCalendarComponent } from '../../components/schedule-calendar/schedule-calendar.component';
@Component({
  selector: 'app-manage-schedules-page',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    ScheduleCalendarComponent
  ],
  templateUrl: './manage-schedules-page.component.html',
  styleUrls: ['./manage-schedules-page.component.scss']
})
export class ManageSchedulesPageComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctorId: string = '';
  @ViewChild(ScheduleCalendarComponent) calendar!: ScheduleCalendarComponent;

  constructor(
    private doctorService: DoctorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getPagedDoctors().subscribe({
      next: (response: any) => {
        this.doctors = response.content;
      },
      error: (error: any) => {
        console.error('Error loading doctors:', error);
      }
    });
  }

  onDoctorSelected(doctorId: string) {
    this.selectedDoctorId = doctorId;
  }

  openAddScheduleDialog() {
    const dialogRef = this.dialog.open(AddScheduleComponent, {
      width: '600px',
      data: {
        doctorId: this.selectedDoctorId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.calendar.loadEvents();
      }
    });
  }
}
