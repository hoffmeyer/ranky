module.exports = {
    clearInputs: function(){
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function(e, i){
            if(e.tagName.toLowerCase() === "input"){
                e.value = null;
            }
        });
    }
};
