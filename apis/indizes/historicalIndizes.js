// ----- Required Modules -----

const path = require('path');
const fs = require('fs');

const csvToJson = require('convert-csv-to-json');

const indize = require('../../database/indizes');

// Common Functions
const common = require('../../common/common');

// Directory path to csv files
const directoryName = 'HistoricalIndizes';


ImportHistoricalIndizesFromCsvFiles()

// ----- CSV Import -----

function ImportHistoricalIndizesFromCsvFiles()
{
    const directoryPath = path.join(__dirname, `../../${directoryName}`);

    fs.readdir(directoryPath, (err, files) =>
    {
        if (err)
        {
            return common.Log('Unable to scan directory', err);
        }

        if (files)
        {
            files.forEach((file) =>
            {
                common.Log('Reading indizes from file', file);

                const filePath = `${directoryPath}\\${file}`;

                try
                {
                    let series = csvToJson.fieldDelimiter(';').getJsonFromCsv(filePath);
                    console.log(series[0]);
                    // indize.Store(series);
                }
                catch(err)
                {
                    common.Log('Indize error', err);
                }
            });
        }
        else
            common.Log('Info', `No historical indize files found in diretory \'${directoryPath}\'`);
    });
}