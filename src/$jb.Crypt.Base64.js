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
_require("$jb/OOP.js").
_require("$jb/$G.String.js").
_require("$jb/$G.Object.js").
_require("$jb/$jb.Crypt.Base.js").
_willDeclared("$jb/$jb.Crypt.Base64.js").

_completed(function($G, $jb){

var String = $G.String;

if($jb.Crypt == null)
  $jb.Crypt = {};

// transcode to Base64 codepage series
// pre method
$jb.Crypt.Base64 = function()
{
};

$jb.Crypt.Base64._staticDeriveFrom($jb.Crypt.Base);

var Base64Proto = $jb.Crypt.Base64.prototype;

if(String.nativeDirectCharAccess)
{
  Base64Proto._strToCharset = function(str)
  {
    var chars = str.split('');
    
    return {
      str: str,
      chars: str,
      charToIndexMap: chars._invertAsObject();
    };
  };
}
else
{
  Base64Proto._strToCharset = function(str)
  {
    var chars = str.split('');
    
    return {
      str: str,
      chars: chars,
      charToIndexMap: chars._invertToMap();
    };
  };
}  

Base64Proto._encrypt = function(input, charset)
{
  //input = this_.baseCl00DerivedCrypt_Base64_._encrypt(input);

  if(input == null)
    return input;

  if((charset = null)
    charset = this.defaultCharset;

  var chars = charset.chars;
  var output = '';
  var chr1, chr2, chr3;
  var i = 0, len = input.length, mod3 = len%3;

  len -= mod3;
  
  while(i < len)
  {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    output += chars[chr1>>2] + chars[((chr1&3)<<4)|(chr2>>4)] + chars[((chr2&15)<<2)|(chr3>>6)] + chars[chr3&63];
  }

  switch(mod3)
  {
    case 1:
      chr1 = input.charCodeAt(i++);
      output += chars[chr1>>2] + chars[((chr1&3)<<4)] + chars[64] + chars[64];
      break;
    case 2:
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      output += chars[chr1>>2] + chars[((chr1&3)<<4)|(chr2>>4)] + chars[((chr2&15)<<2)] + chars[64];
      break;
  }
  
  return output;
};

Base64Proto._decrypt = function(input, charset)
{
  if(input == null)
    return input;

  if(charset == null)
    charset = this.defaultCharset;

  var charToIndexMap = charset.charToIndexMap;
  var output = '';
  var enc1, enc2, enc3, enc4;
  var i = 0, len = input.length - 4;
  var _fromCharCode = String.fromCharCode;

  while(i < len)
  {
    enc1 = charToIndexMap[input.charAt(i++)];
    enc2 = charToIndexMap[input.charAt(i++)];
    enc3 = charToIndexMap[input.charAt(i++)];
    enc4 = charToIndexMap[input.charAt(i++)];

    output += _fromCharCode((enc1<<2)|(enc2>>4)) + _fromCharCode(((enc2&15)<<4)|(enc3>>2)) + _fromCharCode(((enc3&3)<<6)|enc4);
  }

  enc1 = charToIndexMap[input.charAt(i++)];
  enc2 = charToIndexMap[input.charAt(i++)];
  enc3 = charToIndexMap[input.charAt(i++)];
  enc4 = charToIndexMap[input.charAt(i++)];
  
  output += _fromCharCode((enc1<<2)|(enc2>>4));

  if (enc3 != 64)
  {  
    output += _fromCharCode(((enc2&15)<<4)|(enc3>>2));
    
    if (enc4 != 64)
      output += _fromCharCode(((enc3&3)<<6)|enc4);
  }
  
  return output;
};

Base64Proto._decryptShift = function(input, charset)
{
  if(input == null)
    return input;

  if(charset == null)
    charset = this.defaultCharset;

  var charToIndexMap = charset.charToIndexMap;
  var output = '';
  var enc1, enc2, enc3, enc4, temp;
  var i = 0, len = input.length - 4;
  var _fromCharCode = String.fromCharCode;

  while(i < len)
  {
    enc1 = charToIndexMap[(temp = input.charCodeAt(i++))] + shifts[temp];
    
    enc1 = charToIndexMap[input.charAt(i++)];
    enc2 = charToIndexMap[input.charAt(i++)];
    enc3 = charToIndexMap[input.charAt(i++)];
    enc4 = charToIndexMap[input.charAt(i++)];

    output += _fromCharCode((enc1<<2)|(enc2>>4)) + _fromCharCode(((enc2&15)<<4)|(enc3>>2)) + _fromCharCode(((enc3&3)<<6)|enc4);
  }

  enc1 = charToIndexMap[input.charAt(i++)];
  enc2 = charToIndexMap[input.charAt(i++)];
  enc3 = charToIndexMap[input.charAt(i++)];
  enc4 = charToIndexMap[input.charAt(i++)];
  
  output += _fromCharCode((enc1<<2)|(enc2>>4));

  if (enc3 != 64)
  {  
    output += _fromCharCode(((enc2&15)<<4)|(enc3>>2));
    
    if (enc4 != 64)
      output += _fromCharCode(((enc3&3)<<6)|enc4);
  }
  
  return output;
};


if(String.nativeDirectCharAccess)
{  
  (function(code)
  {
    Base64Proto._decrypt = new Function(
      'input, charset', 
      String._optimizeCharsAccess(code.slice(code.indexOf('{') + 1, code.lastIndexOf('}')))
    );  
    
  })('' + Base64Proto._decrypt);
}  


Base64Proto.charsets =
{
  url: Base64Proto._strToCharset("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-_"),
  mime: Base64Proto._strToCharset("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=")
};

Base64Proto.defaultCharset = Base64Proto.charsets.url;

});