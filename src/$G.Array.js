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
 
  ecma5 Array s complete support with optimization
*/

$jb.Loader._scope().
//_require("$jb/$G.Function.js").
_require("$jb/$jb.Preprocessor.js").
_willDeclared("$jb/$G.Array.js").
_completed(function(){

if(!Array.isArray)
{
  (function()
  {
    var _objToString = Object.prototype.toString;
    
    Array.isArray = function(a)
    {
      return (a instanceof Array) || _objToString.call(a) === "[object Array]";
    };
  })();
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
if(typeof([].indexOf) !== "function")
{
  $G.Array.prototype.indexOf = function(value, begin)
  {
    var end = this.length;
    
    if(begin == null)
    {  
      begin = -1;
    }
    else if(begin < 0)
    {
      begin += end - 1;
      
      if(begin < -1)
        begin = -1;
    }
    else if(begin >= end)
    {
      return -1;
    }
    else
    {
      --begin;
    }
    
    while(++begin < end && this[begin] !== value)
      ;
    
    return (begin !== end) ? begin : -1;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf
if(typeof([].lastIndexOf) !== "function")
{
  $G.Array.prototype.lastIndexOf = function(value, end)
  {
    var len;
    
    if(end == null)
    {
      end = this.length;
    }
    else if(end < 0)
    {
      end += this.length+1;
      
      if(end < 1)
        return -1;
    }
    else if(end >= (len = this.length))
    {
      end = len;
    }
    else
    {
      ++end;
    }
    
    while(end-- && this[end] !== value)
      ;
    
    return end;
  };
}

/*
if($w.opera)
{
  $temp.arrayParamMap.forwardLoop = "for(i = 0; i < len; i++)";
  $temp.arrayParamMap.backwardLoop = "for(i = len; i >= 0 ; i--)";
}
else
{
  $temp.arrayParamMap.forwardLoop = "i = -1; while(++i < len)";
  $temp.arrayParamMap.backwardLoop = "i = len; while(i--)";
}
*/

eval((new $jb.Preprocessor()).
_define('VAR_DECLARE',
  ($d.recalc) ? 'var v;' : ''
).  
_define('VALUE_TEST',
  ($d.recalc) ? "typeof(v=this[i])!=='undefined'" : '(i in this)'
).  
_define('VALUE_TEST_NOT',
  ($d.recalc) ? "typeof(v=this[i])==='undefined'" : "!(i in this)"
).  
_define('VALUE_PASS',
  ($d.recalc) ? "v" : "this[i]"
).  
_define('T_LBL:',
  ''
).  
_define('D_LOOP_BODY(B_, E_)',
  ($w.opera) ? "for(;B_<E_;B_++)" : "while(++B_<E_)"
).  
_define('D_LOOP_INIT(B_)',
  ($w.opera) ? "B_=0;" : "B_=-1;"
).  
_define('D_LOOP_NORM(B_)',
  ($w.opera) ? "++B_;" : ""
).  
_define('D_LOOP_FULL(B_, E_)',
  'D_LOOP_INIT(B_) D_LOOP_BODY(B_,E_)'
).  
_define('I_LOOP_BODY(B_)',
  ($w.opera) ? "for(;B_>=0;B_--)" : "while(B_--)"
).  
_define('I_LOOP_INIT(B_, E_)',
  ($w.opera) ? "B_=E_-1;" : "B_=E_;"
).  
_define('I_LOOP_NORM(B_)',
  ($w.opera) ? "--B_;" : ""
).  
_define('I_LOOP_FULL(B_, E_)',
  'I_LOOP_INIT(B_,E_) I_LOOP_BODY(B_)'
).
_pass(
$jb._preprocessingTextBegin(function(){

if(!([].slice) || ($w.opera && $w.opera.version() < 11.0))
{
  // opera has 4x slower code .slice realisation that clear js realisation
  Array.prototype.slice = function(begin, end)
  {
    var len = this.length;
    
    if(begin == null)
    {
      begin = 0;
    }
    else if(begin < 0)
    {
      begin += len;
     
      if(begin < 0)
        begin = 0;
    }
    else if(begin >= len)
    {
      return [];
    }
    
    if(end == null)
    {
      end = len;
    }
    else if(end < 0)
    {
      end += len;
      
      if(end < 0)
        return [];
    }
    else if(end > len)
    {
      end = len;
    }
    
    if((len = end - begin) <= 0)
      return [];
      
    var a = new Array(len), i;
    
    I_LOOP_FULL(i, len)
      a[i] = this[--end];
      
    return a;  
  };
}

if($w.opera || ![].concat)
{
  Array.prototype.concat=function()
  {
    var thisLen = this.length, 
    a = new Array(thisLen), j, 
    argsLen=arguments.length, i, 
    b, bLen, k, l;
    
    j = thisLen;
    while(j--)
      a[j] = this[j];
    
    if(argsLen === 0)
      return a;
      
    var _isArray = Array.isArray;
    
    j = thisLen;
    D_LOOP_FULL(i, argsLen)
    {
      if(_isArray(b = arguments[i]))
      {
        if((bLen = b.length) > 0)
        {
          j = l = a.length += bLen;
          
          I_LOOP_FULL(k, bLen)
            a[--l] = b[k];
        }    
      }
      else
      {
        a[j++] = b;
      }
    }
    
    return a;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
if(typeof([].filter) !== "function")
{
  if($d.recalc)
  {
    $G.Array.prototype.filter = function(_fn, that)
    {
      if(typeof(_fn) !== "function")
        throw new TypeError();
      
      var i = -1, len = this.length, j = 0,
        a = new Array(), v;
      
      if(that == null)
      {
        while(++i < len)
        {
          if(typeof(v = this[i]) !== 'undefined' && _fn(v, i, this))
            a[j++] = v;
        }  
      }
      else
      {
        while(++i < len)
        {
          if(typeof(v = this[i]) !== 'undefined' && _fn.call(that, v, i, this))
            a[j++] = v;
        }    
      }
      
      return a;
    };
  }
  else
  {
    $G.Array.prototype.filter = function(_fn, that)
    {
      if(typeof(_fn) !== "function")
        throw new TypeError();
      
      var i, len = this.length, j = 0,
        a = new Array(), v;
      
      if(that == null)
      {
        D_LOOP_FULL(i, len)
        T_LBL:{
          if((i in this) && _fn((v = this[i]), i, this))
            a[j++] = v;
        }  
      }
      else
      {
        D_LOOP_FULL(i, len)
        T_LBL:{
          if((i in this) && _fn.call(that, (v = this[i]), i, this))
            a[j++] = v;
        }    
      }
      
      return a;
    };
  }
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
if(typeof([].forEach) !== "function")
{
  $G.Array.prototype.forEach = function(_fn, that)
  {
    if(typeof(_fn) !== "function")
      throw new TypeError();
    
    var i, len = this.length;
    
    VAR_DECLARE;
    
    if(that == null)
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          _fn(VALUE_PASS, i, this);
      }    
    }
    else
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          _fn.call(that, VALUE_PASS, i, this);
      }    
    }
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
if(typeof([].every) !== "function")
{
  $G.Array.prototype.every = function(_fn, that)
  {
    if(typeof(_fn) !== "function")
      throw new TypeError();
    
    var i, len = this.length;
    
    VAR_DECLARE;

    if(that == null)
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && !_fn(VALUE_PASS, i, this))
          return false;
      }    
    }
    else
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && !_fn.call(that, VALUE_PASS, i, this))
          return false;
      }    
    }
    
    return true;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
if(typeof([].map) !== "function")
{
  $G.Array.prototype.map = function(_fn, that)
  {
    if(typeof(_fn) !== "function")
      throw new TypeError();
    
    var i, len = this.length;
    var a = new Array(len);
    
    VAR_DECLARE;
    
    if(that == null)
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          a[i] = _fn(VALUE_PASS, i, this);
      }  
    }
    else
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          a[i] = _fn.call(that, VALUE_PASS, i, this);
      }  
    }
    
    return a;
  };
}

// developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/someif(typeof([].every) != "function")
if(typeof([].some) !== "function")
{
  $G.Array.prototype.some = function(_fn, that)
  {
    if(typeof(_fn) !== "function")
      throw new TypeError();
    
    var i, len = this.length;
    
    VAR_DECLARE;

    if(that == null)
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && _fn(VALUE_PASS, i, this))
          return true;
      }    
    }
    else
    {
      D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && _fn.call(that, VALUE_PASS, i, this))
          return true;
      }    
    }
    
    return false;
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if(typeof([].reduce) !== "function")  
{  
  Array.prototype.reduce = function(_fn , rv)  
  {  
    if (typeof(_fn) !== "function")  
      throw new TypeError();  
  
    var len = this.length, i = -1;  
    
    if(rv == null)  
    {  
      // no value to return if no rv value and an empty array  
      if(len === 0)  
        throw new TypeError();  
      
      while(++i < len && VALUE_TEST_NOT)
        ;
      
      // if array contains no values, no rv value to return  
      if (i  === len)  
        throw new TypeError();  

      rv = this[i];  
    }  

    VAR_DECLARE;
    
    D_LOOP_NORM(i)
    D_LOOP_BODY(i, len)
    {  
      if(VALUE_TEST)  
        rv = _fn(rv, VALUE_PASS, i, this);  
    }  
  
    return rv;  
  };
}

// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if(typeof([].reduceRight) !== "function")  
{  
  Array.prototype.reduceRight = function(_fn, rv)  
  {  
    if (typeof(_fn)  !== 'function')
      throw new TypeError();
  
    var i = this.length;

    if(rv == null)
    {
      if(i  === 0)
        throw new TypeError();
      
      while(i-- && VALUE_TEST_NOT)
        ;

      if (i  === -1)
        throw new TypeError();

      rv = this[i];
    }

    VAR_DECLARE;

    I_LOOP_NORM(i)
    I_LOOP_BODY(i)
    {
      if(VALUE_TEST)
        rv = _fn(rv, VALUE_PASS, i, this);
    }
  
    return rv;
  };
}
})._preprocessingTextEnd()
));

});