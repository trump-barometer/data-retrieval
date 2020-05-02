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


// ----- Module Exports -----

module.exports =
{
    Log
};