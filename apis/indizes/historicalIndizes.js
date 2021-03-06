// ----- Required Modules -----

const path = require('path');
const fs = require('fs');

const csvToJson = require('convert-csv-to-json');

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

// Directory path to csv files
const directoryName = 'historicalData';


ImportHistoricalIndizesFromCsvFiles()

// ----- CSV Import -----

function ImportHistoricalIndizesFromCsvFiles()
{
    const directoryPath = path.join(__dirname, `../../${directoryName}`);

    fs.readdir(directoryPath, async (err, files) =>
    {
        if (err)
        {
            return common.Log('Unable to scan directory', err);
        }

        if (files)
        {
            for(let file of files)
            {
                common.Log('Reading indizes from file', file);

                const filePath = `${directoryPath}${path.sep}${file}`;

                try
                {
                    let series = csvToJson.fieldDelimiter(';').getJsonFromCsv(filePath);

                    series.forEach(entry =>
                    {
                        var ts = common.ConvertIndexTimestamp(entry.symbol, entry.timestamp);
                        entry.timestamp = ts.toUTCString();
                        entry.timestamp_date = new Date(ts.toISOString());
                    });

                    await indize.Store(series);

                    common.Log('Indize info', `Saved ${series.length} historical indizes to database`);
                }
                catch(err)
                {
                    common.Log('Indize error', err);
                }
            }
        }
        else
            common.Log('Info', `No historical indize files found in diretory \'${directoryPath}\'`);
    });
}