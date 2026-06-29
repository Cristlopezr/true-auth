export class DateAdapter {
    static addMinutes(minutes: number): Date {
        return new Date(Date.now() + minutes * 60000);
    }

    static addDays(days: number): Date {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
}