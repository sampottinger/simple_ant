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
            var curVal = pheremoneValues[i];
            if(curVal >= constants.EVAPORATION_RATE)
                pheremoneValues[i] -= constants.EVAPORATION_RATE;
            else if(curVal < constants.EVAPORATION_RATE && curVal > 0)
                pheremoneValues[i] = 0;
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
        retVal[constants.RIGHT_INDEX] = this.getPosPheremoneValue(xPos+1, yPos);
        retVal[constants.DOWN_INDEX] = this.getPosPheremoneValue(xPos, yPos+1);
        retVal[constants.LEFT_INDEX] = this.getPosPheremoneValue(xPos-1, yPos);
        return retVal;
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

    this.changePosFoodValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        foodValues[posIndex] += delta;
    }

    this.getPosFoodValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return foodValues[this.getPosIndex(xPos, yPos)];
    }

    this.doesPosExist = function(xPos, yPos)
    {
        var pos = this.getPosIndex(xPos, yPos);
        return pos >= 0 && pos < pheremoneValues.length;
    }

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
    ant_grid.AntsGrid = AntsGrid;
}
