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
_require("$jb/$jb.nav.js").
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
  
    if(m0.substr(-dlr2, 3) == 'day')
      dlr2 -= 3;
    
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

      if(m0.substr(-dlr3, 3) == 'day')
        dlr3 -= 3;
      
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

Date.dayEnFullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.dayEnShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
Date.monthEnFullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.monthEnShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


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

Date._stepEq = function(d0, d1, step)
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
    case 6: if(d0.getSeconds() != d1.getSeconds()) return false;
    case 5: if(d0.getMinutes() != d1.getMinutes()) return false;
    case 4: if(d0.getHours() != d1.getHours()) return false;
    case 3: if(d0.getDate() != d1.getDate()) return false;
    case 2: if(d0.getMonth() != d1.getMonth()) return false;
    case 1: if(d0.getFullYear() != d1.getFullYear()) return false;
  }
  
  return true;
};

// http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx
(function()
{
  var cache = {};
  var begin, end;

  if($jb.nav._ie())
  {  
    begin = '[';
    end = '].join("");'
  }
  else
  {
    begin = '"".concat(';
    end = ');'
  }
  
  Date.prototype._format = function(fmt)
  {
    if(cache[fmt])
      return cache[fmt](this);
      
    var s = '', tag;
    var op = 0, lb = fmt.indexOf('{');
    
    if(lb < 0)
      return fmt;
    
    rb = fmt.indexOf('}', ++lb);
    
    if(rb < 0)
      return fmt;
    
    for( ;; )
    {
      while((p = fmt.indexOf('{', lb)) > -1 && p < rb)
        lb = p + 1;
    
      if(lb > op)
        s += '"' + fmt.slice(op, lb - 1)._escapeForCString() + '",';
      
      op = rb + 1;
      
      switch((tag = fmt.slice(lb, rb)))
      {
        case 'd': s += 'd.getDate(),'; break;
        case 'dd': s += '(100+d.getDate()+"").slice(-2),'; break;
        case 'ddd': s += 'Date.dayEnShortNames[d.getDate()],'; break;
        case 'dddd': s += 'Date.dayEnFullNames[d.getDate()],'; break;
      
        case 'f': s += '((0.01*d.getMilliseconds())|0),'; break;
        case 'ff': s += '((0.1*d.getMilliseconds())|0),'; break;
        case 'fff': s += 'd.getMilliseconds(),'; break;
        case 'ffff': s += 'd.getMilliseconds(),"0",'; break;
        case 'fffff': s += 'd.getMilliseconds(),"00",'; break;
        case 'ffffff': s += 'd.getMilliseconds(),"000",'; break;
      
        case 'F': s += '(((0.01*d.getMilliseconds())|0)||""),'; break;
        case 'FF': s += '(((0.1*d.getMilliseconds())|0)||""),'; break;
        case 'FFF': s += '(d.getMilliseconds()||""),'; break;
        case 'FFFF': s += '((a=d.getMilliseconds())?a+"0":""),'; break;
        case 'FFFFF': s += '((a=d.getMilliseconds())?a+"00":""),'; break;
        case 'FFFFFF': s += '((a=d.getMilliseconds())?a+"000":""),'; break;
      
        case 'g': s += '"A.D",'; break;
        case 'gg': s += '"A.D",'; break;
      
        case 'h': s += '((d.getHours()%12)||12),'; break;
        case 'hh': s += '(100+((d.getHours()%12)||12)+"").slice(-2),'; break;

        case 'H': s += 'd.getHours(),'; break;
        case 'HH': s += '(100+d.getHours()+"").slice(-2),'; break;

        case 'K': s += '((a=d.getTimezoneOffset())>0?"+":"-"),(100+Math.abs((a/60)|0)+"").slice(-2),":",(100+a%60+"").slice(-2),'; break;
      
        case 'm': s += 'd.getMinutes(),'; break;
        case 'mm': s += '(100 + d.getMinutes() + "").slice(-2),'; break;

        case 'M': s += '(d.getMonth()+1),'; break;
        case 'MM': s += '(101 + d.getMonth() + "").slice(-2),'; break;
        case 'MMM': s += 'Date.monthEnShortNames[d.getMonth()],'; break;
        case 'MMMM': s += 'Date.monthEnFullNames[d.getMonth()],'; break;

        case 's': s += 'd.getSeconds(),'; break;
        case 'ss': s += '(100+d.getSeconds() + "").slice(-2),'; break;

        case 't': s += '((d.getHours()<12)?"A":"P"),'; break;
        case 'tt': s += '((d.getHours()<12)?"AM":"PM"),'; break;

        case 'y': s += 'd.getYear()%10,'; break;
        case 'yy': s += '(100+d.getYear()+"").slice(-2),'; break;
        case 'yyy': s += '((a=d.getFullYear())<1000?(1000+a+"").slice(-3):a),'; break;
        case 'yyyy': s += '(10000+d.getFullYear()+"").slice(-4),'; break;
        case 'yyyyy': s += '(100000+d.getFullYear()+"").slice(-5),'; break;
      
        case 'z': s += '((a=d.getTimezoneOffset())>0?"+":"-"),((a/60)|0),'; break;
        case 'zz': s += '((a=d.getTimezoneOffset())>0?"+":"-"),(100+Math.abs((a/60)|0)+"").slice(-2),'; break;
        case 'zzz': s += '((a=d.getTimezoneOffset())>0?"+":"-"),(100+Math.abs((a/60)|0)+"").slice(-2),":",(100+a%60+"").slice(-2),'; break;
        
        default: s += '"{' + tag._escapeForCString() + '}",';
      }

      if((lb = fmt.indexOf('{', rb)) < 0)
        break;
      
      if((rb = fmt.indexOf('}', ++lb)) < 0)
        break;
    }
    
    if(op < fmt.length)
      s = s + '"' + fmt.slice(op)._escapeForCString() + '"';
    else if(s.charAt(s.length - 1) == ',')
      s = s.slice(0, -1);
    
    s = 'var a; return ' + begin + s + end;
    
    //console.log(s);
    
    return (cache[fmt] = new Function('d', s))(this);  
  };
})();
});
