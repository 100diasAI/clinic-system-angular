export interface Schedule {
    doctorId: string;
    scheduleType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'SPECIFIC_DATE';
    dayOfWeek: string | null;
    specificDate: string | null;
    dayOfMonth: number | null;
    startTime: string;
    endTime: string;
    id?: string; // Agregamos el id como opcional
    isActive?: boolean; 
}

export enum ScheduleType {
    WEEKLY = 'WEEKLY',
    DAILY = 'DAILY',
    MONTHLY = 'MONTHLY'
}

export enum DayOfWeek {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7
}