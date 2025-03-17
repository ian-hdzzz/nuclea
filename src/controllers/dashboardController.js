
class Dashboard{
    get_dashboard(req, res){
        res.render('./pages/dashboard');
    
    }
}
module.exports = new Dashboard();