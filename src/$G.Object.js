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
  
  make ecma5 Object features available to use
  add filters
  and _invert _length _isEmpty
*/

$jb.Loader._scope().
//_require("$jb/$jb.nav.js").
_willDeclared("$jb/$G.Object.js").
_completed(function(){

if(!Object.getPrototypeOf)
{
  if("__proto__" in {})
  {
    Object.getPrototypeOf = function(v)
    {
      if(typeof(v) !== "object" || v == null)
        throw new TypeError();
      
      return v.__proto__;
    };  
  }
  else
  {
    Object.getPrototypeOf = function(v)
    {
      if(typeof(v) !== "object" || v == null)
        throw new TypeError();
      
      return v.constructor.prototype;
    };
  }
}

if(typeof(Object.defineProperties) !== "function")
{
  Object.defineProperties = function(to, from)
  {
    //15.2.3.7 If Type(O) is not Object throw a TypeError exception. 
    if(to == null || typeof(to) !== 'object')
      throw TypeError();
      
    var type = typeof(from);
    
    //15.2.3.7 Let props be ToObject(Properties). 
    if(type === 'object' || type === 'function')
    {
      for(var i in from)
      {
        if(from.hasOwnProperty(i))
          to[i] = from[i];
      }
    }
    
    return to;
  };
}

if(typeof(Object.create) !== "function")
{
  if("__proto__" in {})
  {
    Object.create = function(pr, initObj)
    {
      if(typeof(pr) !== 'object')
        throw new TypeError();

      var obj = new Object();
        
      obj.__proto__ = pr;
      
      if(initObj!=null)
        Object.defineProperties(obj, initObj)
      
      return obj;
    };
  }
  else
  {
    Object.create = function(pr, initObj)
    {
      if(typeof(pr) !== 'object')
        throw new TypeError();
      
      var obj;
      
      if(pr !== Object.prototype)
      {  
        var _constructor = function(){};
    
        _constructor.prototype = pr;
        
        obj = new _constructor();
        obj.constructor = _constructor; // ie not set 'constructor' property if 'prototype' of function replaced
      }
      else
      {
        obj = new Object();
      }
      
      if(initObj != null)
        Object.defineProperties(obj, initObj)

      return obj;
    };
  }  
}

if(!("propertyIsEnumerable" in {}))
{
  Object.prototype.propertyIsEnumerable = function(name)
  {
    if(!this.hasOwnProperty(name))
      return false;
      
    var i;
    
    for(i in this)
    {
      if(i === name)
        return true;
    }

    return false;
  };
}

// https://twitter.com/bga_/status/11006228335
// new String('10').propertyIsEnumerable('0') === false , but key '0' is in enumeration.
if('10'.propertyIsEnumerable('0') === false && 
  (function(v)
  {
    for(var i in v)
    {  
      if(i === '0')
        return true;
    }
    
    return false;
  })('10')
)
{
  (function()
  {
    var _oPropertyIsEnumerable = String.prototype.propertyIsEnumerable;
    var re = new RegExp(/^\d+$/);
    
    String.prototype.propertyIsEnumerable = function(name)
    {
      if(re.test(name))
        return true;
      
      return _oPropertyIsEnumerable.call(this);
    };
  })();
}

Object.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i);
};
Number.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i);
};
Boolean.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i);
};
RegExp.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i);
};
Date.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i);
};
Array.prototype._filterExtra = function(i, obj)
{
  return obj.hasOwnProperty(i) && !(+i >= 0); // not correct by realy fast!
};

if(Object.prototype._filterExtra.propertyIsEnumerable("prototype"))
{  
  Function.prototype._filterExtra = function(i, obj)
  {
    return obj.hasOwnProperty(i) && i !== "prototype";
  };
}
else
{
  Function.prototype._filterExtra = function(i, obj)
  {
    return obj.hasOwnProperty(i);
  };
}

