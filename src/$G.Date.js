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
_require("$jb/$G.String.js").
//_require("$jb/libconsole.js").
_willDeclared("$jb/$G.Date.js").
_completed(function($G, $jb){

var Date = $G.Date;

// ecma5 15.9.4.4 
if(typeof(Date.now) != 'function')
{
  Date.now = function()
  {
    return +new Date();
  };
}

Date.units_ =
[
  { name: "ms", uName: "Ms", value: 1000 },
  { name: "s", uName: "S", value: 60 },
  { name: "min", uName: "Min", value: 60 },
  { name: "h", uName: "H", value: 24 },
  { name: "d", uName: "D", value: 7 },
  { name: "w", uName: "W", value: 4 },
  { name: "m", uName: "M", value: 12 },
  { name: "y", uName: "Y", value: 1 }
];

Date.__buildRanges = function()
{
  var us = Date.units_, len = us.length,
    i, j,
    prod
    ;
  
  i = len; while(--i) // loop until 1
  {
    prod = 1;
    
    j = i; while(j--)
    {
      prod *= us[j].value;
      Date[us[j].name + 'In' + us[i].uName] = prod;
    }
  }
};

Date.__buildRanges();

delete Date.__buildRanges;
delete Date.units_;

Date.__resolveDayNames = function(toStringFuncName, names)
{
  var d = new Date(0);
  
  var dll = 0x7FFFFFFF, dlr = 0x7FFFFFFF;
  var i, dInW = Date.dInW;
  var m0, m1;
  var m = new Array(Date.dInW);
  var RegExp = $G.RegExp, 
    digitsAtStartRE = /^(\d+)/,
    digitsAtEndRE = /(\d+)$/
    ;
  
  var shift = d.getDate() + Date.dInW - d.getDay();

  i = -1; while(++i < dInW)
  {
    d.setDate(i + shift);
    m[i] = d[toStringFuncName]();
  };
  
  m1 = m[0];
  
  i = 0; while(++i < dInW)
  {
    m0 = m1;
    m1 = m[++i];
    
    if(m0.length < m1.length)
    {
      var tmp = m1;
      m1 = m0;
      m0 = tmp;
    }
    
    var dll2 = m0._diffLengthLeft(m1);
    var dlr2 = m0._diffLengthRight(m1);
  
    m0 = m0.slice(dll2, -dlr2);
    m1 = m1.slice(dll2, -dlr2);
  
    if(digitsAtStartRE.test(m0))
    {
      var len = RegExp.$1.length;
      
      m0 = m0.substring(len);
      m1 = m1.substring(len);
      dll2 += len;
      
      var dll3 = m0._diffLengthLeft(m1);
      
      if(dll3 == m0.length)
        return false;
      
      dll2 += dll3;
    }
    else if(digitsAtEndRE.test(m0))
    {
      var len = RegExp.$1.length;
      
      m0 = m0.slice(0, -len);
      m1 = m1.slice(0, -len);
      dlr2 += len;
      
      var dlr3 = m0._diffLengthRight(m1);
      
      if(dlr3 == 0)
        return false;
      
      dlr2 += dlr3;
    }
    else
    {
      continue;
    }
    
    if(dll > dll2)
      dll = dll2;
    if(dlr > dlr2)
      dlr = dlr2;
  }
  
  i = -1; while(++i < dInW)
  {
    names[i] = m[i].slice(dll, -dlr);
  }
};

Date.dayNames = [];
Date.__resolveDayNames("toDateString", Date.dayNames);
Date.dayLocNames = [];
Date.__resolveDayNames("toLocaleDateString", Date.dayLocNames);
//Date.__resolveDayNames("toLocaleString", Date.dayLocNames);

delete Date.__resolveDayNames;

Date.__resolveMonthNames = function(toStringFuncName, names, dayNames, isDynHourInString)
{
  var _cutDayName = null;
   
  if(dayNames.length > 0)
  {
    _cutDayName = function(str, d)
    {
      return str.replace(dayNames[d.getDay()], '');
    };
  }
  else
  {
    _cutDayName = function(str, d)
    {
      return str;
    };
  }
  
  var _correctHour = null;
  
  if(isDynHourInString == true)
  {
    _correctHour = function(d)
    {
      d.setHours(Date.hInD/2 - d.getTimezoneOffset()/Date.minInH);
    }
  }
  else
  {
    _correctHour = function(d)
    {
      d.setHours(Date.hInD/2);
    }
  }
  
  var d = new Date(0);
  var midDayHour = Date.hInD/2 - d.getTimezoneOffset()/Date.minInH;

  var i;
  var m0, m1;
  var dll = 0x7FFFFFFF;
  var dlr = 0x7FFFFFFF;
  var m = new Array(Date.mInY);
  var mInY = Date.mInY;
  
  d.setHours(midDayHour);
  
  for(i=0;i<Date.mInY;++i)
  {
    d.setMonth(i);
    _correctHour(d);
    m[i] = _cutDayName(d[toStringFuncName](), d);
  }
  
  m1 = m[0];
  
  i = 0; while(++i < mInY)
  {
    m0 = m1;

    m1 = m[i];

    if(m0 == m1) // no month in locale string 
      continue;

    if(m0.length < m1.length)
    {
      var tmp = m1;
      m1 = m0;
      m0 = tmp;
    }
    
    var dll2 = m0._diffLengthLeft(m1);
    var dlr2 = m0._diffLengthRight(m1);
    
    if(dll > dll2)
      dll = dll2;

    if(dlr > dlr2)
      dlr = dlr2;
  }
  
  if(dll == 0x7FFFFFFF)
    return false;

  i = -1; while(++i < mInY)
  {
    names[i] = m[i].slice(dll, -dlr);
  }
  
  return true;
};

Date.monthNames = [];
//Date.__resolveMonthNames("toGMTString", Date.monthNames, Date.dayNames, true);
Date.__resolveMonthNames("toDateString", Date.monthNames, Date.dayNames, false);
Date.monthLocNames = [];
//Date.__resolveMonthNames("toLocaleString", Date.monthLocNames, Date.dayLocNames, false);
Date.__resolveMonthNames("toLocaleDateString", Date.monthLocNames, Date.dayLocNames, false);

delete Date.__resolveMonthNames;

// @TODO localize it
/*
Date.prototype.dayNames_=
[
  "Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"
];
*/  


Date.prototype._getMaxDateOfMonth = function()
{
  var date = new Date(this),
    dateDay = 32;
  
  date.setDate(dateDay);
  
  return dateDay -= date.getDate();
};

Date.prototype._getWeekOfYear = function()
{
  var beginDate=new Date(0);
  
  beginDate.setFullYear(this.getFullYear());
  beginDate.setMonth(0);
  beginDate.setDate(1);
  
  return ((this - beginDate)/Date.msInW)|0;
};

Date.prototype._getFirstDayOfMonth = function()
{
  var date = new Date(this);
  
  date.setDate(1);
  
  var shift = date.getDay() - 1;
  
  if(shift < 0)
    shift += Date.dInW;
    
  return shift;
};

$jb._dateStepEq = function(d0, d1, step)
{
  if(d0 == null || d1 == null)
    return true;
  
  if(step == null)
    return +d0 === +d1;
  
  if(step === 0)
    return true;
  
  if(step < 0 && step > 6)
    return +d0 == +d1;
  
  switch(step)
  {
    case 6: if(d0.getSeconds() !== d1.getSeconds()) return false;
    case 5: if(d0.getMinutes() !== d1.getMinutes()) return false;
    case 4: if(d0.getHours() !== d1.getHours()) return false;
    case 3: if(d0.getDate() !== d1.getDate()) return false;
    case 2: if(d0.getMonth() !== d1.getMonth()) return false;
    case 1: if(d0.getFullYear() !== d1.getFullYear()) return false;
  }
  
  return true;
};

/*
(function()
{
  var cache = {};
  
  Date.prototype._format = function(fmt)
  {
    if(cache[fmt])
      return cache[fmt](this);
      
    var code = fmt;

    code = code.
      replace(/YYYY/g, '//\nd.getFullYear()+//\n').
      replace(/YY/g, '//\n(d.getFullYear()%100)+//\n').
      replace(/MM/g, '//\nd.getMonth()+//\n');
  };
})();
*/
});
