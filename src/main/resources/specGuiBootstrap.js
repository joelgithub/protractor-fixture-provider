var specGuiFixtureCreator = require(__dirname + '/specGuiFixtureCreator.js');
var path = require('path');
var specFixtureDir;

function addFixtureMockModuleSplit(specFixtureJsonFileName, specFixtureJsonFilePath, browserOverride) {
    if(browserOverride) {
        browser = browserOverride;
    }
    if(!specFixtureJsonFilePath) {
        specFixtureJsonFilePath = specFixtureDir;
    }

    if (specFixtureJsonFileName.endsWith('.json')) {
        var specFixtureModuleName = specFixtureJsonFileName.substring(0, specFixtureJsonFileName.length - 5);
        var specFixtures = specGuiFixtureCreator.createFixtureModuleAsString(specFixtureJsonFilePath, specFixtureModuleName);
        browser.addMockModule(specFixtureModuleName, specFixtures);
        return require(specFixtureJsonFilePath + "/" + specFixtureJsonFileName);
    }
    else {
        console.log("Could not load fixture. Fixture needs to be a .json file.");
    }
}

function addFixtureMockModule(specFixtureJsonPath) {
    var fileName = path.basename(specFixtureJsonPath);
    var dirPath = path.dirname(specFixtureJsonPath);
    return addFixtureMockModuleSplit(fileName, dirPath);
}

function stripFileSuffixFromFileName(fileName) {
    var indexOfDot = fileName.indexOf('.');
    if(indexOfDot != -1) {
        return fileName.substring(0, indexOfDot);
    }
}
module.exports = {
    /*
    Injects ngMockE2E and all "specSpec*.json" files modules into browser as mock modules. Needs to be run before adding
    additional json files with the addAdditionalFixtureFile function.
     */
    initBrowser: function (currentSpecFilePath, browserOverride) {
        if(browserOverride) {
            browser = browserOverride;
        }

        specFixtureDir = currentSpecFilePath.substring(0, currentSpecFilePath.lastIndexOf('/')) + '/specdata';
        var angularMocksScript = require(__dirname + '/angularMocks.module.js').mock;
        browser.addMockModule('ngMockE2E', angularMocksScript);

        var trimmedCurrentSpecFileName = stripFileSuffixFromFileName(path.basename(currentSpecFilePath));

        var glob = require("glob");
        var jsonFiles = glob.sync(specFixtureDir + '/' + trimmedCurrentSpecFileName + '*.json');

        var jsonObjectsMap = {};
        for(var i in jsonFiles) {
            var jsonObjectName = stripFileSuffixFromFileName(path.basename(jsonFiles[i]));
            jsonObjectsMap[jsonObjectName] = addFixtureMockModule(jsonFiles[i]);
        }
        return jsonObjectsMap;
    },
    //Adds additional json files as mock modules
    addAdditionalFixtureFile: addFixtureMockModuleSplit

};