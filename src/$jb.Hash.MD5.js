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
//_require("$jb/dom.js").
_require("$jb/OOP.js").
_require("$jb/$jb.Hash.Base.js").
_require("$jb/$jb.Preprocessor.js").
_willDeclared("$jb/$jb.Hash.MD5.js").

_completed(function($G, $jb){

if($jb.Hash == null)
  $jb.Hash = {};

$jb.Hash.MD5 = function()
{
  this.a;
  this.b;
  this.c;
  this.d;
};

$jb.Hash.MD5.prototype._init = function()
{
  this.a = 0x67452301;
  this.b = 0xefcdab89;
  this.c = 0x98badcfe;
  this.d = 0x10325476;

  return this;
};

$temp.p = (new $jb.Preprocessor()).
_define('_ADD($X, $Y)', function(x, y){ return (x && y) ? x + '+' + y : x || y; }, ['dynamic']).
_define('_SUB($X, $Y)', function(x, y){ return x - y; }, ['static']).
_define(
  '_VARS_DECLARE($COUNT, $PREFIX)', 
  function(count, prefix)
  {
    var i = +count, t = 'var ';
    
    prefix = prefix.slice(1, -1);
    
    while(--i) 
      t += prefix + i + ', ';

    return t + prefix + '0';
  }, ['static']
).
_define(
  '_VARS_FILL($COUNT, $PREFIX, $FROM)', 
  function(count, prefix, from)
  {
    var i = 16, t = '';
    
    prefix = prefix.slice(1, -1);
    from = from.slice(1, -1);

    while(--i) 
      t += prefix + i + ' = ' + from + '[i + ' + i + '], ';

    return t + prefix + '0 = ' + from + '[i]';
  }, ['static']
).

_define('_F($X, $Y, $Z)', 
$jb._preprocessingTextBegin(function(){
  ( (($X) & ($Y)) | ((~($X)) & ($Z)) )
})._preprocessingTextEnd(), ['static']
).
_define('_G($X, $Y, $Z)', 
$jb._preprocessingTextBegin(function(){
  ( (($X) & ($Z)) | ((~($Z)) & ($Y)) )
})._preprocessingTextEnd(), ['static']
).
_define('_H($X, $Y, $Z)', 
$jb._preprocessingTextBegin(function(){
  ( ($X) ^ ($Y) ^ ($Z) )
})._preprocessingTextEnd(), ['static']
).
_define('_I($X, $Y, $Z)', 
$jb._preprocessingTextBegin(function(){
  ( ($Y) ^ ( ($X) | ~($Z) ) )
})._preprocessingTextEnd(), ['static']
).

_define('_SUBROUND(_$F, $W, $X, $Y, $Z, $TI, $S)',
$jb._preprocessingTextBegin(function(){
  $W = 0|($X + (((t = 0|($W + _$F($X, $Y, $Z) + $TI)) << $S)|(t >>> _SUB(32, $S))))
})._preprocessingTextEnd(), ['static']
).
_define('_ROUND($D0, $D1, $D2, $D3, $D4, $D5, $D6, $D7, $D8, $D9, $D10, $D11, $D12, $D13, $D14, $D15)',
$jb._preprocessingTextBegin(function(){
  _SUBROUND(_F, a, b, c, d, _ADD($D0, 0xd76aa478), 7);
  _SUBROUND(_F, d, a, b, c, _ADD($D1, 0xe8c7b756), 12);
  _SUBROUND(_F, c, d, a, b, _ADD($D2, 0x242070db), 17);
  _SUBROUND(_F, b, c, d, a, _ADD($D3, 0xc1bdceee), 22);
  _SUBROUND(_F, a, b, c, d, _ADD($D4, 0xf57c0faf), 7);
  _SUBROUND(_F, d, a, b, c, _ADD($D5, 0x4787c62a), 12);
  _SUBROUND(_F, c, d, a, b, _ADD($D6, 0xa8304613), 17);
  _SUBROUND(_F, b, c, d, a, _ADD($D7, 0xfd469501), 22);
  _SUBROUND(_F, a, b, c, d, _ADD($D8, 0x698098d8), 7);
  _SUBROUND(_F, d, a, b, c, _ADD($D9, 0x8b44f7af), 12);
  _SUBROUND(_F, c, d, a, b, _ADD($D10, 0xffff5bb1), 17);
  _SUBROUND(_F, b, c, d, a, _ADD($D11, 0x895cd7be), 22);
  _SUBROUND(_F, a, b, c, d, _ADD($D12, 0x6b901122), 7);
  _SUBROUND(_F, d, a, b, c, _ADD($D13, 0xfd987193), 12);
  _SUBROUND(_F, c, d, a, b, _ADD($D14, 0xa679438e), 17);
  _SUBROUND(_F, b, c, d, a, _ADD($D15, 0x49b40821), 22);
  _SUBROUND(_G, a, b, c, d, _ADD($D1, 0xf61e2562), 5);
  _SUBROUND(_G, d, a, b, c, _ADD($D6, 0xc040b340), 9);
  _SUBROUND(_G, c, d, a, b, _ADD($D11, 0x265e5a51), 14);
  _SUBROUND(_G, b, c, d, a, _ADD($D0, 0xe9b6c7aa), 20);
  _SUBROUND(_G, a, b, c, d, _ADD($D5, 0xd62f105d), 5);
  _SUBROUND(_G, d, a, b, c, _ADD($D10, 0x02441453), 9);
  _SUBROUND(_G, c, d, a, b, _ADD($D15, 0xd8a1e681), 14);
  _SUBROUND(_G, b, c, d, a, _ADD($D4, 0xe7d3fbc8), 20);
  _SUBROUND(_G, a, b, c, d, _ADD($D9, 0x21e1cde6), 5);
  _SUBROUND(_G, d, a, b, c, _ADD($D14, 0xc33707d6), 9);
  _SUBROUND(_G, c, d, a, b, _ADD($D3, 0xf4d50d87), 14);
  _SUBROUND(_G, b, c, d, a, _ADD($D8, 0x455a14ed), 20);
  _SUBROUND(_G, a, b, c, d, _ADD($D13, 0xa9e3e905), 5);
  _SUBROUND(_G, d, a, b, c, _ADD($D2, 0xfcefa3f8), 9);
  _SUBROUND(_G, c, d, a, b, _ADD($D7, 0x676f02d9), 14);
  _SUBROUND(_G, b, c, d, a, _ADD($D12, 0x8d2a4c8a), 20);
  _SUBROUND(_H, a, b, c, d, _ADD($D5, 0xfffa3942), 4);
  _SUBROUND(_H, d, a, b, c, _ADD($D8, 0x8771f681), 11);
  _SUBROUND(_H, c, d, a, b, _ADD($D11, 0x6d9d6122), 16);
  _SUBROUND(_H, b, c, d, a, _ADD($D14, 0xfde5380c), 23);
  _SUBROUND(_H, a, b, c, d, _ADD($D1, 0xa4beea44), 4);
  _SUBROUND(_H, d, a, b, c, _ADD($D4, 0x4bdecfa9), 11);
  _SUBROUND(_H, c, d, a, b, _ADD($D7, 0xf6bb4b60), 16);
  _SUBROUND(_H, b, c, d, a, _ADD($D10, 0xbebfbc70), 23);
  _SUBROUND(_H, a, b, c, d, _ADD($D13, 0x289b7ec6), 4);
  _SUBROUND(_H, d, a, b, c, _ADD($D0, 0xeaa127fa), 11);
  _SUBROUND(_H, c, d, a, b, _ADD($D3, 0xd4ef3085), 16);
  _SUBROUND(_H, b, c, d, a, _ADD($D6, 0x04881d05), 23);
  _SUBROUND(_H, a, b, c, d, _ADD($D9, 0xd9d4d039), 4);
  _SUBROUND(_H, d, a, b, c, _ADD($D12, 0xe6db99e5), 11);
  _SUBROUND(_H, c, d, a, b, _ADD($D15, 0x1fa27cf8), 16);
  _SUBROUND(_H, b, c, d, a, _ADD($D2, 0xc4ac5665), 23);
  _SUBROUND(_I, a, b, c, d, _ADD($D0, 0xf4292244), 6);
  _SUBROUND(_I, d, a, b, c, _ADD($D7, 0x432aff97), 10);
  _SUBROUND(_I, c, d, a, b, _ADD($D14, 0xab9423a7), 15);
  _SUBROUND(_I, b, c, d, a, _ADD($D5, 0xfc93a039), 21);
  _SUBROUND(_I, a, b, c, d, _ADD($D12, 0x655b59c3), 6);
  _SUBROUND(_I, d, a, b, c, _ADD($D3, 0x8f0ccc92), 10);
  _SUBROUND(_I, c, d, a, b, _ADD($D10, 0xffeff47d), 15);
  _SUBROUND(_I, b, c, d, a, _ADD($D1, 0x85845dd1), 21);
  _SUBROUND(_I, a, b, c, d, _ADD($D8, 0x6fa87e4f), 6);
  _SUBROUND(_I, d, a, b, c, _ADD($D15, 0xfe2ce6e0), 10);
  _SUBROUND(_I, c, d, a, b, _ADD($D6, 0xa3014314), 15);
  _SUBROUND(_I, b, c, d, a, _ADD($D13, 0x4e0811a1), 21);
  _SUBROUND(_I, a, b, c, d, _ADD($D4, 0xf7537e82), 6);
  _SUBROUND(_I, d, a, b, c, _ADD($D11, 0xbd3af235), 10);
  _SUBROUND(_I, c, d, a, b, _ADD($D2, 0x2ad7d2bb), 15);
  _SUBROUND(_I, b, c, d, a, _ADD($D9, 0xeb86d391), 21);
})._preprocessingTextEnd(), ['dynamic'] 
);

$jb.Hash.MD5.prototype._update = new Function('data',
$temp.p._pass(
$jb._preprocessingTextBegin(function(){
  var a = this.a, b = this.b, c = this.c, d = this.d;
  _VARS_DECLARE(16, 'd');
  
  var i = -16, len = data.length; while((i += 16) < len)
  {
    _VARS_FILL(16, 'd', 'data');
    _ROUND(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15);
  }
  
  this.a += a;
  this.b += b;
  this.c += c;
  this.d += d;
  
  return this;
})._preprocessingTextEnd(), ['static', 'dynamic']
) // _pass
); // new Function

$jb.Hash.MD5.prototype._final = function()
{
  return null;
};

});

