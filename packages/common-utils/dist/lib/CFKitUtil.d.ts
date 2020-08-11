import { Country } from '@7up/common-types';
export declare class CFKitUtil {
    static UNDEFINED_DATE: Date;
    static calculateNett(gross: number, percent: number): number;
    static calculateGross(nett: number, percent: number): number;
    static roundDecimal(value: number, precision?: number): number;
    static createGUID(): string;
    static ODBCDateTimeFormat(value: Date): string;
    static parseODBCdateTime(value: string): Date;
    static isDate(value: any): boolean;
    static isODBCDateTime(value: string): boolean;
    static isAPIDateTime(value: string): boolean;
    static parseAPIDateTime(value: string): Date;
    static parseApiDatesInObject(src: any): any;
    static createApiDatesInObject(src: any): any;
    static parseDatesInObject(src: any): any;
    static createODBCDatesInObject(src: any): any;
    static countries: Country[];
    static country(id: number): Country | undefined;
}
