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
  
  provodes 2 functions for for copyng and cloning
*/

$jb.Loader._scope().
_require("$jb/$G.Object.js").
_require("$jb/$G.Array.js").
_require("$jb/$G.Function.js").
//_require("$jb/ext/number.js").
_willDeclared("$jb/libcopy.js").
_completed(function($G, $jb){

//var Object = $G.Object;

Object.prototype._copyableByRef = function()
{
  this._copy = this._clone = $jb._this;
};

$jb._copy = function(v)
{
  switch(typeof(v))
  {
    case 'object':
    case 'function':
      if(typeof(v._copy) == 'function')
        return v._copy();
    default:
      return v;
  }
};

$jb._clone = function(v)
{
  switch(typeof(v))
  {
    case 'object':
    case 'function':
      if(typeof(v._clone) == 'function')
        return v._clone();
    default:
      return v;
  }
};

String.prototype._copy = String.prototype._clone =
Number.prototype._copy = Number.prototype._clone =
Boolean.prototype._copy = Boolean.prototype._clone =
Function.prototype._copy = Function.prototype._clone =
$G._copy = $G._clone = 
$jb._copy = $jb._clone = 
function()
{
  return this;
};

RegExp.prototype._copy = RegExp.prototype._clone =
function()
{
  return new RegExp(this);
};

Date.prototype._copy = Date.prototype._clone =
function()
{
  return new Date(this);
};
    
Array.prototype._copy = $jb.Optimize._optimize(
  {
    name: 'Array#_copy',
    defaultMathodName: 'loop',
    methodMap:
    {
      'slice': function()
      {
        return this._slice(0);
      },
      'concat': function()
      {
        return this._concat();
      },
      'loop': function()
      {
        var i = this.length >>> 0;
        var a = new Array(i);
        
        while(i--)
          a[i] = this[i];
          
        return a;  
      }
    },
    unitMap:
    {
      'length': 
      {
        _get: function()
        {
          return this.length;
        },
        _gen: function(n)
        {
          var a = new Array(n);
          
          while(i--)
            a[i] = 1;
          
          return {'this': a};
        }
      }  
    }
  }
);  

Array.prototype._clone = function()
{
  var i = this.length >>> 0
    , a = new Array(len)
    , v
  ;
  
  while(i--)
  {
    switch(typeof(v = this[i]))
    {
      case 'object':
      case 'function':
        if(typeof(v._clone) == 'function')
          a[i] = v._clone();
        break;
      default:
        a[i] = v;
        break;
    }
  }  
    
  return a;  
};

Object.prototype._copy = function()
{
  var c = Object.create(Object.getPrototypeOf(this));
  
  c._extendFrom(this);
      
  return c;
};

Object.prototype._clone = $jb._patch(
  function()
  {
    var a = Object.create(Object.getPrototypeOf(this));
    var v;
    
    for(var i in this)
    {
      if(this.hasOwnProperty(i))
      {
        switch(typeof(v = this[i]))
        {
          case 'object':
          case 'function':
            if(typeof(v._clone) == 'function')
              a[i] = v._clone();
            break;
          default:
            a[i] = v;
            break;
        }
      }
    }
        
    return a;
  },
  [Object._fixDontEnumBug]
);  

});