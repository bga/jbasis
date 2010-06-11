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

Array.prototype._uniqueSelf = function()
{
  var len = this.length, i = 0;

  while (i < len && this[i] !== this[++i])
    ;

  if(i >= len)
    return this;
    
  var j = --i, v;
   
  while(i < len)
  {
    v = this[j++] = this[i];  
    
    while (++i < len && v === this[i])
      ;
  }
  
  this.length = j;

  return this;
};


(function(p)
{

if($d.recalc)
{
  p.
  _define('VAR_DECLARE',
    "var v;"
  ).  
  _define('VALUE_TEST',
    "typeof(v=this[i])!=='undefined'"
  ).  
  _define('VALUE_TEST_NOT',
    "typeof(v=this[i])==='undefined'"
  ).  
  _define('VALUE_PASS',
    "v"
  );  
}
else
{
  p.
  _define('VAR_DECLARE',
    ""
  ).  
  _define('VALUE_TEST',
    "(i in this)"
  ).  
  _define('VALUE_TEST_NOT',
    "!(i in this)"
  ).  
  _define('VALUE_PASS',
    "this[i]"
  );  
}

if($w.opera)
{
  p.
  /*
  _define('_D_LOOP_BODY($B_$, $E_$)',
    "for(;$B_$<$E_$;$B_$++)"
  ).  
  _define('_D_LOOP_INIT($B_$)',
    "$B_$=0;"
  ).  
  _define('_D_LOOP_NORM($B_$)',
    "++$B_$;"
  ).
  */
  _define('_D_LOOP_BODY($B_$, $E_$)',
    "while(++$B_$<$E_$)"
  ).  
  _define('_D_LOOP_INIT($B_$)',
    "$B_$=-1;"
  ).  
  _define('_D_LOOP_NORM($B_$)',
    ""
  ).  
  _define('_I_LOOP_BODY($B_$)',
    "for(;$B_$>=0;$B_$--)"
  ).  
  _define('_I_LOOP_INIT($B_$, $E_$)',
    "$B_$=$E_$-1;"
  ).  
  _define('_I_LOOP_NORM($B_$)',
    "--$B_$;"
  );  
}
else
{
  p.
  _define('_D_LOOP_BODY($B_$, $E_$)',
    "while(++$B_$<$E_$)"
  ).  
  _define('_D_LOOP_INIT($B_$)',
    "$B_$=-1;"
  ).  
  _define('_D_LOOP_NORM($B_$)',
    ""
  ).  
  _define('_I_LOOP_BODY($B_$)',
    "while($B_$--)"
  ).  
  _define('_I_LOOP_INIT($B_$, $E_$)',
    "$B_$=$E_$;"
  ).  
  _define('_I_LOOP_NORM($B_$)',
    ""
  );  
}

p.
_define('_I_LOOP_FULL($B_$, $E_$)',
  '_I_LOOP_INIT($B_$,$E_$) _I_LOOP_BODY($B_$)'
).
_define('_D_LOOP_FULL($B_$, $E_$)',
  '_D_LOOP_INIT($B_$) _D_LOOP_BODY($B_$, $E_$)'
);  

p._define('_I_COPY($SRC, $DEST, $SRC_END, $DEST_END, $I, $J, $LOOP_COND_EQ_INDEXES, $LOOP_COND, $MOD8, $MOD8SUB8)',
$jb._preprocessingTextBegin(function(){
  if($DEST_END === $SRC_END)
  {
    /*
    $J = $DEST_END - 8; 
    
    while($J >= 0)
    //for(; j >= 0; j -= 8, i -= 8)
    {  
      $DEST[$J    ] = $SRC[$J    ];
      $DEST[$J + 1] = $SRC[$J + 1];
      $DEST[$J + 2] = $SRC[$J + 2];
      $DEST[$J + 3] = $SRC[$J + 3];
      $DEST[$J + 4] = $SRC[$J + 4];
      $DEST[$J + 5] = $SRC[$J + 5];
      $DEST[$J + 6] = $SRC[$J + 6];
      $DEST[$J + 7] = $SRC[$J + 7];
      $J -= 8;
    }
    
    switch($J)
    {
      case -1: $DEST[$J + 1] = $SRC[$J + 1]; 
      case -2: $DEST[$J + 2] = $SRC[$J + 2]; 
      case -3: $DEST[$J + 3] = $SRC[$J + 3]; 
      case -4: $DEST[$J + 4] = $SRC[$J + 4]; 
      case -5: $DEST[$J + 5] = $SRC[$J + 5]; 
      case -6: $DEST[$J + 6] = $SRC[$J + 6]; 
      case -7: $DEST[$J + 7] = $SRC[$J + 7]; 
    }
    */
    
    $I = $DEST_END&7; $J = $DEST_END - $I; 
    
    while($LOOP_COND_EQ_INDEXES)
    //for(; j >= 0; j -= 8, i -= 8)
    {  
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
      $DEST[--$J] = $SRC[$J];
    }
    
    switch($MOD8)
    {
      case 7: $DEST[--$I] = $SRC[$I]; 
      case 6: $DEST[--$I] = $SRC[$I]; 
      case 5: $DEST[--$I] = $SRC[$I]; 
      case 4: $DEST[--$I] = $SRC[$I]; 
      case 3: $DEST[--$I] = $SRC[$I]; 
      case 2: $DEST[--$I] = $SRC[$I]; 
      case 1: $DEST[--$I] = $SRC[$I]; 
    }
    
  }
  else
  {
    $J = $DEST_END - 8; $I = $SRC_END - 8; 
    
    while($LOOP_COND)
    //for(; j >= 0; j -= 8, i -= 8)
    {  
      $DEST[$J    ] = $SRC[$I    ];
      $DEST[$J + 1] = $SRC[$I + 1];
      $DEST[$J + 2] = $SRC[$I + 2];
      $DEST[$J + 3] = $SRC[$I + 3];
      $DEST[$J + 4] = $SRC[$I + 4];
      $DEST[$J + 5] = $SRC[$I + 5];
      $DEST[$J + 6] = $SRC[$I + 6];
      $DEST[$J + 7] = $SRC[$I + 7];
      $J -= 8; $I -= 8;
    }
    
    switch($MOD8SUB8)
    {
      case -1: $DEST[$J + 1] = $SRC[$I + 1]; 
      case -2: $DEST[$J + 2] = $SRC[$I + 2]; 
      case -3: $DEST[$J + 3] = $SRC[$I + 3]; 
      case -4: $DEST[$J + 4] = $SRC[$I + 4]; 
      case -5: $DEST[$J + 5] = $SRC[$I + 5]; 
      case -6: $DEST[$J + 6] = $SRC[$I + 6]; 
      case -7: $DEST[$J + 7] = $SRC[$I + 7]; 
    }
  }  

})._preprocessingTextEnd()
);
/*
_I_LOOP_NORM($I);
_I_LOOP_FULL($I)
  $DEST[$I] = $SRC[--$J];
*/

//(new Function('', p._pass(
//$G._log(p._pass(
eval(p._pass(
$jb._preprocessingTextBegin(function(){

/*
Array.prototype._reverseCopy = function()
{
  var i = this.length, a = new Array(i), j = 0;
  var mod8 = i&7;
  
  i -= mod8;
  j += mod8;
  
  while(i)
  {
    a[j    ] = this[i    ];
    a[j + 1] = this[i - 1];
    a[j + 2] = this[i - 2];
    a[j + 3] = this[i - 3];
    a[j + 4] = this[i - 4];
    a[j + 5] = this[i - 5];
    a[j + 6] = this[i - 6];
    a[j + 7] = this[i - 7];
    j += 8; i -= 8;
  }
  
  switch(mod8)
  {
    case 7: a[0] = this[j    ];
    case 6: a[1] = this[j - 1];
    case 5: a[2] = this[j - 2];
    case 4: a[3] = this[j - 3];
    case 3: a[4] = this[j - 4];
    case 2: a[5] = this[j - 5];
    case 1: a[6] = this[j - 6];
  }
  
  return a;  
};

if(!([].splice) || ($w.opera && $w.opera.version() < 11.0))
{
  // opera has 4x slower code .slice realisation that clear js realisation
  Array.prototype.splice = function(begin, howMany)
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
      begin = len;
      howMany = 0;
    }
    
    var ret, i, j, k, aLen = arguments.length, aLenSub2 = aLen - 2;
    
    if(howMany > 0)
    {
      ret = new Array(howMany);
      j = begin + howMany; 
      
      if(aLenSub2 === howMany)
      {
        k = aLen;
        
        _I_LOOP_FULL(i, howMany)
          ret[i] = this[--j], this[j] = arguments[--k];

        return ret;
      }
      else
      {
        _I_LOOP_FULL(i, howMany)
          ret[i] = this[--j];
      }
    }
    else
    {
      ret = new Array();
    }
    
    if(arguments.length > 0)
    {
      j = arguments.length, i = begin + j - 2;
      
      while(--j >= 2)
        this[--i] = arguments[j];
    }
    
    if(howMany > 0)
    {
      i = len, j = len - howMany, k = begin + arguments.length - 2;
      
      while(--j >= k)
        this[j] = this[--i];
    }
    
    return ret;  
  };
}
*/

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
      
    /*
    var a = new Array(len), i;
    
    _I_LOOP_FULL(i, len)
      a[i] = this[--end];
    */
    
    /*
    var a = new Array(len), mod8 = len%8, j = len - mod8, i = end - mod8;
    
    while(j)
    {  
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
      a[--j] = this[--i];
    }
    
    j = len; i = end;
    
    switch(mod8)
    {
      case 7: a[--j] = this[--i]; 
      case 6: a[--j] = this[--i]; 
      case 5: a[--j] = this[--i]; 
      case 4: a[--j] = this[--i]; 
      case 2: a[--j] = this[--i]; 
      case 3: a[--j] = this[--i]; 
      case 1: a[--j] = this[--i]; 
      case 1: a[--j] = this[--i]; 
      case 0: a[--j] = this[--i]; 
    }
    */
    
    var a = new Array(len), j, i;

    _I_COPY(this, a, end, len, i, j, j, j >= 0, i, j);
    
    return a;
  };
}

if($w.opera || ![].concat)
{
  Array.prototype.concat = function()
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
    _D_LOOP_FULL(i, argsLen)
    {
      if(_isArray(b = arguments[i]))
      {
        if((bLen = b.length) > 0)
        {
          j = a.length += bLen;
          
          _I_COPY(b, a, bLen, j, k, l, k, k > 8, l, k);
          /*_I_LOOP_FULL(k, bLen)
            a[--l] = b[k];
          */
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
        a = [], v;
      
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
        _D_LOOP_FULL(i, len)
        {
          if((i in this) && _fn((v = this[i]), i, this))
            a[j++] = v;
        }  
      }
      else
      {
        _D_LOOP_FULL(i, len)
        {
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
      _D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          _fn(VALUE_PASS, i, this);
      }    
    }
    else
    {
      _D_LOOP_FULL(i, len)
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
      _D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && !_fn(VALUE_PASS, i, this))
          return false;
      }    
    }
    else
    {
      _D_LOOP_FULL(i, len)
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
      _D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST)
          a[i] = _fn(VALUE_PASS, i, this);
      }  
    }
    else
    {
      _D_LOOP_FULL(i, len)
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
      _D_LOOP_FULL(i, len)
      {
        if(VALUE_TEST && _fn(VALUE_PASS, i, this))
          return true;
      }    
    }
    else
    {
      _D_LOOP_FULL(i, len)
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
    
    _D_LOOP_NORM(i)
    _D_LOOP_BODY(i, len)
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

    _I_LOOP_NORM(i)
    _I_LOOP_BODY(i)
    {
      if(VALUE_TEST)
        rv = _fn(rv, VALUE_PASS, i, this);
    }
  
    return rv;
  };
}
})._preprocessingTextEnd()
) // _pass
//) // new Function
);
})(new $jb.Preprocessor());

});