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
//_require("$jb/$jb.EventTarget.js").
_require("$jb/$jb.nav.js").
_willDeclared("$jb/exceptions.js").
_completed(function($G, $jb){

if($jb.nav._webkit())
{
  (function($G)
  {
    var _wrap = function(Class)
    {
      var _toString = Class.prototype.toString; 
      
      Class.prototype.toString = function()
      {
        if(this.stack)
          console.error('stack trace\n' + this.stack);

        return _toString.call(this);
      };
    };

    _wrap($G.Error);
  })($G);
}

/*
$G.Error.prototype.valueOf = $G.Error.prototype.toString = function()
{
  return this.message;
};
*/

if($G.DOMException == null)
{
  $G.DOMException=
  {
    INDEX_SIZE_ERR                 : 1,
    DOMSTRING_SIZE_ERR             : 2,
    HIERARCHY_REQUEST_ERR          : 3,
    WRONG_DOCUMENT_ERR             : 4,
    INVALID_CHARACTER_ERR          : 5,
    NO_DATA_ALLOWED_ERR            : 6,
    NO_MODIFICATION_ALLOWED_ERR    : 7,
    NOT_FOUND_ERR                  : 8,
    NOT_SUPPORTED_ERR              : 9,
    INUSE_ATTRIBUTE_ERR            : 10,
// Introduced in DOM Level 2:
    INVALID_STATE_ERR              : 11,
// Introduced in DOM Level 2:
    SYNTAX_ERR                     : 12,
// Introduced in DOM Level 2:
    INVALID_MODIFICATION_ERR       : 13,
// Introduced in DOM Level 2:
    NAMESPACE_ERR                  : 14,
// Introduced in DOM Level 2:
    INVALID_ACCESS_ERR             : 15,
// Introduced in DOM Level 3:
    VALIDATION_ERR                 : 16,
// Introduced in DOM Level 3:
    TYPE_MISMATCH_ERR              : 17
  };
}

var DOMException = $G.DOMException;

DOMException.SECURITY_ERR = 18;
DOMException.NETWORK_ERR = 19;
DOMException.ABORT_ERR = 20;
DOMException.URL_MISMATCH_ERR = 21;
DOMException.QUOTA_EXCEEDED_ERR = 22;
DOMException.NOT_READABLE_ERR	= 24;	// File could not be read.
DOMException.ENCODING_ERR	= 26;	// The file data cannot be accurately represented in a data URL.
DOMException.PARSE_ERR = 81;
DOMException.SERIALIZE_ERR = 82;

$G.DOMError = function(msg, code)
{
  Error.call(this);
  
  this.code = code;
  this.message = msg;
};

$G.DOMError.prototype = new Error();

$G.DOMError.prototype.constructor = $G.DOMError;
$G.DOMError.prototype.name = 'DOMException';

(function()
{
  var _wordReplacer = function(str, firstLetter, elWordPart)
  {
    return firstLetter + elWordPart.toLowerCase();
  };
  var _domWordReplacer = function(str)
  {
    return str.toUpperCase();
  };
  var wordRE  = /_([A-Z])([A-Z]*)/g, domRE = /Dom(.)/g, errorRE = /Err$/; 
  var _convName = function(name)
  {
    return ('_' + name).
      replace(wordRE, _wordReplacer).
      replace(domRE, _domWordReplacer).
      replace(errorRE, 'Error');
  };
  var de = DOMException;
  
  for(var name in de)
  {
    if(de.hasOwnProperty(name))
    {  
      var convName = _convName(name);
      
      if(convName in $G)
        continue;
      
      var Class = $G[convName] = new Function('msg', 'DOMError.call(this, msg, DOMException.' + name + ');');
      
      Class.prototype = new DOMError();
      Class.prototype.constructor = Class;
      Class.prototype.name = convName;
    }
  }
})();

if(!('FileError' in $G))
{
  $G.FileError = function(code)
  {
    this.code = code;
    this.message = '' + code;
  };
  
  $G.FileError.prototype = new Error();
  $G.FileError.prototype.constructor = $G.FileError;
  $G.FileError.prototype.name = 'FileError';
  
  $G.FileError.NOT_FOUND_ERR	= 8; //	File not found.
  $G.FileError.NOT_READABLE_ERR	= 24;	// File could not be read.
  $G.FileError.SECURITY_ERR	= 18;	// The file could not be accessed for security reasons.
  $G.FileError.ABORT_ERR	= 20;	// The file operation was aborted, probably due to a call to the FileReader abort() method.
  $G.FileError.ENCODING_ERR	= 26;	// The file data cannot be accurately represented in a data URL.
}

/*
if(!('FileException' in $G))
{
  $G.FileException = function(code)
  {
    this.code = code;
  };
  
  $G.FileException.NOT_FOUND_ERR	= 8; //	File not found.
  $G.FileException.NOT_READABLE_ERR	= 24;	// File could not be read.
  $G.FileException.SECURITY_ERR	= 18;	// The file could not be accessed for security reasons.
  $G.FileException.ABORT_ERR	= 20;	// The file operation was aborted, probably due to a call to the FileReader abort() method.
  $G.FileException.ENCODING_ERR	= 26;	// The file data cannot be accurately represented in a data URL.
}
*/

// use QUOTA_EXCEEDED_ERR instread
/*
window.BufferOverflowError=function(msg)
{
  Error.call(this);
  
  this.name = "BufferOverflowError";
  this.message=msg;
};
*/

});