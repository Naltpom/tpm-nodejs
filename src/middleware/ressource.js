module.exports = (req, res, next) => {
    const ressource = req.body.ressource;
    switch (ressource.toUpperCase()) {
        case 'COMPANY':
            console.log(ressource);
            next();
            break;
        case 'PROJECT':
            console.log(ressource);
            next();
            break;
        
        case 'APPLICATION':
            console.log(ressource);
            next();
            break;
        
        case 'COMPONENT':
            console.log(ressource);
            next();
            break;
        
        case 'SUBCOMPONENT':
            console.log(ressource);
            next();
            break;
    }
    // res.status(401).json({ error: error})
    // try {

    // } catch (error) {
    //     error.auth = 'ressource not found';
    //     
    // }
}


