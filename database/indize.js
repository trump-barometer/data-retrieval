// ----- Required Modules -----

const Indize = require('./models/Indize');


// ----- Public Functions -----

function Store(indizes)
{
    if (!indizes)
        return;

    indizes.forEach(indize =>
    {
        Indize.findOne({ "indize.id" : indize.id })
            .then(async indi =>
            {
                // Indize doesnt't exist in database
                if (!indi)
                {
                    indi = new Indize
                    (
                        {
                            indize
                        }
                    );
                }
                else
                {
                    tw.modifiedDate = Date.now();
                }   
                
                indi.save()
                    .then(t =>
                    {
                        console.log(`Indize saved to database : ${t.id}`);
                    })
                    .catch(err => console.log(`Database error : ${err}`));
            });           
    });
}


// ------ Export Modul ------

module.exports =
{
    Store
};