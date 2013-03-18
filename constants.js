/**
 * Constants defining a resource gathering network optimization simulation.
 *
 * Constants defining the parameters / behavior of an ants-inspired
 * automata / agent-based resource gathering network optimization simulation
 * inspired by ants.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/

var usingNode = typeof window === 'undefined';
var constants = {};

var EVAPORATION_RATE = 0.0025;
var MAX_PHEREMONE_VALUE = 1;
var MIN_PHEREMONE_VALUE = 0;

var MIN_PHEREMONE_VALUE_CHANCE = 0.01;
var ANT_ADD_PHEREMONE_AMT = 1;

var PHEREMONE_DISPERSE_DECAY = 0.2;

var NON_EXISTANT_SPACE = -1;

var UP_INDEX = 0;
var RIGHT_INDEX = 1;
var DOWN_INDEX = 2;
var LEFT_INDEX = 3;
var NUM_SURROUNDING_POSITIONS = 4;

var NUM_ANTS = 1000;
var GRID_X_CENTER = 100;
var GRID_Y_CENTER = 100;
var GRID_WIDTH = 200;
var GRID_HEIGHT = 200;
var INITAL_FOOD_SOURCE_SIZE = 50;
var STEP_DUR = 70;
var NUM_FOOD_SOURCES = 30;

var FOOD_RAD = 2;

var DISPLAY_CANVAS_ID = "#display-canvas";

if(usingNode)
{
    exports.EVAPORATION_RATE = EVAPORATION_RATE;
    exports.MAX_PHEREMONE_VALUE = MAX_PHEREMONE_VALUE;
    exports.MIN_PHEREMONE_VALUE = MIN_PHEREMONE_VALUE;
    exports.MIN_PHEREMONE_VALUE_CHANCE = MIN_PHEREMONE_VALUE_CHANCE;
    exports.ANT_ADD_PHEREMONE_AMT = ANT_ADD_PHEREMONE_AMT;
    exports.PHEREMONE_DISPERSE_DECAY = PHEREMONE_DISPERSE_DECAY;
    exports.NON_EXISTANT_SPACE = NON_EXISTANT_SPACE;
    exports.UP_INDEX = UP_INDEX;
    exports.RIGHT_INDEX = RIGHT_INDEX;
    exports.DOWN_INDEX = DOWN_INDEX;
    exports.LEFT_INDEX = LEFT_INDEX;
    exports.NUM_SURROUNDING_POSITIONS = NUM_SURROUNDING_POSITIONS;
    exports.NUM_ANTS = NUM_ANTS;
    exports.GRID_X_CENTER = GRID_X_CENTER;
    exports.GRID_Y_CENTER = GRID_Y_CENTER;
    exports.GRID_WIDTH = GRID_WIDTH;
    exports.GRID_HEIGHT = GRID_HEIGHT;
    exports.INITAL_FOOD_SOURCE_SIZE = INITAL_FOOD_SOURCE_SIZE;
    exports.STEP_DUR = STEP_DUR;
    exports.DISPLAY_CANVAS_ID = DISPLAY_CANVAS_ID;
    exports.NUM_FOOD_SOURCES = NUM_FOOD_SOURCES;
    exports.FOOD_RAD = FOOD_RAD;
}
else
{
    constants.EVAPORATION_RATE = EVAPORATION_RATE;
    constants.MAX_PHEREMONE_VALUE = MAX_PHEREMONE_VALUE;
    constants.MIN_PHEREMONE_VALUE = MIN_PHEREMONE_VALUE;
    constants.MIN_PHEREMONE_VALUE_CHANCE = MIN_PHEREMONE_VALUE_CHANCE;
    constants.ANT_ADD_PHEREMONE_AMT = ANT_ADD_PHEREMONE_AMT;
    constants.PHEREMONE_DISPERSE_DECAY = PHEREMONE_DISPERSE_DECAY;
    constants.NON_EXISTANT_SPACE = NON_EXISTANT_SPACE;
    constants.UP_INDEX = UP_INDEX;
    constants.RIGHT_INDEX = RIGHT_INDEX;
    constants.DOWN_INDEX = DOWN_INDEX;
    constants.LEFT_INDEX = LEFT_INDEX;
    constants.NUM_SURROUNDING_POSITIONS = NUM_SURROUNDING_POSITIONS;
    constants.NUM_ANTS = NUM_ANTS;
    constants.GRID_X_CENTER = GRID_X_CENTER;
    constants.GRID_Y_CENTER = GRID_Y_CENTER;
    constants.GRID_WIDTH = GRID_WIDTH;
    constants.GRID_HEIGHT = GRID_HEIGHT;
    constants.INITAL_FOOD_SOURCE_SIZE = INITAL_FOOD_SOURCE_SIZE;
    constants.STEP_DUR = STEP_DUR;
    constants.DISPLAY_CANVAS_ID = DISPLAY_CANVAS_ID;
    constants.NUM_FOOD_SOURCES = NUM_FOOD_SOURCES;
    constants.FOOD_RAD = FOOD_RAD;
}
