import {CFKitUtil} from './CFKitUtil';

/* calculateGross tests */
test('calculateGross: calculate gross - part a', () => {
    expect(CFKitUtil.calculateGross(45.6,10)).toBe(50.16);
});

/* calculateNett tests */
test('calculateNett: calculate net - part a', () => {
    expect(CFKitUtil.calculateNett(45.6,10)).toBe(41.45);
});

/* roundDecimal tests */
test('roundDecimal: round to two decimals - part a', () => {
    expect(CFKitUtil.roundDecimal(22/7,2)).toBe(3.14);
});

test('roundDecimal: 5 must round up - a', () => {
    expect(CFKitUtil.roundDecimal(0.005,2)).toBe(0.01);
});

test('roundDecimal: 5 must round up - b', () => {
    expect(CFKitUtil.roundDecimal(1.995,2)).toBe(2);
});

/* createGUID tests */
test('roundDecimal: round to two decimals - part a', () => {
    const tmp = CFKitUtil.createGUID();
    expect(tmp === '').toBe(false);
});


/* parseODBCdateTime tests */
test('Parse date from and back to ODBC String', () => {
    const start = "{ts '2019-07-06 08:03:10'}"
    const startDate = CFKitUtil.parseODBCdateTime(start);
    const end = CFKitUtil.ODBCDateTimeFormat(startDate);
    expect(start).toBe(end);
});

/* odbcDateTimeString tests */
test('odbcDateTimeString: Detect valid odbc date time string', () => {
    expect(CFKitUtil.isODBCDateTime("{ts '2019-07-06 00:00:00'}")).toBe(true);
});

test('odbcDateTimeString: Detect an invalid odbcDateTimeString', () => {
    expect(CFKitUtil.isODBCDateTime("not an odbc string")).toBe(false);
});

/* parseDatesInObject tests */
test('parseDatesInObject: ', () => {
    const foo = {
        animal:"cat",
        birthday:"{ts '2019-07-02 12:07:00'}",
        young:[
                {name:"pinky",dob:"{ts '2018-07-04 00:00:00'}"},
                {name:"smurf",dob:"{ts '2019-07-06 00:00:00'}"}
        ],
        checks:["{ts '1972-11-22 07:00:00'}","FOO","{ts '2019-07-02 12:30:40'}"]
    };

    /* IMPORTANT: JS counts month from 0=jan to 11=dec but, odbc month go from 1=jan to 12=dec */
    let out = CFKitUtil.parseDatesInObject(foo);
    expect(out.animal).toBe('cat');
    expect(out.birthday.getMilliseconds()).toBe(new Date(2019,6,2,12,7,0).getMilliseconds());
    expect(out.young[0].dob.getMilliseconds()).toBe(new Date(2018,6,4,0,0,0).getMilliseconds());
    expect(out.young[1].dob.getMilliseconds()).toBe(new Date(2019,6,6,0,0,0).getMilliseconds());
    expect(out.checks[0].getMilliseconds()).toBe(new Date(1972,10,22,12,7,0).getMilliseconds());
    expect(out.checks[1]).toBe('FOO');
    expect(out.checks[2].getMilliseconds()).toBe(new Date(2019,6,2,12,30,40).getMilliseconds());
});


/* createODBCDatesInObject tests */
test('createODBCDatesInObject: ', () => {
    const foo = {
        animal:"cat",
        birthday:new Date(2019,6,2,12,7,0),
        young:[
                {name:"pinky",dob:new Date(2018,6,4,0,0,0)},
                {name:"smurf",dob:new Date(2019,6,6,0,0,0)}
        ],
        checks:[new Date(1972,10,22,12,7,0),"FOO",new Date(2019,6,2,12,30,40)]
    };

    /* IMPORTANT: JS counts month from 0=jan to 11=dec but, odbc month go from 1=jan to 12=dec */
    let out = CFKitUtil.createODBCDatesInObject(foo);
    expect(out.animal).toBe('cat');
    expect(out.birthday).toBe("{ts '2019-07-02 12:07:00'}");
    expect(out.young[0].dob).toBe("{ts '2018-07-04 00:00:00'}");
    expect(out.young[1].dob).toBe("{ts '2019-07-06 00:00:00'}");
    expect(out.checks[0]).toBe("{ts '1972-11-22 12:07:00'}");
    expect(out.checks[1]).toBe('FOO');
    expect(out.checks[2]).toBe("{ts '2019-07-02 12:30:40'}");
});