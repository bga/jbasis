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
//_require("$jb/libconsole.js").

_willDeclared("$jb/$G.Number.js").
_completed(function($G, $jb){

var Math = $G.Math;

$jb._rand = Math.random;

$jb._rand2 = function(a, b)
{
  return (b - a)*Math.random() + a;
};

$jb._lerp = function(a,b,coef)
{
  return (b - a)*coef + a;
};

// opera has bug with (-1) >>> 0 === -1. patch it
if($jb.nav._opera())
{
  (function()
  {
    var re = /\s(.*?)\s*=(.*?)>>>\s*0/g;
    
    Number._fixupIntToUIntBug = function(str)
    {
      return str.replace(re, 'if(($1 = $2) < 0) $1 = 4294967295;');
    };
  })();  
}
else
{
  Number._fixupIntToUIntBug = function(str)
  {
    return str;
  }
}

(function()
{
  var digitsL;
  
  var _find = function(value)
  {
    var digits = digitsL, b = 0, e = digits.length, c;
    
    if(value > digits[3].num)
    {
      do
      {
        c=(b + e) >> 1;
        
        if(digits[c].num > value)
          e = c;
        else
          b = c;
      }
      while((e - b) > 4);
    }
    
    while(b < e && digits[b].num <= value)
      ++b;
    
    if(b > 0)
      --b;
    
    return b;
  }

  Number.prototype._toStringAsRoman = function(digits)
  {
    if(digits == null)
      digits = arguments.callee.sets.upperCase;
    
    digitsL = digits;
    
    var n = this,
      str = '',
      d;
    
    while(n)
    {
      d = digits[_find(n)];
      str += d.char;
      n -= d.num;
    }
    
    return str;
  };
})();  

Number.prototype._toStringAsRoman.sets=
{
  upperCase:
  [
    {num: 1, char: "I"},
    {num: 4, char: "IV"},
    {num: 5, char: "V"},
    {num: 9, char: "IX"},
    {num: 10, char: "X"},
    {num: 40, char: "XL"},
    {num: 50, char: "L"},
    {num: 90, char: "XC"},
    {num: 100, char: "C"},
    {num: 400, char: "CD"},
    {num: 500, char: "D"},
    {num: 900, char: "CM"},
    {num: 1000, char: "M"}
  ],
  lowerCase:
  [
    {num: 1, char: "i"},
    {num: 4, char: "iv"},
    {num: 5, char: "v"},
    {num: 9, char: "ix"},
    {num: 10, char: "x"},
    {num: 40, char: "xl"},
    {num: 50, char: "l"},
    {num: 90, char: "xc"},
    {num: 100, char: "c"},
    {num: 400, char: "cd"},
    {num: 500, char: "d"},
    {num: 900, char: "cm"},
    {num: 1000, char: "m"}
  ]
};

});