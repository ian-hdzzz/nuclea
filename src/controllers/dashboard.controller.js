
exports.getDashboard = (req, res) => {
    res.render('pages/dashboard',{
        title:'Dashboard', 
        iconClass:'fa-solid fa-house', 
        currentPath: req.path 
    });
};