

exports.getOneToOne = (req, res) => {
    res.render('pages/one-to-one',{ 
        title: 'One-to-One Interview', 
        iconClass:'fa-solid fa-people-arrows'
    });
};