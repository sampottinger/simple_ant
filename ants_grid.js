/**
 * Logic for a 2D grid with food and pheromone for an ant-inspired automaton.
 *
 * Logic for a 2D integer-coordinate grid that hosts automate in a
 * pheromone-based internally optimizing resource gathering.
 *
 * @author Sam Pottinger
 * @license GNU GPL v3
**/

var usingNode = typeof window === 'undefined';
var ants_grid = {};


if(usingNode)
{
    var constants = require("./constants");
}


/**
 * 2D integer-coordinate grid that holds food and pheromone.
 *
 * @param {int} xSize The width in spaces of this grid.
 * @param {int} ySize The height in spaces of this grid.
**/
function AntsGrid(xSize, ySize)
{
    /**
     * Simulate the evaporation of old pheromone.
    **/
    this.evaporate = function()
    {
        for(var i in pheremoneValues)
        {
            var curVal = pheremoneValues[i];
            if(curVal >= constants.EVAPORATION_RATE)
                pheremoneValues[i] -= constants.EVAPORATION_RATE;
            else if(curVal < constants.EVAPORATION_RATE)
                pheremoneValues[i] = 0;
        }
    };

    /**
     * Perfect hashing function for positions in this grid.
     *
     * @param {int} xPos The x coordinate of the position to hash.
     * @param {int} yPos The y coordinate of the position to hash.
     * @return {int} The hash for the given position.
    **/
    this.getPosIndex = function(xPos, yPos)
    {
        return ySize * yPos + xPos;
    };

    /**
     * Get the pheromone value at the given position.
     *
     * @param {int} xPos The x coordinate of the position to get the current
     *      pheromone value for.
     * @param {int} yPos The y coordinate of the position to get the current
     *      pheromone value for.
     * @return {float} The pheromone value at the given position.
    **/
    this.getPosPheremoneValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return pheremoneValues[this.getPosIndex(xPos, yPos)];
    };

    /**
     * Get the pheromone values in the spaces adjacent to a given position.
     *
     * @param {int} xPos The x coordinate of the position to examine.
     * @param {int} yPos The y coordinate of the position to examine.
     * @return {Array} Array where returnValue[constants.*_INDEX] corresponds to
     *      the pheromone value at that adjacent space.
    **/
    this.getSurroundingPheremoneValues = function(xPos, yPos)
    {
        var retVal = new Array(constants.NUM_SURROUNDING_POSITIONS);
        retVal[constants.UP_INDEX] = this.getPosPheremoneValue(xPos, yPos - 1);
        retVal[constants.RIGHT_INDEX] = this.getPosPheremoneValue(xPos+1, yPos);
        retVal[constants.DOWN_INDEX] = this.getPosPheremoneValue(xPos, yPos+1);
        retVal[constants.LEFT_INDEX] = this.getPosPheremoneValue(xPos-1, yPos);
        return retVal;
    };

    /**
     * Get the pheromone value at a given position.
     *
     * @param {int} xPos The x coordinate of the position of the space to
     *      change.
     * @param {int} yPos The y coordinate of the position of the space to
     *      change.
     * @param {float} delta How much to change the pheromone value by.
    **/
    this.changePosPheremoneValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        var newVal = pheremoneValues[posIndex] + delta;
        
        if(newVal > constants.MAX_PHEREMONE_VALUE)
            newVal = constants.MAX_PHEREMONE_VALUE;
        else if(newVal < constants.MIN_PHEREMONE_VALUE)
            newVal = constants.MIN_PHEREMONE_VALUE;

        pheremoneValues[posIndex] = newVal;
    };

    /**
     * Change the food value at a given position.
     *
     * @param {int} xPos The x coordinate of the position of the space to
     *      change.
     * @param {int} yPos The y coordinate of the position of the space to
     *      change.
     * @param {float} delta How much to change the food value by.
    **/
    this.changePosFoodValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        foodValues[posIndex] += delta;
    };

    /**
     * Get the food value at the given position.
     *
     * @param {int} xPos The x coordinate of the position to get the current
     *      food value for.
     * @param {int} yPos The y coordinate of the position to get the current
     *      food value for.
     * @return {float} The food value at the given position.
    **/
    this.getPosFoodValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return foodValues[this.getPosIndex(xPos, yPos)];
    };

    /**
     * Determine if the given position is within the bounds of this grid.
     *
     * @param {int} xPos The x coordinate of the position to check bounds for.
     * @param {int} yPos The y coordinate of the position to check bounds for.
     * @return {bool} true if the given position is in bounds and false
     *      otherwise.
    **/
    this.doesPosExist = function(xPos, yPos)
    {
        return (xPos >= 0 && xPos < xSize) && (yPos >= 0 && yPos < ySize);
    };

    /**
     * Add pheremone to this grid such that the pheremone diffuses.
     *
     * @param {int} xPos The x coordinate of the position to introduce the
     *      pheremone at.
    **/
    this.changeAreaPheremoneValueDecay = function(xPos, yPos, delta, decay)
    {
        var spanRadius = Math.floor(delta / decay);
        var deltaStep = delta / (spanRadius+1);
        
        for(var radius=spanRadius; radius>=0; radius--)
        {
            this.changeAreaPheremoneValue(xPos, yPos, deltaStep, radius);
        }
    };

    /**
     * Add pheromone to an area of this grid.
     *
     * @param {int} xMid The x coordinate of the center of the area to add this
     *      pheromone.
     * @param {int} yMid The y coordinate of the center of the area to add this
     *      pheromone.
     * @param {float} delta The amount to add (positive number) / subtract
     *      (negative number) from this area.
     * @param {float} radius The radius of the area to change.
    **/
    this.changeAreaPheremoneValue = function(xMid, yMid, delta, radius)
    {
        var leftBound = xMid - radius;
        var rightBound = xMid + radius;
        var topBound = yMid - radius;
        var bottomBound = yMid + radius;
        
        for(var yPos=topBound; yPos<=bottomBound; yPos++)
        {
            for(var xPos=leftBound; xPos<=rightBound; xPos++)
            {
                if(this.doesPosExist(xPos, yPos))
                    this.changePosPheremoneValue(xPos, yPos, delta);
            }
        }
    };

    /** 
     * Get the width of this grid.
     *
     * @return {int} The width in spaces of this grid.
    **/
    this.getXSize = function()
    {
        return xSize;
    };

    /** 
     * Get the height of this grid.
     *
     * @return {int} The height in spaces of this grid.
    **/
    this.getYSize = function()
    {
        return ySize;
    };

    var numSpaces = this.getPosIndex(xSize - 1, ySize - 1) + 1;
    var pheremoneValues = new Array(numSpaces);
    var foodValues = new Array(numSpaces);

    for(var i=0; i<numSpaces; i++)
    {
        pheremoneValues[i] = 0;
        foodValues[i] = 0;
    }
}


if(usingNode)
{
    exports.AntsGrid = AntsGrid;
}
else
{
    ants_grid.AntsGrid = AntsGrid;
}
