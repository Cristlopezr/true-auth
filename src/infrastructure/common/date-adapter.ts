export class DateAdapter {
    static addMinutes(minutes: number): Date {
        return new Date(Date.now() + minutes * 60000);
    }
}