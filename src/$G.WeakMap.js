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
*/

/*
  Strong implementation must check that key is object, 
  hide weakMapN_ from enumeration, make it externally readonly and non deletable(Object.defineProperty, if presents),
  but its bad for performance.
*/

$jb.Loader._scope().
_require("$jb/$G.Object.js").
_require("$jb/$G.Array.js").
_require("$jb/$G.Function.js").
//_require("$jb/ext/number.js").
_willDeclared("$jb/libcopy.js").
_completed(function($G, $jb){

// TODO add native $G.WeakMap support when es6 will out  
//$jb._optimize

$jb._defClass(
  {
    name: '$jb.WeakMap',
    
    nextStoreKeyId_: 0,
    
    _constructor: function()
    {
      this.storeKeyName_ = 'weakMap' + this.nextStoreKeyId_++ + '_';
    },
    
    _set: function(key, value)
    {
      key[this.storeKeyName_] = value;
    },
    
    _get: function(key)
    {
      return key[this.storeKeyName_];
    },
    
    _delete: function(key)
    {
      return delete key[this.storeKeyName_];
    },
    
    _has: function(key)
    {
      return this.storeKeyName_ in key;
    }
  }
); // class $jb.WeakMap

});  