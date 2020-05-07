const Indize = require('./models/Indize');


// ----- Public Functions -----

function Store(indizes)
{
    if (!indizes)
        return;

    Object.keys(indizes).forEach(key =>
    {
        indize = indizes[key]
        Object.keys(indize).forEach(key2 =>
            {
                key3 = key2.substring(3)
                Object.defineProperty(indize, key3,
                    Object.getOwnPropertyDescriptor(indize, key2));
                delete indize[key2];
            
            })
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