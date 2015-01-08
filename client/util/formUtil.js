module.exports = {
    clearInputs: function(value){
        var args = Array.prototype.slice.call(arguments);
        args.forEach(function(e, i){
            if(e.tagName === "input"){
                e.value = value ? value : null;
            }
        });
    }
};
