import { Component, OnInit, Input } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ScheduleService } from '@app/core/services/schedule.service';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
    selector: 'app-schedule-calendar',
    standalone: true,
    imports: [
        CommonModule,
        FullCalendarModule
    ],
    template: `
        <full-calendar [options]="calendarOptions"></full-calendar>
    `
})
export class ScheduleCalendarComponent implements OnInit {
    @Input() doctorId!: string;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: []
    };

    constructor(private scheduleService: ScheduleService) {}

    ngOnInit() {
        if (this.doctorId) {
            this.loadEvents();
        }
    }

    public loadEvents() {
        this.scheduleService.getDoctorSchedules(this.doctorId).subscribe({
            next: (schedules) => {
                // Transformar los horarios en eventos del calendario
                const events = schedules.map(schedule => ({
                    title: 'Horario Médico',
                    start: schedule.startTime,
                    end: schedule.endTime
                }));
                this.calendarOptions.events = events;
            },
            error: (error) => console.error('Error cargando horarios:', error)
        });
    }
}