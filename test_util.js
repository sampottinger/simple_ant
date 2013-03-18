/**
 * Utility / convenience functions for unit testing.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/


var ants_grid = require("./ants_grid");


/**
 * Create a test ants_grid.AntsGrid.
 *
 * Create a ants_grid.AntsGrid for testing with known pre-initialized
 * pheromone values.
 *
 * @return {ants_grid.AntsGrid} Ants grid for unit testing.
**/
var createTestGrid = function()
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

    return grid;
};


/**
 * Test that two floating point numbers are equal within a certain tolerance.
 *
 * @param {nodeunit:test} test The unit test to run this check under.
 * @param {float} received The value to test.
 * @param {float} expected The value that received is supposed to be.
**/
var testFloatEqual = function(test, received, expected)
{
    test.ok(Math.abs(recieved-expected) < 0.001);
};


/**
 * Determine if a value is in a given array.
 *
 * @param {nodeunit:test} test The unit test to run this check under.
 * @param value The value to look for.
 * @param {Array} targetArray The target array to check that value is included
 *      in.
**/
var testInArray = function(test, value, targetArray)
{
    for(var i in targetArray)
    {
        if(value == targetArray[i])
            return;
    }

    test.ok(false);
};


exports.createTestGrid = createTestGrid;
exports.testFloatEqual = testFloatEqual;
exports.testInArray = testInArray;