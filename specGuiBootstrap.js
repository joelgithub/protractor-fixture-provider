var specGuiFixtureCreator = require(__dirname + '/specGuiFixtureCreator.js');
var specFixtureDir;

function addFixtureMockModuleSplit(specFixtureJsonFileName, specFixtureJsonFilePath) {
    if(!specFixtureJsonFilePath) {
        specFixtureJsonFilePath = specFixtureDir;
    }

    if (specFixtureJsonFileName.endsWith('.json')) {
        var specFixtureModuleName = specFixtureJsonFileName.substring(0, specFixtureJsonFileName.length - 5);
        var specFixtures = specGuiFixtureCreator.createFixtureModuleAsString(specFixtureJsonFilePath, specFixtureModuleName);
        browser.addMockModule(specFixtureModuleName, specFixtures);
    }
    else {
        console.log("Could not load fixture. Fixture needs to be a .json file.");
    }
}

function addFixtureMockModule(specFixtureJsonPath) {
    var fileName = specFixtureJsonPath.substring(specFixtureJsonPath.lastIndexOf('/') + 1);
    var dirPath = specFixtureJsonPath.substring(0, specFixtureJsonPath.lastIndexOf('/'));
    addFixtureMockModuleSplit(fileName, dirPath);
}

function stripPathFromFileName(currentSpecFileName) {
    var path = require('path');
    var filename = path.basename(currentSpecFileName);
    return filename;
}

function stripFileSuffixFromFileName(currentSpecFileName) {
    if(currentSpecFileName.endsWith('.js')) {
        return currentSpecFileName.substring(0, currentSpecFileName.length - 3);
    }
    else {
        return currentSpecFileName;
    }
}
module.exports = {
    /*
    Injects ngMockE2E and all "specSpec*.json" files modules into browser as mock modules. Needs to be run before adding
    additional json files with the addAdditionalFixtureFile function.
     */
    initBrowser: function (currentSpecFilePath) {
        specFixtureDir = currentSpecFilePath.substring(0, currentSpecFilePath.lastIndexOf('/')) + '/specdata';
        var angularMocksScript = require(__dirname + '/angularMocks.module.js').mock;
        browser.addMockModule('ngMockE2E', angularMocksScript);

        var trimmedCurrentSpecFileName = stripFileSuffixFromFileName(stripPathFromFileName(currentSpecFilePath));

        var glob = require("glob");
        var jsonFiles = glob.sync(specFixtureDir + '/' + trimmedCurrentSpecFileName + '*.json');

        for(var i in jsonFiles) {
            addFixtureMockModule(jsonFiles[i])
        }
    },
    //Adds additional json files as mock modules
    addAdditionalFixtureFile: addFixtureMockModuleSplit

};