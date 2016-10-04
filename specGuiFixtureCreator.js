/*
Wraps a json object from a file in an angular module factory and assigns the module with the name of
the json file (without the file type suffix).
Returns the module factory declaration as a String
*/
var moduleFactoryHead = 'angular.module(\'%module_name%\', []).factory(\'%module_name%\', function () { return ';
var moduleFactoryTail = '});';
module.exports = {
    createFixtureModuleAsString: function(specFixturesModulePath, specFixtureModuleName) {
        fs = require("fs");
        script = fs.readFileSync(specFixturesModulePath + '/' + specFixtureModuleName + ".json").toString().trim();
        //Make sure json starts with a curly brace
        if(script.charAt(0) !== '{') {
            script = '{' + script + '}';
        }
        var head = moduleFactoryHead.replace(/%module_name%/g, specFixtureModuleName);
        return head + script + moduleFactoryTail;
    }
};

