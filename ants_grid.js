var usingNode = typeof window === 'undefined';
var ant_grid = {};

if(usingNode)
{
    var constants = require("./constants");
}

function AntsGrid(xSize, ySize)
{
    this.evaporate = function()
    {
        for(var i in pheremoneValues)
        {
            pheremoneValues[i] -= constants.EVAPORATION_RATE;
        }
    }

    this.getPosIndex = function(xPos, yPos)
    {
        return ySize * yPos + xPos;
    }

    this.getPosPheremoneValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return pheremoneValues[this.getPosIndex(xPos, yPos)];
    }

    this.getSurroundingPheremoneValues = function(xPos, yPos)
    {
        var retVal = new Array(constants.NUM_SURROUNDING_POSITIONS);
        retVal[constants.UP_INDEX] = this.getPosPheremoneValue(xPos, yPos - 1);
        retVal[constants.RIGHT_INDEX] = this.getPosPheremoneValue(xPos, yPos);
        retVal[constants.DOWN_INDEX] = this.getPosPheremoneValue(xPos, yPos);
        retVal[constants.LEFT_INDEX] = this.getPosPheremoneValue(xPos, yPos);
    }

    this.changePosPheremoneValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        var newVal = pheremoneValues[posIndex] + delta;
        
        if(newVal > constants.MAX_PHEREMONE_VALUE)
            newVal = constants.MAX_PHEREMONE_VALUE;
        else if(newVal < constants.MIN_PHEREMONE_VALUE)
            newVal = constants.MIN_PHEREMONE_VALUE;

        pheremoneValues[posIndex] = newVal;
    }

    this.changeFoodValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        foodValues[posIndex] += delta;
    }

    this.getFoodValue = function(xPos, yPos)
    {
        return foodValues[this.getPosIndex(xPos, yPos)];
    }

    this.doesPosExist = function(xPos, yPos)
    {
        return this.getPosIndex(xPos, yPos) >= pheremoneValues.length;
    }

    var pheremoneValues = new Array(getPosIndex(xSize, ySize) + 1);
    var foodValues = new Array(getPosIndex(xSize, ySize) + 1);

    for(var i in pheremoneValues)
        pheremoneValues[i] = 0;

    for(var i in foodValues)
        pheremoneValues[i] = 0;
}

if(usingNode)
{
    exports.AntsGrid = AntsGrid;
}
else
{
    ant_grid.AntsGrid = AntsGrid;
}
