var usingNode = typeof window === 'undefined';

if(usingNode)
{
    var ant = require("./ant");
    var constants = require("./constants");
    var ants_gird = require("./ants_gird");
    var view = require("./view");
}

var ants = new Array();
var grid;

var randInt = function(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
};

var initalize = function()
{
    var newAnt;

    for(var i=0; i<constants.NUM_ANTS; i++)
    {
        newAnt = new ant.Ant(constants.GRID_X_CENTER, constants.GRID_Y_CENTER);
        ants.push(newAnt);
    }

    grid = new ants_grid.AntsGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT);

    for(var i=0; i<constants.NUM_FOOD_SOURCES; i++)
    {
        var x = randInt(0, constants.GRID_WIDTH);
        var y = randInt(0, constants.GRID_HEIGHT);
        grid.changePosFoodValue(x, y, constants.INITAL_FOOD_SOURCE_SIZE);
    }

    setInterval(takeStep,constants.STEP_DUR);
};

var takeStep = function()
{
    for(var i in ants)
        ants[i].takeStep(grid);

    grid.evaporate();

    view.drawGrid(grid, ants);
};

$(document).ready(initalize());
