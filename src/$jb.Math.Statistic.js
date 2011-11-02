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
_willDeclared("$jb/$jb.Math.Statistic.js").
_completed(function($G, $jb){

var _sum = $jb.Math.Statistic._sum = function(data, b, e)
{
  var sum = 0;
  
  if(b == null)
    b = 0;
  if(e == null)
    e = data.length;
  
  var i = b - 1; while(++i < e)
    sum += data[i];
    
  return sum;  
};

var _avg = $jb.Math.Statistic._avg = function(data, b, e)
{
  if(b == null)
    b = 0;
  if(e == null)
    e = data.length;
  
  return _sum(data, b, e)/(e - b);  
};

var _standardDeviation  = $jb.Math.Statistic._standardDeviation = function(data, avg, b, e)
{
  var sum = 0, a;
  
  if(b == null)
    b = 0;
  if(e == null)
    e = data.length;

  var i = b - 1; while(++i < e)
    sum += (a = data[i] - avg)*a;
    
  return Math.sqrt(sum/(e - b - 1));  
};

var _normalAvg = $jb.Math.Statistic._normalAvg = function(data, b, e)
{
  if(b == null)
    b = 0;
  if(e == null)
    e = data.length;

  var avg = _avg(data, b, e)
    , standardDeviation = _standardDeviation(data, avg, b , e)
    , standardDeviation3 = standardDeviation*3
    , sum = 0
    , a
    , n = 0
    , _abs = Math.abs
  ;  
  
  var i = b - 1; while(++i < e)
  {  
    if(_abs((a = data[i]) - avg) < standardDeviation3)
    {  
      sum += a;
      ++n;
    }  
  }

  return sum/n;  
};

});