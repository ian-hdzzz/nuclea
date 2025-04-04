

exports.getOneToOne = (req, res) => {
    res.render('pages/one-to-one',{ 
        title: 'One-to-One ', 
        iconClass:'fa-solid fa-people-arrows'
    });
};

exports.getInterview = (req, res) => {
    res.render('pages/interview',{ 
        title: 'Interview', 
        iconClass:'fa-solid fa-people-arrows'
    });
};
