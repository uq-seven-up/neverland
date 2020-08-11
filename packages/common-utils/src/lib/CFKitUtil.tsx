export class CFKitUtil 
{
    /* ######################################################## */
    /* Constants and Enums. */
    /**
     * Instead of using NULL this defines the value for an unspecified date.
     */
    public static UNDEFINED_DATE = new Date(1900,0,1,0,0,0,0);
    /* ######################################################## */


    /* ######################################################## */
    /* Numbers and Money */

     /**
     * Calculates a nett money amount from a gross amount.
     * 
     * @param gross - The base value.
     * @param percent - The percentage to be applied.
     * @returns The calculated nett amount.
     */
    public static calculateNett(gross:number,percent:number):number{
        const _tax = (1 + (percent * 0.01));
        return CFKitUtil.roundDecimal(gross / _tax);
    }

    /**
     * Calculates a gross gross money amount from a nett amount.
     * 
     * @param nett - The base value.
     * @param percent - The percentage to be applied.
     * @returns The calculated gross amount.
     */
    public static calculateGross(nett:number,percent:number):number{
        const _tax = (1 + (percent * 0.01));
        return CFKitUtil.roundDecimal(nett * _tax);
    }
    
    /**
     * Rounds up to the specified number of decimal places. 5 is rounded up.
     * 
     * @param value - The value that is to be rounded.
     * @param precision - The precision (number of places afte 0) that is to be rounded to.
     * @returns The rounded amount.
     */
    public static roundDecimal(value:number,precision?:number)
	{
		let x:number;
		precision = (typeof precision == 'undefined') ? 2:precision;
		if(value === 0)
		{
			return 0;
		}		
		x = Math.pow(10,precision);
		return Math.round(x * value) / x;
	}
    /* ######################################################## */


    /* ######################################################## */
    /* String functions */
    /**
     * Creates a pseudo global unique identifier. 
     * 
     * NOTE: The algorithm does not generate a technical correct global unique identifier. However, for most practical uses in a single application it is sufficient.
     * 
     * @returns A sufficiently unique string suitable for use as global unique identfier.
     */
    public static createGUID():string 
    {
        let guid = (function () 
        {
	        let i:number,
	            c = "89ab",
	            u = [];
	        for (i = 0; i < 36; i += 1) {
	            u[i] = (Math.random() * 16 | 0).toString(16);
	        }
	        u[8] = u[13] = u[18] = u[23] = "-";
	        u[14] = "4";
	        u[19] = c.charAt(Math.random() * 4 | 0);
	        return u.join("");
        })();
        
	    return guid;
	}
    /* ######################################################## */


    /* ######################################################## */
    /* Date related methods. */
    /**
     * Formats a date as a string in ODBC Format. (as required by the CFKit API).
     * 
     * @param value - A date value to be converted.
     * @returns The date in ODBC Format.
     */
	public static ODBCDateTimeFormat(value:Date):string
	{
		if(!CFKitUtil.isDate(value))
		{
			value = CFKitUtil.UNDEFINED_DATE;
		}
		
		let year =  '' + value.getFullYear();
		let month = ("0" + (value.getMonth() + 1)).slice(-2);
		let day = ("0" + value.getDate()).slice(-2);
		let hour = ("0" + value.getHours()).slice(-2);
		let minute = ("0" + value.getMinutes()).slice(-2);
		let second = ("0" + value.getSeconds()).slice(-2);
		let odbcDateTime = "{ts '" + year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + "'}";
		return odbcDateTime;
	}	
    
    /**
     * Converts a string in odbc format to a date type (dates returned by the cfkit API are returned in ODBCFormat).
     * 
     * @param value - A string in ODBC Format. {ts 'YYYY-MM-DD HH:MM:SS'} or {ts 'YYYY-MM-DD'}
     * @returns A date object.
     */
	public static parseODBCdateTime(value:string):Date
	{
        const YMD_DELIMITER = '-';
        let pattern:RegExp;
        let parts:RegExpMatchArray|null;
		
		if(value.length == 26)
		{
			/* odbc date time ({ts 'YYYY-MM-DD HH:MM:SS'}) */
			pattern = new RegExp( "(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})" );
			parts = value.match(pattern);
			return new Date(parseInt(parts[1]),
	    					parseInt( parts[2], 10 ) - 1, /* NOTE: JS counts month from 0 to 11.*/
						    parseInt( parts[3], 10 ),
						    parseInt( parts[4], 10 ),
						    parseInt( parts[5], 10 ),
						    parseInt( parts[6], 10 ));
		}
		
		/* odbc date ({ts 'YYYY-MM-DD'}) */
		pattern = new RegExp( "(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{1,2})");
		parts = value.match(pattern);
		
		return new Date(parseInt(parts[1]),
    					parseInt(parts[2], 10 ) - 1,/* NOTE: JS counts month from 0 to 11.*/
					    parseInt(parts[3], 10 ),
					    0,0,0);
	}
    
    /**
     * Checks if the passed in value is of type date.
     * 
     * @param value - Value to validate
     * @returns True is the value is a date object.
     */
	public static isDate(value:any):boolean
	{
		if(Object.prototype.toString.call(value) === '[object Date]')
		{
			return true;
		}
	    return false;
    }
    

    /**
     * Checks if the passed in value is a string in odbc date time format. ({ts 'YYYY-MM-DD HH:MM:SS'})
     * 
     * @param value - Value to validate
     * @returns True is the value is a date object.
     */
	public static isODBCDateTime(value:string):boolean
	{
        const YMD_DELIMITER = '-';
        const pattern = new RegExp( "(\\d{4})" + YMD_DELIMITER + "(\\d{2})" + YMD_DELIMITER + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})" );
		const parts = value.match(pattern);	
	    return parts !== null;
    }

    /**
     * Checks if the passed in value is a string in api format.'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SSz'
     * 
     * @param value - Value to validate
     * @returns True the value is an API date string.
     */
	public static isAPIDateTime(value:string):boolean
	{
        let parts = value.split("T");
        if(parts.length === 0 || parts.length > 2) return false;
        if(parts.length === 2)
        {
            let time_pattern = new RegExp("\\d{2}:\\d{2}:\\d{2}z{0,1}$");
            if(parts[1].match(time_pattern) === null) return false;
        }

        let date_pattern = new RegExp("\\d{4}-\\d{2}-\\d{2}");
        return parts[0].match(date_pattern) !== null;
    }

    /**
     * Parses a date or datetime string in API format to UTC. 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SSz'
     * 
     * @param value - Value to validate
     * @returns True the value is an API date string.
     */
	public static parseAPIDateTime(value:string):Date
	{
        let parts = value.replace('z','').split("T");
        let _date = parts[0].split('-');
        
        let dateTime = new Date();
        dateTime.setUTCFullYear(Number(_date[0]));
        dateTime.setUTCMonth(Number(_date[1]) - 1);/* Note: JS Month are 0 - 11. */
        dateTime.setUTCDate(Number(_date[2]));
        
        if(parts.length === 2)
        {
            let _time = parts[1].split(':');
            dateTime.setUTCHours(Number(_time[0]));
            dateTime.setUTCMinutes(Number(_time[1]));
            dateTime.setUTCSeconds(Number(_time[2]));
        }else
        {
            dateTime.setUTCHours(0);
            dateTime.setUTCMinutes(0);
            dateTime.setUTCSeconds(0);
        }
        
        dateTime.setUTCMilliseconds(0);
        return dateTime;
    }

        /**
     * EXPERIMENTAL: Scans the object tree including nested arrays of objects, and
     * converts all detected string which are in ODBC Date Time format to javascript dates objects.
     * @param src - The object which is to be scanned.
     * @returns The passed in object with any detected odbc strings replaced by date objects.
     */
    public static parseApiDatesInObject(src:any):any
    {
        if(src === null) return src;
        if(typeof src === 'string')
        {
            if(CFKitUtil.isAPIDateTime(src))
            {
                return CFKitUtil.parseAPIDateTime(src);
            }
            return src;
        }

        if(typeof src !== 'object' || src === null) return src;
        if((src instanceof Object))
        {
            
            for (let [key, value] of Object.entries(src)) 
            {
                src[key] = CFKitUtil.parseApiDatesInObject(value);
            }
        }

        if((src instanceof Array))
        {
            for (let i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.parseApiDatesInObject(src[i]);  
            }
        }

        return src;
    }

    /**
     * EXPERIMENTAL: Scans the object tree including nested arrays of objects, and
     * converts all detected javascript dates to ODBC Strings.
     * @param src - The object which is to be scanned.
     * @returns The passed in object with any detected dates converted to odbc strings.
     */
    public static createApiDatesInObject(src:any):any
    {
        if(typeof src !== 'object' || src === null) return src;
        if(CFKitUtil.isDate(src))
        {
            return src.toISOString();
        }
        
        if((src instanceof Object))
        {
            
            for (let [key, value] of Object.entries(src)) 
            {
                src[key] = CFKitUtil.createApiDatesInObject(value);
            }
        }

        if((src instanceof Array))
        {
            for (let i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.createApiDatesInObject(src[i]);  
            }
        }

        return src;
    }
    
    /**
     * EXPERIMENTAL: Scans the object tree including nested arrays of objects, and
     * converts all detected string which are in ODBC Date Time format to javascript dates objects.
     * @param src - The object which is to be scanned.
     * @returns The passed in object with any detected odbc strings replaced by date objects.
     */
    public static parseDatesInObject(src:any):any
    {
        if(src === null) return src;
        if(typeof src === 'string')
        {
            if(CFKitUtil.isODBCDateTime(src))
            {
                return CFKitUtil.parseODBCdateTime(src);
            }
            return src;
        }

        if(typeof src !== 'object' || src === null) return src;
        if((src instanceof Object))
        {
            
            for (let [key, value] of Object.entries(src)) 
            {
                src[key] = CFKitUtil.parseDatesInObject(value);
            }
        }

        if((src instanceof Array))
        {
            for (let i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.parseDatesInObject(src[i]);  
            }
        }

        return src;
    }

    /**
     * EXPERIMENTAL: Scans the object tree including nested arrays of objects, and
     * converts all detected javascript dates to ODBC Strings.
     * @param src - The object which is to be scanned.
     * @returns The passed in object with any detected dates converted to odbc strings.
     */
    public static createODBCDatesInObject(src:any):any
    {
        if(typeof src !== 'object' || src === null) return src;
        if(CFKitUtil.isDate(src))
        {
            return CFKitUtil.ODBCDateTimeFormat(src);
        }
        
        if((src instanceof Object))
        {
            
            for (let [key, value] of Object.entries(src)) 
            {
                src[key] = CFKitUtil.createODBCDatesInObject(value);
            }
        }

        if((src instanceof Array))
        {
            for (let i = 0; i < src.length; i++) {
                src[i] = CFKitUtil.createODBCDatesInObject(src[i]);  
            }
        }

        return src;
    }
    /* ######################################################## */
}
