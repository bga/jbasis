/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
  Experimental common javascript RIA library http://github.com/bga/jbasis

  Copyright (c) 2009-2010, Fyodorov "Bga" Alexander <bga.email@gmail.com>
  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
      * Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
      * Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
      * The name of the developer may not be used to endorse or promote
        products derived from this software without specific prior
        written permission.

  THIS SOFTWARE IS PROVIDED BY FYODOROV "BGA" ALEXANDER "AS IS" AND ANY EXPRESS OR
  IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
  IN NO EVENT SHALL FYODOROV "BGA" ALEXANDER BE LIABLE FOR ANY DIRECT, INDIRECT,
  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
  NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
  @section DESCRIPTION
*/

$jb.Loader._scope().
//_require("$jb/$G.Function.js").
_willDeclared("$jb/$jb.CPU.js").
_completed(function($G, $jb){

var _dummy = function()
{

};

var _sum = $jb.Math.Statistic._sum
  , _avg = $jb.Math.Statistic._avg
  , _standardDeviation = $jb.Math.Statistic._standardDeviation
  , _normalAvg = $jb.Math.Statistic._normalAvg
;  

$jb._defClass(
{
  name: '$jb.Optimize.CPU',
  _constructor: function()
  {
    this.warmedCPULoopTimeAvg = null;
    this.warmedCPULoopTimeStandardDeviation = null;
    this.loopCount = null;

    this.isCPUMeasuring = false;
  },

  loopMinTime: 500, // ms

  _measureCPU: function(_onComplete)
  {
    var self = this; 
    
    self.loopCount = null;
    self.isCPUMeasuring = true;
    
    var loopCount;
    
    var _measureLoopCountBegin = function()
    {
      loopCount = 1;
      setTimeout(_measureLoopCountIterate, 0);
    };
    var _measureLoopCountIterate = function()
    {
      var d = Date.now();
      var i = loopCount; while(i--)
        _dummy();
        
      d = Date.now() - d;
      
      if(d == 0)
      {  
        loopCount *= 10;
        setTimeout(_measureLoopCountIterate, 0);
      }
      else if(d < self.loopMinTime)
      {  
        loopCount <<= 1;
        setTimeout(_measureLoopCountIterate, 0);
      }
      else
      {
        _measureLoopCountEnd();
      }
    };
    var _measureLoopCountEnd = function()
    {
      setTimeout(_measureWarmUpTimeBegin, 0);
    };
    
    var _calcLoopTime = function(times)
    {
      var timesLen = times.length
        , e = timesLen
        , i = e - 3
        , chunks = []
        , avg
        , standardDeviation
      ;
      
      do
      {
        do
        {
          avg = _avg(times, i, e)
          standardDeviation = _standardDeviation(times, avg, i, timesLen)
          ;
          
        }
        while(i-- && Math.abs(times[i] - avg) < 3*standardDeviation);

        e = i;
        chunks.push({i: i, avg: avg, standardDeviation: standardDeviation});
      }
      while(i > 0);
      
      var 
        i = chunks.length - 1
        , j = 0
        , avg = chunks[i].avg
        , reducedChunks = [chunks[i]];
      ;  
      
      while(--i >= 0)
      {
        if(chunks[i].avg < avg)
        {
          reducedChunks[j++] = chunks[i]; 
          avg = chunks[i].avg;
        }
      }
      
      var i = reducedChunks.length - 1
        , avg = reducedChunks[i].avg
        , standardDeviation = reducedChunks[i].standardDeviation
      ;
      
      while(i-- && Math.abs(reducedChunks[i].avg - avg) < standardDeviation)
        ;
      
      var i = (i > 0) ? reducedChunks[i - 1].i : 0; 
      var sum = _sum(times, i);
      
      if(sum < 1000)
        return false;
        
      self.warmedCPULoopTimeAvg = avg;  
      self.warmedCPULoopTimeStandardDeviation = standardDeviation;  
    
      return true;
    };
    
    var warmUpTimeBegin
      , warmUpTimeMinTime = 10000
      , warmUpTimeLoopTimes = []
    ;
    var _measureWarmUpTimeBegin = function()
    {
      warmUpTimeBegin = Date.now();
      warmUpTimeLoopTimes = [];
      setTimeout(_measureWarmUpTimeIterate, 0);
    };
    var _measureWarmUpTimeIterate = function()
    {
      var d = Date.now();
      var i = loopCount; while(i--)
        _dummy();
        
      var d2 = Date.now();
      if(d2 - d < self.loopMinTime)
      {  
        loopCount *= 1.1*self.loopMinTime/(d2 - d);
        
        return setTimeout(_measureWarmUpTimeBegin, 0);
      }
      
      warmUpTimeLoopTimes.push(d2 - d);
      
      if(d2 - warmUpTimeBegin < warmUpTimeMinTime)
        setTimeout(_measureWarmUpTimeIterate, 0);
      else  
        setTimeout(_measureWarmUpTimeEnd, 0);
    };
    var _measureWarmUpTimeEnd = function()
    {
      var i = _minStabileTime(warmUpTimeLoopTimes);
      
      var sum = _sum(warmUpTimeLoopTimes, i);
      
      if(_calcLoopTime(warmUpTimeLoopTimes))
      {  
        setTimeout(_measureWarmUpTimeBegin, 0);
      }
      else
      {
        setTimeout(_final, 0);
      }
    };
    
    var _final = function()
    {
      self.loopCount = loopCount;
      self.isCPUMeasuring = false;
      _onComplete && _onComplete();
    };
    
  },

  _warmUp: function(_onComplete)
  {
    if(this.loopCount == null)
    {
      
    }
  }
});
  
});