if(Object("1").propertyIsEnumerable("0"))
{
  String.prototype._filterExtra = function(i, obj)
  {
    return obj.hasOwnProperty(i) && !(+i >= 0); // not correct by realy fast!
  };
}
else
{
  String.prototype._filterExtra = function(i, obj)
  {
    return obj.hasOwnProperty(i);
  };
}

// copy member by member "obj" to result
Object.prototype._rawCopyFrom = function(src, _filter)
{
  if(src == null)
    return null;

  if(_filter == null)
    _filter = src._filterExtra;
  
  var i = null;
  
  for(i in src)
  {
    if(_filter(i, src))
      this[i] = src[i];
  }

  return this;
};
Object.prototype._rawCopyFromAsObject = Object.prototype._rawCopyFrom;

// invert target key=>value pairs to value=>key and set it to destObj or newly created object
//
// @param destObj optional. dest object or newly created object
// @param _filter optional.  
Object.prototype._invert = function(destObj, _filter)
{
  var i = null;
  
  if(destObj == null)
    destObj = {};
  
  if(_filter == null)
    _filter = this._filterExtra;

  for(i in this)
  {
    if(_filter(i, this))
      destObj[this[i]] = i;
  }
  
  return destObj;
};
Object.prototype._invertAsObject = Object.prototype._invert;

Object.prototype._find = function(value, _filter)
{
  if(filter)
    _filter = this._filterExtra;

  var i = null;
  
  for(i in this)
  {
    if(_filter(i, this) && this[i] === value)
      return i;
  }
  
  return null;
};
Object.prototype._findAsObject = Object.prototype._find;

if(Object.__count__ != null)
{
  Object.prototype._filterExtra._length = 
  Number.prototype._filterExtra._length = 
  Boolean.prototype._filterExtra._length = 
  Function.prototype._filterExtra._length = 
  RegExp.prototype._filterExtra._length = 
  function()
  {
    return this.__count__;
  };

  Object.prototype._filterExtra._isEmpty = 
  Number.prototype._filterExtra._isEmpty = 
  Boolean.prototype._filterExtra._isEmpty = 
  Function.prototype._filterExtra._isEmpty = 
  RegExp.prototype._filterExtra._isEmpty = 
  function()
  {
    return this.__count__ === 0;
  };
  
  String.prototype._filterExtra._length = function()
  {
    return this.__count__ - this.length;
  };
  String.prototype._filterExtra._isEmpty = function()
  {
    return this.__count__ - this.length === 0;
  };
  
  Array.prototype._filterExtra._length = function()
  {
    if(this.__count__ === 0)
      return 0;
      
    if(this.length === 0 && this.__count__ > 0)
      return this.__count__;
      
    return null;
  };
  Array.prototype._filterExtra._isEmpty = function()
  {
    if(this.__count__ === 0)
      return true;
      
    if(this.length === 0 && this.__count__ > 0)
      return false;
      
    return null;
  };
}

Object.prototype._length = null;

Object.prototype._length = function(_filter)
{
  if(_filter == null)
    _filter = this._filterExtra;

  var ret;
  
  if(_filter.hasOwnProperty('_length') && (ret = _filter._length.call(this)) != null)
    return ret;
    
  var i, n = 0;
  
  for(i in this)
  {
    if(_filter(i, this))
      ++n;
  }
  
  return n;
};
Object.prototype._lengthAsObject = Object.prototype._length;

Object.prototype._isEmpty = function(_filter)
{
  if(_filter == null)
    _filter = this._filterExtra;

  var ret;
  
  if(_filter.hasOwnProperty('_isEmpty') && (ret = _filter._isEmpty.call(this)) != null)
    return ret;
  
  var i;
  
  for(i in this)
  {
    if(_filter(i, this))
      return false;
  }
  
  return true;
};
Object.prototype._isEmptyAsObject = Object.prototype._isEmpty;

});