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
    };

    this.getPosIndex = function(xPos, yPos)
    {
        return ySize * yPos + xPos;
    };

    this.getPosPheremoneValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return pheremoneValues[this.getPosIndex(xPos, yPos)];
    };

    this.getSurroundingPheremoneValues = function(xPos, yPos)
    {
        var retVal = new Array(constants.NUM_SURROUNDING_POSITIONS);
        retVal[constants.UP_INDEX] = this.getPosPheremoneValue(xPos, yPos - 1);
        retVal[constants.RIGHT_INDEX] = this.getPosPheremoneValue(xPos+1, yPos);
        retVal[constants.DOWN_INDEX] = this.getPosPheremoneValue(xPos, yPos+1);
        retVal[constants.LEFT_INDEX] = this.getPosPheremoneValue(xPos-1, yPos);
        return retVal;
    };

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

    this.changePosFoodValue = function(xPos, yPos, delta)
    {
        var posIndex = this.getPosIndex(xPos, yPos);
        foodValues[posIndex] += delta;
    };

    this.getPosFoodValue = function(xPos, yPos)
    {
        if(!this.doesPosExist(xPos, yPos))
            return constants.NON_EXISTANT_SPACE;
        return foodValues[this.getPosIndex(xPos, yPos)];
    };

    this.doesPosExist = function(xPos, yPos)
    {
        return (xPos >= 0 && xPos < xSize) && (yPos >= 0 && yPos < ySize);
    };

    this.changeAreaPheremoneValueDecay = function(xPos, yPos, delta, decay)
    {
        var spanRadius = Math.floor(delta / decay);
        var deltaStep = delta / (spanRadius+1);
        
        for(var radius=spanRadius; radius>=0; radius--)
        {
            this.changeAreaPheremoneValue(xPos, yPos, deltaStep, radius);
        }
    };

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
