/**
 * Unit test ant grid logic for an ant-based automaton simulation.
 *
 * Unit tests for the behavior of a pheremone / food grid for an ants-inspired
 * automata / agent-based resource gathering network optimization simulation
 * inspired by ants.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/


var constants = require("./constants");
var ants_grid = require("./ants_grid");
var test_util = require("./test_util");


/**
 * Test setting and getting simple pheromone values.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testSimplePheremoneValue = function(test)
{
    var grid = new ants_grid.AntsGrid(1, 1);
    test.equal(grid.getPosPheremoneValue(0, 0), 0);

    grid.changePosPheremoneValue(0, 0, 1);
    test.equal(grid.getPosPheremoneValue(0, 0), 1);

    test.equal(grid.getPosPheremoneValue(1, 0), constants.NON_EXISTANT_SPACE);

    test.done();
};


/**
 * Test setting and getting simple food values.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testSimpleFoodValue = function(test)
{
    var grid = new ants_grid.AntsGrid(1, 1);
    test.equal(grid.getPosFoodValue(0, 0), 0);

    grid.changePosFoodValue(0, 0, 1);
    test.equal(grid.getPosFoodValue(0, 0), 1);

    test.equal(grid.getPosFoodValue(1, 0), constants.NON_EXISTANT_SPACE);

    test.done();
};


/**
 * Test evaporating old pheromone values;
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
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


/**
 * Test finding spaces around a given coordinate and their pheromone values.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testGetSurroundingPheremoneValues = function(test)
{
    var grid = test_util.createTestGrid();

    var surrounding = grid.getSurroundingPheremoneValues(1, 1);
    test.equal(surrounding[constants.UP_INDEX], 0.2);
    test.equal(surrounding[constants.RIGHT_INDEX], 0.6);
    test.equal(surrounding[constants.DOWN_INDEX], 0.8);
    test.equal(surrounding[constants.LEFT_INDEX], 0.4);

    test.done();
};


/**
 * Test finding edge spaces around a coordinate and their pheromone values.
 *
 * Test finding spaces surrounding an "edge" space and those spaces' pheromone
 * values.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testGetSurroundingPheremoneValuesEdge = function(test)
{
    var grid = test_util.createTestGrid();

    var surrounding = grid.getSurroundingPheremoneValues(0, 0);
    test.equal(surrounding[constants.UP_INDEX], constants.NON_EXISTANT_SPACE);
    test.equal(surrounding[constants.RIGHT_INDEX], 0.2);
    test.equal(surrounding[constants.DOWN_INDEX], 0.4);
    test.equal(surrounding[constants.LEFT_INDEX], constants.NON_EXISTANT_SPACE);

    test.done();
};


/**
 * Test changing the pheromone values of a section of a ants_grid.AntsGrid.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testChangeAreaPheremoneValue = function(test)
{
    var grid = test_util.createTestGrid();
    grid.changeAreaPheremoneValue(1, 1, 0.1, 1);

    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 0), 0.2);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 0), 0.3);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 0), 0.4);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 1), 0.5);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 1), 0.6);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 1), 0.7);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 2), 0.8);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 2), 0.9);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 2), 1.0);

    test.done();
};


/**
 * Test changing the pheromone values of an edge section of an AntsGrid.
 *
 * Test changing the pheromone values of an area where part of that area doesn't
 * exist on this grid.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testChangeAreaPheremoneValueEdge = function(test)
{
    var grid = test_util.createTestGrid();
    grid.changeAreaPheremoneValue(0, 0, 0.1, 1);

    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 0), 0.2);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 0), 0.3);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 0), 0.3);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 1), 0.5);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 1), 0.6);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 1), 0.6);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 2), 0.7);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 2), 0.8);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 2), 0.9);

    test.done();
};


/**
 * Test adding new pheromone to a grid.
 * 
 * Test adding new pheromone to a grid such that the pheromone spreads out with
 * decay.
 *
 * @param {nodeunit:test} The test to execute this routine as part of.
**/ 
exports.testChangeAreaPheremoneValueDecay = function(test)
{
    var grid = new ants_grid.AntsGrid(7, 7);

    grid.changeAreaPheremoneValueDecay(3, 3, 0.3, 0.1);

    test_util.testFloatEqual(test, grid.getPosPheremoneValue(0, 3), 0);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(1, 3), 0.1);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(2, 3), 0.2);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(3, 3), 0.3);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(4, 3), 0.2);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(5, 3), 0.1);
    test_util.testFloatEqual(test, grid.getPosPheremoneValue(6, 3), 0);

    test.done();
};
