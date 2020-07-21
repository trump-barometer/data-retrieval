// ----- Helper functions -----


// ----- Public Functions -----

// Print message to console
function Log(subject, message)
{
    console.log('[' + GetCurrentTime() + '] ' + subject + ' : ' + message + '.');
}


// ----- Private Functions -----

// Adds leading zero to time numbers
function AddZero(x, n)
{
    while (x.toString().length < n)
    {
        x = "0" + x;
    }

    return x;
}

// Get current time in specific format
function GetCurrentTime()
{
    let d = new Date();
    let h = AddZero(d.getHours(), 2);
    let m = AddZero(d.getMinutes(), 2);
    let s = AddZero(d.getSeconds(), 2);
    let ms = AddZero(d.getMilliseconds(), 3);

    return h + ":" + m + ":" + s + ":" + ms;
}

// Sommerzeit Regeln:
// USA seit 2007:
// DST from the second Sunday of March at 02:00 AM till the first Sunday of November at 02:00 AM.
// Deutschland seit 1996:
// Sommerzeit vom letzten Sonntag im März 2:00 MEZ bis zum letzten Sonntag im Oktober 2:00 MEZ.

function GetFirstSunday(year, month)
{
    month = month-1;

    var date = new Date();
    date.setFullYear(year, month, 1);

    while (date.getUTCDay() != 0)
    {
        date.setFullYear(year, month, (date.getUTCDay() + 1));
    }

    return date;
}

function GetLastSunday(year, month)
{
    month = month-1;

    var lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var date = new Date();
    
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
    {
		lastDay[2] = 29;
    }
    
    date.setFullYear(year, month, lastDay[month]);
    date.setDate(date.getDate() - date.getDay());

    return date;
}

function GetDstStartDate(country, year)
{
    var m = 03;
    var d = country === 'DE' ? GetLastSunday(year, m).getUTCDate() : GetFirstSunday(year, m) + 7;
    var h = 02;

    return {d:d, m:m, h:h};
}

function GetDstEndDate(country, year)
{
    var m = country === 'US' ?  11 : 10;
    var d = country === 'DE' ? GetLastSunday(year, m).getUTCDate() : GetFirstSunday(year, m);
    var h = 02;

    return {d:d, m:m, h:h};
}

function IsDst(date, country)
{

    var dates = {
        convert:function(d)
        {
            // Converts the date in d to a date-object. The input can be:
            //   a date object: returned without modification
            //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
            //   a number     : Interpreted as number of milliseconds
            //                  since 1 Jan 1970 (a timestamp) 
            //   a string     : Any format supported by the javascript engine, like
            //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
            //  an object     : Interpreted as an object with year, month and date
            //                  attributes.  **NOTE** month is 0-11.
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
        },
        compare:function(a,b)
        {
            // Compare two dates (could be of any type supported by the convert
            // function above) and returns:
            //  -1 : if a < b
            //   0 : if a = b
            //   1 : if a > b
            // NaN : if a or b is an illegal date
            // NOTE: The code inside isFinite does an assignment (=).
            return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                (a>b)-(a<b) :
                NaN
            );
        },
        inRange:function(d,start,end)
        {
            // Checks if date in d is between dates in start and end.
            // Returns a boolean or NaN:
            //    true  : if d is between start and end (inclusive)
            //    false : if d is before start or after end
            //    NaN   : if one or more of the dates is illegal.
            // NOTE: The code inside isFinite does an assignment (=).
           return (
                isFinite(d=this.convert(d).valueOf()) &&
                isFinite(start=this.convert(start).valueOf()) &&
                isFinite(end=this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
            );
        }
    }

    var dstStart = GetDstStartDate(country, date.getUTCFullYear());
    var dstEnd = GetDstEndDate(country, date.getUTCFullYear());
    var dstStartDate = new Date(Date.parse(date.getFullYear() + '-' + dstStart.m + '-' + dstStart.d + ' ' + dstStart.h + ':00:00 UTC+0'));
    var dstEndDate = new Date(Date.parse(date.getFullYear() + '-' + dstEnd.m + '-' + dstEnd.d + ' ' + dstEnd.h + ':00:00 UTC+0'));

    // console.log('Formatted input-datestring = ' + date.toUTCString());
    // console.log('dstStartDate = ' + dstStartDate.toUTCString());
    // console.log('dstEndDate = ' + dstEndDate.toUTCString());

    return dates.inRange (date,dstStartDate,dstEndDate);
}

function ConvertIndexTimestamp(index, timestamp)
{
    if ('^GDAXI' === index)
    {
        // console.log('Deutschland => UTC+1 WZ, UTC+2 SZ');

        if (IsDst((new Date(Date.parse(timestamp + ' UTC+0'))), 'DE'))
        {
            // console.log('Sommerzeit!');
            timestamp = timestamp + ' UTC+2';
        }
        else
        {
            // console.log('Winterzeit!');
            timestamp = timestamp + ' UTC+1';
        }

        timestamp = new Date(Date.parse(timestamp));

        return timestamp;
    }
    else if ('^DJI' === index || '^GSPC' === index || '^NDX' === index)
    {
        // console.log('New York => UTC-5 WZ, UTC-4 SZ');

        if (IsDst((new Date(Date.parse(timestamp + ' UTC+0'))), 'US'))
        {
            // console.log('Sommerzeit!');
            timestamp = timestamp + ' UTC-4';
        }
        else
        {
            // console.log('Winterzeit!');
            timestamp = timestamp + ' UTC-5';
        }

        timestamp = new Date(Date.parse(timestamp));

        return timestamp;
    }
    
    return null;
}


// ----- Module Exports -----

module.exports =
{
    Log,
    ConvertIndexTimestamp
};