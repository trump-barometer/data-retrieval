const Indize = require('./models/Indize');


// ----- Public Functions -----

function Store(indizes)
{
    if (!indizes)
        return;

    Object.keys(indizes).forEach(key =>
    {
        indize = indizes[key]
  
        Indize.findOne({})
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
                        console.log(`Indize saved to database : `);
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