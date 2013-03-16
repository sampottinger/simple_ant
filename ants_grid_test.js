var constants = require("./constants");
var ants_grid = require("./ants_grid");

exports.testSimplePheremoneValue = function(test)
{
    var grid = new ants_grid.AntsGrid(1, 1);
    test.equal(grid.getPosPheremoneValue(0, 0), 0);

    grid.changePosPheremoneValue(0, 0, 1);
    test.equal(grid.getPosPheremoneValue(0, 0), 1);

    test.equal(grid.getPosPheremoneValue(1, 0), constants.NON_EXISTANT_SPACE);

    test.done();
}

exports.testSimpleFoodValue = function(test)
{
    var grid = new ants_grid.AntsGrid(1, 1);
    test.equal(grid.getPosFoodValue(0, 0), 0);

    grid.changePosFoodValue(0, 0, 1);
    test.equal(grid.getPosFoodValue(0, 0), 1);

    test.equal(grid.getPosFoodValue(1, 0), constants.NON_EXISTANT_SPACE);

    test.done();
}

exports.testEvaporate = function(test)
{
    var grid = new ants_grid.AntsGrid(2, 2);
    grid.changePosPheremoneValue(1, 0, 2*constants.EVAPORATION_RATE);
    grid.changePosPheremoneValue(0, 1, constants.EVAPORATION_RATE);
    grid.changePosPheremoneValue(1, 1, constants.EVAPORATION_RATE/2);

    grid.evaporate();

    test.equal(grid.getPosPheremoneValue(0, 0), 0);
    test.equal(grid.getPosPheremoneValue(1, 0), constants.EVAPORATION_RATE);
    test.equal(grid.getPosPheremoneValue(0, 1), 0);
    test.equal(grid.getPosPheremoneValue(1, 1), 0);

    test.done();
};

exports.testGetSurroundingPheremoneValues = function(test)
{
    var grid = new ants_grid.AntsGrid(3, 3);
    grid.changePosPheremoneValue(0, 0, 0.1);
    grid.changePosPheremoneValue(1, 0, 0.2);
    grid.changePosPheremoneValue(2, 0, 0.3);
    grid.changePosPheremoneValue(0, 1, 0.4);
    grid.changePosPheremoneValue(1, 1, 0.5);
    grid.changePosPheremoneValue(2, 1, 0.6);
    grid.changePosPheremoneValue(0, 2, 0.7);
    grid.changePosPheremoneValue(1, 2, 0.8);
    grid.changePosPheremoneValue(2, 2, 0.9);

    var surrounding = grid.getSurroundingPheremoneValues(1, 1);
    test.equal(surrounding[constants.UP_INDEX], 0.2);
    test.equal(surrounding[constants.RIGHT_INDEX], 0.6);
    test.equal(surrounding[constants.DOWN_INDEX], 0.8);
    test.equal(surrounding[constants.LEFT_INDEX], 0.4);

    test.done();
}

exports.testGetSurroundingPheremoneValuesEdge = function(test)
{
    var grid = new ants_grid.AntsGrid(3, 3);
    grid.changePosPheremoneValue(0, 0, 0.1);
    grid.changePosPheremoneValue(1, 0, 0.2);
    grid.changePosPheremoneValue(2, 0, 0.3);
    grid.changePosPheremoneValue(0, 1, 0.4);
    grid.changePosPheremoneValue(1, 1, 0.5);
    grid.changePosPheremoneValue(2, 1, 0.6);
    grid.changePosPheremoneValue(0, 2, 0.7);
    grid.changePosPheremoneValue(1, 2, 0.8);
    grid.changePosPheremoneValue(2, 2, 0.9);

    var surrounding = grid.getSurroundingPheremoneValues(0, 0);
    test.equal(surrounding[constants.UP_INDEX], constants.NON_EXISTANT_SPACE);
    test.equal(surrounding[constants.RIGHT_INDEX], 0.2);
    test.equal(surrounding[constants.DOWN_INDEX], 0.4);
    test.equal(surrounding[constants.LEFT_INDEX], constants.NON_EXISTANT_SPACE);

    test.done();
}
