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
//_require("$jb/nav.js").
_willDeclared("$jb/$jb.SubArray.js").
_completed(function($G, $jb){

$jb.SubArray = function(a, begin, end, step)
{
  this.a = a;
  
  if(step > 1)
  {  
    this.length = ((end - begin + 1)/step)|0;
    end = begin + this.length*step;
  }
  else
  {
    this.length = end - begin;
  }

  this.begin = begin;
  this.end = end;
  this.step = step;
};

$G.Array.prototype._sub = function(b, e, step)
{
  var end = this.length;
  var temp;

  if(step == null)
    step = 1;
    
  if(b == null)
  {  
    b = 0;
  }
  else if(b < 0)
  {  
    if((b += end) < 0)
      b = (step == 1) ? 0 : (temp = b % step) && temp + step;
  }
  else if(b >= end)
  {
    return new $jb.SubArray(this, end, end, step);
  }
  
  if(e == null)
  {  
    e = end;
  }
  else if(e < 0)
  {  
    if((e += end) < 0)
      return new $jb.SubArray(this, 0, 0, step);
  }
  else
  {
    if(e >= end)
      e = end;
  }
  
  if(b >= e)
    return new $jb.SubArray(this, b, b, step);
    
  return new $jb.SubArray(this, b, e, step);
};

$jb.SubArray.prototype._sub = function(b, e, step)
{
  var begin = this.begin, end = this.end;
  var temp;
  
  if(step == null)
    step = this.step;
  else
    step *= this.step;
  
  if(begin == end)
    return new $jb.SubArray(this.a, begin, begin, step);
  
  if(b == null)
  {  
    b = begin;
  }
  else if(b >= 0)
  {  
    if((b += begin) >= end)
      return new $jb.SubArray(this, end, end, step);
  }
  else if((b += end) < begin)
  {    
    if(step == 1)
    {
      b = begin;
    }
    else
    {
      b = (b - begin) % step;
      
      if(b < 0)
        b += step;
      
      b += begin;
    }
  }
  
  if(e == null)
  {  
    e = end;
  }
  else if(e >= 0)
  {  
    if((e += begin) >= end)
      e = end;
  }
  else if((e += end) < begin)
  {    
    return new $jb.SubArray(this, begin, begin, step);
  }
  
  if(b >= e)
    return new $jb.SubArray(this, b, b, step);

  return new $jb.SubArray(this, b, e, step);
};

SubArray.loopTml = $jb._fnCode(function()
{
  if(this.end <= this.begin)
    return;
    
  var a = this.a;
  
  __USER_VARS__();
  __USER_BEFORE_LOOP__();
  
  if(this.step == 1)
  {
    switch(this.begin)
    {
      case 0:
      var i = this.end; while(i--)
        __USER_LOOP_ITER__();
      break;

      case 1:
      var i = this.end; while(--i)
        __USER_LOOP_ITER__();
      break;
      
      default:
      var i = this.end, begin = this.begin; while(--i >= begin)
        __USER_LOOP_ITER__();
    }
  }
  else
  {
    var end = this.end, step = this.step, i = this.begin - step; while((i += step) < end)
      __USER_LOOP_ITER__();
  }
  
  __USER_AFTER_LOOP__();
  
});

SubArray.forwardLoopTml = $jb._fnCode(function()
{
  
  if(this.end <= this.begin)
    return;
    
  var a = this.a;
  
  __USER_VARS__();
  __USER_BEFORE_LOOP__();
  
  if(this.step == 1)
  {
    var end = this.end, i = this.begin - 1; while(++i < end)
      __USER_LOOP_ITER__();
  }
  else
  {
    var end = this.end, step = this.step, i = this.begin - step; while((i += step) < end)
      __USER_LOOP_ITER__();
  }
  
  __USER_AFTER_LOOP__();
  
});

SubArray.backwardLoopTml = $jb._fnCode(function()
{
  if(this.end <= this.begin)
    return;
    
  var a = this.a;

  __USER_VARS__();
  __USER_BEFORE_LOOP__();
  
  if(this.step == 1)
  {
    switch(this.begin)
    {
      case 0:
      var i = this.end; while(i--)
        __USER_LOOP_ITER__();
      break;

      case 1:
      var i = this.end; while(--i)
        __USER_LOOP_ITER__();
      break;
      
      default:
      var i = this.end, begin = this.begin; while(--i >= begin)
        __USER_LOOP_ITER__();
    }
  }
  else
  {
    var i = this.end, step = this.step, begin = this.begin; while((i -= step) >= begin)
      __USER_LOOP_ITER__();
  }
  
  __USER_AFTER_LOOP__();
  
});

SubArray._defFn = function(fnName, argNames, userLoopIter, userVars, userBeforeLoop, userAfterLoop, tml)
{
  $jb.SubArray.prototype[fnName] = new Function(
    argNames, 
    (tml || $jb.SubArray.loopTml).
      replace(/__USER_LOOP_ITER__\(\);/g, '{' + userLoopIter + '}').
      replace('__USER_VARS__();', userVars || '').
      replace('__USER_BEFORE_LOOP__();', userBeforeLoop || '').
      replace('__USER_AFTER_LOOP__();', userAfterLoop || '')
  );  
};

SubArray._defFn(
  '_fillWithConst',
  'v',
  $jb._fnCode(function()
  {
    a[i] = v;
  })
);
SubArray._defFn(
  '_fillWithObject',
  '_c',
  $jb._fnCode(function()
  {
    a[i] = new _c();
  })
);
SubArray._defFn(
  '_fillWithLambda',
  '_fn',
  $jb._fnCode(function()
  {
    a[i] = _fn(i, a);
  })
);
SubArray._defFn(
  '__fillWithNumericRange',
  'x, d',
  $jb._fnCode(function()
  {
    a[i] = x;
    x += d;
  })
);
SubArray._defFn(
  '__fillWithNumericRangeInc',
  'x',
  $jb._fnCode(function()
  {
    a[i] = x++;
  })
);
SubArray._defFn(
  '__fillWithNumericRangeDec',
  'x',
  $jb._fnCode(function()
  {
    a[i] = x--;
  })
);
SubArray.prototype._fillWithNumericRange = function(x, d)
{
  if(d == null && d == 1)
    this.__fillWithNumericRangeInc(x);
  else if(d == -1)
    this.__fillWithNumericRangeDec(x);
  else  
    this.__fillWithNumericRange(x, d);
};
SubArray._defFn(
  '__fillWithLiteralRange',
  'x, d',
  $jb._fnCode(function()
  {
    a[i] = _fromCharCode(x);
    x += d;
  }),
  'var _fromCharCode = String.fromCharCode'
);
SubArray._defFn(
  '__fillWithLiteralRangeInc',
  'x, d',
  $jb._fnCode(function()
  {
    a[i] = _fromCharCode(x++);
  }),
  'var _fromCharCode = String.fromCharCode'
);
SubArray._defFn(
  '__fillWithLiteralRangeDec',
  'x, d',
  $jb._fnCode(function()
  {
    a[i] = _fromCharCode(x--);
  }),
  'var _fromCharCode = String.fromCharCode'
);
SubArray.prototype._fillWithLiteralRange = function(x, d)
{
  if(d == null && d == 1)
    this.__fillWithLiteralRangeInc(x);
  else if(d == -1)
    this.__fillWithLiteralRangeDec(x);
  else  
    this.__fillWithLiteralRange(x, d);
};
SubArray._defFn(
  '_each',
  '_fn',
  $jb._fnCode(function()
  {
    _fn(a[i], i, a);
  })
);
SubArray._defFn(
  '_sum',
  '',
  $jb._fnCode(function()
  {
    sum += a[i];
  }),
  'var sum=0;',
  '',
  'return sum;'
);
SubArray._defFn(
  '_prod',
  '',
  $jb._fnCode(function()
  {
    prod *= a[i];
  }),
  'var prod=1;',
  '',
  'return prod;'
);
SubArray._defFn(
  '_min',
  '',
  $jb._fnCode(function()
  {
    if(min > a[i])
    {
      min = a[i];
    }
  }),
  'var min;',
  '',
  'return min;'
);
SubArray._defFn(
  '_indexOfMin',
  '',
  $jb._fnCode(function()
  {
    if(min > a[i])
    {
      min = a[i];
      minIndex = i;
    }
  }),
  'var min, minIndex;',
  '',
  'return minIndex;'
);
SubArray._defFn(
  '_max',
  '',
  $jb._fnCode(function()
  {
    if(max < a[i])
    {
      max = a[i];
    }
  }),
  'var max;',
  '',
  'return max;'
);
SubArray._defFn(
  '_indexOfMax',
  '',
  $jb._fnCode(function()
  {
    if(max < a[i])
    {
      max = a[i];
      maxIndex = i;
    }
  }),
  'var max, maxIndex;',
  '',
  'return maxIndex;'
);


SubArray.prototype._isSorted = /*#<*/new Function('_cmp', /*#>*/ /*## function(_cmp) { */
  /*#evalbegin */
  (function()
  {
    var mg = new $jb.Preprocessor.MacrosGroup();
  
    mg.
    _def('_CODE(COND_, BEGIN_, STEP_)',
      $jb._fnCode(function()
      {
        var i = this.end - STEP_; 
        
        while(i && a[i] == a[--i])
          ;
        
        if(i == BEGIN_)
          return true;

        if(a[i] < a[i + STEP_])
        {
          while(COND_ && a[i] <= a[i + STEP_])
            ;
        }
        else
        {
          while(COND_ && a[i] >= a[i + STEP_])
            ;
        }
          
        return i == BEGIN_;  
      })
    ).
    _def('_CODE(COND_, BEGIN_, STEP_)',
      $jb._fnCode(function()
      {
        var i = this.end - STEP_; 
        
        //while(i > 0 && a[i] == a[--i])
        //  ;
        while(COND_ && a[i] == a[i + STEP_])
          ;
        
        if(i == BEGIN_)
          return true;

        if(a[i] < a[i + STEP_])
        {
          while(COND_ && a[i] <= a[i + STEP_])
            ;
        }
        else
        {
          while(COND_ && a[i] >= a[i + STEP_])
            ;
        }
          
        return i == BEGIN_;  
      })
    ).
    _def('_CODE_WITH_CMPFN(COND_, BEGIN_, STEP_)',
      $jb._fnCode(function()
      {
        var i = this.end - STEP_; 
        
        //while(i > 0 && a[i] == a[--i])
        //  ;
        while(COND_ && _cmp(a[i], a[i + STEP_]) == 0)
          ;
        
        if(i == BEGIN_)
          return true;

        if(_cmp(a[i], a[i + STEP_]) > 0)
        {
          while(COND_ && _cmp(a[i], a[i + STEP_]) >= 0)
            ;
        }
        else
        {
          while(COND_ && _cmp(a[i], a[i + STEP_]) <= 0)
            ;
        }
          
        return i == BEGIN_;  
      })
    ).
    _def('_DISPATCH(_CODE_)',
      $jb._fnCode(function(){
        if(this.step == 1)
        {
          switch(this.begin)
          {
            case 0:
              _CODE_(i--, 0, 1)
            case 1:
              _CODE_(--i, 1, 1)
            default:
              var begin = this.begin;
              _CODE_(begin <= --i, begin, 1)
          }
        }
        else
        {
          var end = this.end, step = this.step;
          _CODE_(begin <= (i -= step), begin, step)
        }
      })
    )
  ;
    
  return $jb.Preprocessor._pass($jb._fnCode(function()
  {
    if(this.length < 3)
      return true;
      
    var a = this.a;
    
    if(_cmp != null)
    {
      _DISPATCH(_CODE_WITH_CMPFN)
    }
    else
    {
      _DISPATCH(_CODE)
    }
  }, mg)
  /*#evalend */
/*## } */ /*#<*/)/*#>*/; 

SubArray.prototype._uniqueSelf = /*#<*/new Function('_cmp', /*#>*/ /*## function(_cmp) { */
  /*#evalbegin */
  (new $jb.Preprocessor()).
  _define('_CODE(COND_, BEGIN_, STEP_)',
    $jb._fnCode(function()
    {
      var i = this.end - STEP_; 
      
      //while(i > 0 && a[i] == a[--i])
      //  ;
      while(COND_ && a[i] != a[i + STEP_])
        ;
      
      if(i == BEGIN_)
        return true;

      if(a[i] < a[i + STEP_])
      {
        while(COND_ && a[i] <= a[i + STEP_])
          ;
      }
      else
      {
        while(COND_ && a[i] >= a[i + STEP_])
          ;
      }
        
      return i == BEGIN_;  
    })
  ).
  _define('_CODE_WITH_CMPFN(COND_, BEGIN_, STEP_)',
    $jb._fnCode(function()
    {
      var i = this.end - STEP_; 
      
      //while(i > 0 && a[i] == a[--i])
      //  ;
      while(COND_ && _cmp(a[i], a[i + STEP_]) == 0)
        ;
      
      if(i == BEGIN_)
        return true;

      if(_cmp(a[i], a[i + STEP_]) > 0)
      {
        while(COND_ && _cmp(a[i], a[i + STEP_]) >= 0)
          ;
      }
      else
      {
        while(COND_ && _cmp(a[i], a[i + STEP_]) <= 0)
          ;
      }
        
      return i == BEGIN_;  
    })
  ).
  _define('_DISPATCH(_CODE_)',
    $jb._fnCode(function(){
      if(this.step == 1)
      {
        switch(this.begin)
        {
          case 0:
            _CODE_(i--, 0, 1)
          case 1:
            _CODE_(--i, 1, 1)
          default:
            var begin = this.begin;
            _CODE(begin <= --i, begin, 1)
        }
      }
      else
      {
        var end = this.end, step = this.step;
        _CODE_(begin <= (i -= step), begin, step)
      }
    })
  ).
  _pass($jb._fnCode(function()
  {
    if(this.length < 3)
      return true;
      
    var a = this.a;
    
    if(_cmp != null)
    {
      _DISPATCH(_CODE_WITH_CMPFN)
    }
    else
    {
      _DISPATCH(_CODE)
    }
  })
  /*#evalend */
/*## } */ /*#<*/)/*#>*/; 


SubArray.prototype._find = function(value,isReturnRelative)
{
  this._updateRealBounds();

  if(this.length == 0 || this.a.length == 0)
    return null;
  
  var begin = this.rBegin;
  var end = this.rEnd;
  var step = this.rStep;

  while(begin!=end && this.a[begin]!=value)
    begin + =step;
  
  return begin!=end ? (isReturnRelative == true ? this._absToRel(begin) : begin) : null;
};
//Array.prototype._indexOf = Array.prototype._find;
//Array.prototype._lastIndexOf = _fBind(Array.prototype._indexOf,[_0,_1,0],true);
/*
Array.prototype._lastIndexOf = function(el,begin)
{
  return this._find(el,begin,0);
};
*/

SubArray.prototype._findIf = function(_pred,isReturnRelative)
{
  if(_pred == null)
    return null;
  
  this._updateRealBounds();

  if(this.length == 0 || this.a.length == 0)
    return null;
  
  var begin = this.rBegin;
  var end = this.rEnd;
  var step = this.rStep;

  while(begin!=end && !_pred(this.a,begin))
     +  + begin;
  
  return begin!=end ? (isReturnRelative == true ? this._absToRel(begin) : begin) : null;
};

SubArray.prototype._bFind = function(value,isReturnRelative)
{
  this._updateRealBounds();
  
  if(this.length == 0 || this.a.length == 0)
    return null;
  
  var begin = this.rBegin;
  var end = this.rEnd;
  var step = this.rStep;
  
  /*
  if(begin > end)
  {
    end - =step;
    
    var tmp = begin;
    
    begin = end;
    end = tmp;
    
    end + =step;
  }
  */
  
  var center=(begin + end)>>1;
  
  while(begin!=end && this.a[center]!=value)
  {
    center=(begin + end)>>1;
    
    if(this[center]<value)
      begin = center;
    else
      end = center;
  }
  
  return this.a[center] == value ? (isReturnRelative == true ? this._absToRel(begin) : begin) : null;
};
SubArray.prototype._bFindIf = function(_isNotEq,_isLess,isReturnRelative)
{
  if(_isNotEq == null || _isLess == null)
    return null;

  this._updateRealBounds();
  
  if(this.length == 0 || this.a.length == 0)
    return null;
  
  var begin = this.rBegin;
  var end = this.rEnd;
  var step = this.rStep;
  
  var center=(begin + end)>>1;
  
  while(begin!=end && _isNotEq(this.a[center],value))
  {
    center=(begin + end)>>1;
    
    if(_isLess(this.a[center],value)<0)
      begin = center;
    else
      end = center;
  }

  return !_isNotEq(this.a[center],value) ? (isReturnRelative == true ? this._absToRel(begin) : begin) : null;
};

SubArray.prototype._findMin = function()
{
  if(this.length == 0)
    return null;
  
  var j = begin;

  if(begin < end)
  {
    while(begin < end)
    {
      if(this[j]>this[begin])
        j = begin;
        
       +  + begin;
    }  
  }
  else
  {
    while(begin >= end)
    {
      if(this[j]>this[begin])
        j = begin;

       -  - begin;
    }  
  }
  
  return j;
};
Array.prototype._findMax = function(begin,end)
{
  if(this.length == 0)
    return null;
  
  if(begin < 0)
  {
    begin = this.length - begin + 1;
    end = end < 0 ? this.length - end + 1 : (end || 0);
  }
  else
  {
    begin = begin || 0;
    end = end < 0 ? this.length - end + 1 : (end || this.length);
  }

  var j = begin;

  if(begin < end)
  {
    while(begin < end)
    {
      if(this[j]<this[begin])
        j = begin;
        
       +  + begin;
    }  
  }
  else
  {
    while(begin >= end)
    {
      if(this[j]<this[begin])
        j = begin;

       -  - begin;
    }  
  }
  
  return j;
};

Array.prototype._blur = function(radius,boundRadius,isStrongSubArray,begin,end,destArr,destBegin)
{
  if(begin < 0)
  {
    begin = this.length - begin + 1;
    end = end < 0 ? this.length - end + 1 : (end || 0);
  }
  else
  {
    begin = begin || 0;
    end = end < 0 ? this.length - end + 1 : (end || this.length);
  }
  
  var ret = destArr || new Array(Math.abs(end - begin));
  var tmp;
  var i;
  var coef = 0.3333333;
  
  for(i = begin,tmp = 0;i < boundRadius; +  + i)
    tmp + =this[i];

  var beginEl = this[begin];
  this[begin]=ret[begin]=tmp/boundRadius;
  
  for(i = end - boundRadius,tmp = 0;i < end; +  + i)
    tmp + =this[i];

  var endEl = this[end - 1];
  this[end - 1]=ret[end - 1]=tmp/boundRadius;
  
  for(i = begin + 2;i<(end - 2); +  + i)
    ret[i]=coef*(this[i - 1] + this[i] + this[i + 1]);
  
  return ret;
};

SubArray.prototype._invertToMap = function(obj)
{
  if(obj == null)
    obj={};
  
  for(;begin < end; +  + begin)
    obj[this[begin]]=i;
  
  return obj;
};

});

/*
var a = new MutableValue(
  {
    __call__: function(b)
    {
      this = b;
    };
  }
);

a(1); // really a = 1
console.log(a) // 1
*/
