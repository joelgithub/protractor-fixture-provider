
'use strict';

describe('protractor-fixture-provider tests', function () {

    var mockBrowser = {
        addMockModule: function(name, module) {
            console.log("Adding mock module: " + name);
        }
    };

    var jsonMap, additionalJsonMap;
    var fixture = require(__dirname + '/specdata/fixture.json');
    var fixture2 = require(__dirname + '/specdata/fixture_2.json');
    var other = require(__dirname + '/specdata/other.json');
    var specBootstrap = require('../../../main/resources/specGuiBootstrap.js');

    beforeEach(function () {
        spyOn(mockBrowser, "addMockModule");
        jsonMap = specBootstrap.initBrowser(__dirname + '/fixture.js', mockBrowser);
        additionalJsonMap = specBootstrap.addAdditionalFixtureFile('other.json', __dirname + "/specdata", mockBrowser);
    });

    it('should add ngMockE2E module to browser', function () {
        expect(mockBrowser.addMockModule).toHaveBeenCalledWith('ngMockE2E', jasmine.any(String));
    });

    it('should add fixture modules to browser', function () {
        expect(mockBrowser.addMockModule).toHaveBeenCalledWith('fixture', jasmine.any(String));
        expect(mockBrowser.addMockModule).toHaveBeenCalledWith('fixture_2', jasmine.any(String));
        expect(jsonMap.fixture.anobject.avalue).toBe(fixture.anobject.avalue);
        expect(jsonMap.fixture_2.anobject2.avalue2).toBe(fixture2.anobject2.avalue2);
    });

    it('should add "other" module to browser', function () {
        expect(mockBrowser.addMockModule).toHaveBeenCalledWith('other', jasmine.any(String));
        expect(additionalJsonMap.otherobject.othervalue).toBe(other.otherobject.othervalue);
    });
});