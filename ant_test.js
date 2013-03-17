var constants = require("./constants");
var ants_grid = require("./ants_grid");
var ant = require("./ant");
var test_util = require("./test_util");

var checkAntPos = function(test, ant, xPos, yPos)
{
    test.equal(ant.getXPos(), xPos);
    test.equal(ant.getYPos(), yPos);
}

exports.testCheckForFood = function(test)
{
    var testGrid = new ants_grid.AntsGrid(1, 1);
    var testAnt = new ant.Ant(0, 0);

    testAnt.checkForFood(testGrid);
    test.ok(!testAnt.debugIsReturning());

    testGrid.changePosFoodValue(0, 0, 2);
    testAnt.checkForFood(testGrid);
    test.ok(testAnt.debugIsReturning());
    test.equal(testGrid.getPosFoodValue(0, 0), 1);

    test.done();
};

exports.testMoveDirection = function(test)
{
    var testAnt = new ant.Ant(1, 1);

    testAnt.moveDirection(constants.UP_INDEX);
    checkAntPos(test, testAnt, 1, 0);

    testAnt.moveDirection(constants.DOWN_INDEX);
    checkAntPos(test, testAnt, 1, 1);

    testAnt.moveDirection(constants.LEFT_INDEX);
    checkAntPos(test, testAnt, 0, 1);

    testAnt.moveDirection(constants.RIGHT_INDEX);
    checkAntPos(test, testAnt, 1, 1);

    test.done();
};

exports.testFindAvailableSpaces = function(test)
{
    var testAnt = new ant.Ant(1, 1);
    var testGrid = test_util.createTestGrid();

    var availableSpaceInfo = testAnt.findAvailableSpaces(testGrid);
    var totalPheremoneVal = availableSpaceInfo[0];
    var availableSpaces = availableSpaceInfo[1];

    // Surrounding spaces values of 0.2 + 0.4 + 0.6 + 0.8 = 2
    test_util.testFloatEqual(test, totalPheremoneVal, 2);

    var availableSpaceDirs = availableSpaces.map(function (elem)
    {
        return elem[1];
    });

    test.equal(availableSpaces.length, 4);
    test_util.testInArray(test, constants.UP_INDEX, availableSpaceDirs);
    test_util.testInArray(test, constants.RIGHT_INDEX, availableSpaceDirs);
    test_util.testInArray(test, constants.DOWN_INDEX, availableSpaceDirs);
    test_util.testInArray(test, constants.LEFT_INDEX, availableSpaceDirs);

    test.done();
};

exports.testFindAvailableSpacesEdge = function(test)
{
    var testAnt = new ant.Ant(0, 0);
    var testGrid = test_util.createTestGrid();

    var availableSpaceInfo = testAnt.findAvailableSpaces(testGrid);
    var totalPheremoneVal = availableSpaceInfo[0];
    var availableSpaces = availableSpaceInfo[1];

    // Surrounding spaces values of 0.2 + 0.4
    test_util.testFloatEqual(test, totalPheremoneVal, 0.6);

    test.equal(availableSpaces.length, 2);

    var availableSpaceDirs = availableSpaces.map(function (elem)
    {
        return elem[1];
    });

    test_util.testInArray(test, constants.RIGHT_INDEX, availableSpaceDirs);
    test_util.testInArray(test, constants.DOWN_INDEX, availableSpaceDirs);

    test.done();
};

exports.testExplore = function(test)
{
    var testAnt = new ant.Ant(1, 1);
    var testGrid = test_util.createTestGrid();
    var testRandVal = 0.5; // Will go down
    var pathOut;

    testGrid.changePosFoodValue(1, 2, 1);

    testAnt.explore(testGrid, testRandVal);
    pathOut = testAnt.debugGetPathOut();

    checkAntPos(test, testAnt, 1, 2);
    test.equal(testGrid.getPosFoodValue(2, 1), 0);
    test.ok(testAnt.debugIsReturning());
    test.equal(pathOut.length, 1);
    test.equal(pathOut[0][0], 1);
    test.equal(pathOut[0][1], 1);

    test.done();
};

exports.testReturnHome = function(test)
{
    var testAnt = new ant.Ant(2, 1);
    var testGrid = test_util.createTestGrid();

    testAnt.debugPushToPathOut([0, 1]);
    testAnt.debugPushToPathOut([1, 1]);
    testAnt.debugSetState(true);

    testAnt.returnHome(testGrid);

    test_util.testFloatEqual(
        test,
        testGrid.getPosPheremoneValue(2, 1),
        0.7
    );

    checkAntPos(test, testAnt, 1, 1);

    test.done();
};
