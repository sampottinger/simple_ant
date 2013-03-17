var ants_grid = require("./ants_grid");

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

var testFloatEqual = function(test, recieved, expected)
{
    test.ok(Math.abs(recieved-expected) < 0.001);
};

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