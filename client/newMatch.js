module.exports = function() {
    var tpl = require('../tpl/newMatch.hbs'),
        newMatchContainer = document.getElementById('addMatch');

    console.log('adding stuff');
    newMatchContainer.innerHTML = tpl();
}();
