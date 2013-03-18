/**
 * Initialization / orchestration for ant-inspired automata.
 *
 * Initialization / orchestration for a pheremone-based internally optimizing
 * resource gathering network simulation.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/


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


/**
 * Generate a random integer.
 *
 * Generate a random integer in the range from the provided minimum (inclusive)
 * to the provided maximum (exclusive).
 *
 * @param {int} min The minimum integer that should be generated.
 * @param {int} max The maximum integer plus one that should be generated.
 * @return {int} Randomly generated integer within provided integer range.
**/
var randInt = function(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);
};


/**
 * Set up the simulation.
 *
 * Creates a new simulation, replacing any existing simulation data. This will
 * initialize new ants and ant grid before scheduling the periodic calling of
 * takeStep to run the simulation.
**/
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


/**
 * Take one time step in the simulation.
**/
var takeStep = function()
{
    for(var i in ants)
        ants[i].takeStep(grid);

    grid.evaporate();

    view.drawGrid(grid, ants);
};

$(document).ready(initalize());
