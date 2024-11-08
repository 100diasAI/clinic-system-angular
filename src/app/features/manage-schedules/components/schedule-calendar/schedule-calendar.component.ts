import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ScheduleService } from '@core/services/schedule.service';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-schedule-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule
  ],
  template: `
    <div class="calendar-wrapper">
      <full-calendar #calendar [options]="calendarOptions"></full-calendar>
    </div>
  `,
  styles: [`
    .calendar-wrapper {
      height: 100%;
      min-height: 500px;
      padding: 1rem;
    }
    ::ng-deep {
      .fc-event {
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .fc-event:hover {
        filter: brightness(0.9);
      }
      .fc-timegrid-event {
        border-radius: 4px !important;
      }
      .fc-day-today {
        background-color: rgba(0,0,0,0.02) !important;
      }
      .fc-timegrid-slot {
        height: 40px !important;
      }
    }
  `]
})
export class ScheduleCalendarComponent implements OnInit, OnChanges {
  @Input() doctorId!: string;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: '00:00:00',
    slotMaxTime: '24:00:00',
    allDaySlot: false,
    slotDuration: '00:30:00',
    weekends: true,
    editable: false,
    selectable: false,
    selectMirror: true,
    dayMaxEvents: true,
    eventOverlap: false,
    nowIndicator: true,
    height: 'auto',
    expandRows: true,
    events: [],
    locale: 'es'
  };

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    if (this.doctorId) {
      this.loadEvents();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['doctorId'] && !changes['doctorId'].firstChange) {
      console.log('DoctorId cambió:', this.doctorId);
      this.loadEvents();
    }
  }

  loadEvents() {
    console.log('Cargando eventos para doctor:', this.doctorId);
    this.scheduleService.getDoctorSchedules(this.doctorId).subscribe({
      next: (schedules) => {
        console.log('Horarios recibidos (raw):', JSON.stringify(schedules, null, 2));
        
        if (!Array.isArray(schedules)) {
          console.error('Los horarios recibidos no son un array:', schedules);
          return;
        }

        const calendarEvents = schedules.map(schedule => {
          console.log('Procesando horario individual:', JSON.stringify(schedule, null, 2));
          try {
            const dates = this.createEventDate(schedule);
            console.log('Fechas generadas:', dates);
            return {
              id: schedule.id,
              title: `Horario ${this.getScheduleTypeText(schedule.scheduleType)}`,
              start: dates.start,
              end: dates.end,
              backgroundColor: this.getEventColor(schedule.scheduleType),
              borderColor: this.getEventColor(schedule.scheduleType),
              display: 'block',
              extendedProps: {
                scheduleId: schedule.id,
                scheduleType: schedule.scheduleType
              }
            };
          } catch (error) {
            console.error('Error procesando horario:', error);
            return null;
          }
        }).filter(event => event !== null);

        console.log('Eventos del calendario procesados:', calendarEvents);
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(calendarEvents);
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
      }
    });
  }

  private getScheduleTypeText(type: string): string {
    const types = {
      'WEEKLY': 'Semanal',
      'DAILY': 'Diario',
      'MONTHLY': 'Mensual'
    };
    return types[type as keyof typeof types] || type;
  }

  private formatDateTime(dateTimeArray: number[]): string {
    try {
      if (!dateTimeArray || !Array.isArray(dateTimeArray)) {
        console.error('Formato de fecha inválido:', dateTimeArray);
        return '';
      }

      // Para fechas específicas (DAILY)
      if (dateTimeArray.length === 3) {
        const [year, month, day] = dateTimeArray;
        return new Date(year, month - 1, day).toISOString().split('T')[0];
      }
      
      // Para horas (startTime y endTime)
      if (dateTimeArray.length === 2) {
        const [hours, minutes] = dateTimeArray;
        const date = new Date();
        date.setHours(hours, minutes, 0);
        return date.toISOString();
      }

      console.error('Formato de fecha/hora no reconocido:', dateTimeArray);
      return '';
    } catch (error) {
      console.error('Error al formatear fecha/hora:', error);
      return '';
    }
  }

  private createEventDate(schedule: any): { start: string, end: string } {
    let baseDate = new Date();
    
    switch (schedule.scheduleType) {
      case 'DAILY':
        if (schedule.specificDate) {
          const [year, month, day] = schedule.specificDate;
          baseDate = new Date(year, month - 1, day);
        }
        break;
      case 'WEEKLY':
        if (schedule.dayOfWeek !== null && schedule.dayOfWeek !== undefined) {
          baseDate = this.getNextDayOfWeek(schedule.dayOfWeek);
        }
        break;
      case 'MONTHLY':
        if (schedule.dayOfMonth !== null && schedule.dayOfMonth !== undefined) {
          baseDate = this.getNextDayOfMonth(schedule.dayOfMonth);
        }
        break;
    }

    const [startHours, startMinutes] = schedule.startTime;
    const [endHours, endMinutes] = schedule.endTime;
    
    const start = new Date(baseDate);
    start.setHours(startHours, startMinutes, 0);
    
    const end = new Date(baseDate);
    end.setHours(endHours, endMinutes, 0);

    return {
      start: start.toISOString(),
      end: end.toISOString()
    };
  }

  private getEventColor(scheduleType: string): string {
    switch (scheduleType) {
      case 'WEEKLY':
        return '#4CAF50';
      case 'DAILY':
        return '#2196F3';
      case 'MONTHLY':
        return '#9C27B0';
      default:
        return '#757575';
    }
  }

  private getNextDayOfWeek(dayOfWeek: number): Date {
    const date = new Date();
    const currentDay = date.getDay();
    const distance = (dayOfWeek - currentDay + 7) % 7;
    date.setDate(date.getDate() + distance);
    return date;
  }

  private getNextDayOfMonth(dayOfMonth: number): Date {
    const date = new Date();
    date.setDate(dayOfMonth);
    if (date < new Date()) {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }
} 