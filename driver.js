var usingNode = typeof window === 'undefined';

if(usingNode)
{
    var ant = require("./ant");
    var constants = require("./constants");
    var ant_gird = require("./ant_gird");
    var view = require("./view");
}

var ants = new Array();
var grid;

var randInt = function(min, max)
{
    return Math.random() * (max - min) + min;
};

var initalize = function()
{
    var newAnt;

    for(var i=0; i<constants.NUM_ANTS; i++)
    {
        newAnt = new ant.Ant(constants.GRID_X_CENTER, constants.GRID_Y_CENTER);
        ants.push(newAnt);
    }

    grid = new ant_grid.AntGrid(constants.GRID_WIDTH, constants.GRID_HEIGHT);

    for(var i=0; i<constants.NUM_FOOD_SOURCES; i++)
    {
        grid.setPosFoodValue(
            randInt(),
            randInt(),
            constants.INITAL_FOOD_SOURCE_SIZE
        );
    }

    setInterval(takeStep,constants.STEP_DUR);
};

var takeStep = function()
{
    for(var i in ants)
        ants[i].takeStep();

    grid.evaporate();

    view.drawGrid(grid);
};

$(document).ready(initalize());
