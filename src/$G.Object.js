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

(function()
{

  // http://stackoverflow.com/questions/85992/how-do-i-enumerate-the-properties-of-a-javascript-object
  Object.dontEnumKeys = (function()
  {
    var v = {};
    var shadowedKeys = 
    [
      //"constructor",
      "toString",
      "valueOf",
      "toLocaleString",
      //"prototype",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "hasOwnProperty",
      "length",
      "unique"   
    ];
    var i, j;
    var _indexOf = Array.prototype.indexOf || function(v)
    {
      var len = this.length, i = -1;

      while(++i < len && this[i] !== v)
        ;
        
      return (i == len) ? -1 : i; 
    };
    
    i = shadowedKeys.length; while(i--)
      v[shadowedKeys[i]] = 1;
      
    for(i in v)
    {
      if((j = _indexOf.call(shadowedKeys, i)) > -1)
        shadowedKeys.splice(j, 1);
    }
    
    return shadowedKeys;
  })();

  var _module =  function($G, $jb)
  {
    var Object = $G.Object, TypeError = $G.TypeError;

    /*@alias*/
    var ObjectProto = Object.prototype;

    if(!('getPrototypeOf' in Object))
    {
      if("__proto__" in {})
      {
        Object.getPrototypeOf = function(v)
        {
          if(typeof(v) != 'object' || v == null)
            throw new TypeError();
          
          return v.__proto__;
        };  
      }
      else
      {
        Object.getPrototypeOf = function(v)
        {
          if(typeof(v) != 'object' || v == null)
            throw new TypeError();
          
          return v.constructor.prototype;
        };
      }
    }

    if(!('getOwnPropertyNames' in Object))
    {
      Object.getOwnPropertyNames = function(v)
      {
        if(typeof(v) != "object" || v == null)
          throw new TypeError();
        
        var keys = [], i = 0, key;
        
        for(key in v)
        {
          if(v.hasOwnProperty(key))
            keys[i++] = key;
        }
        
        return keys;
      };  
    }

    if(!('keys' in Object))
    {
      Object.keys = function(v)
      {
        if(typeof(v) != "object" || v == null)
          throw new TypeError();
        
        var keys = [], i = 0, key;
        
        for(key in v)
        {
          if(v.hasOwnProperty(key))
            keys[i++] = key;
        }
        
        return keys;
      };
    }

    ObjectProto._overwriteFrom = function(from)
    {
      if(from == null || typeof(from) != 'object')
        throw TypeError();
        
      for(var i in from)
      {
        if(from.hasOwnProperty(i))
          this[i] = from[i];
      }
      
      return this;
    };
    
    ObjectProto._extendFrom = function(from)
    {
      if(from == null || typeof(from) != 'object')
        throw TypeError();
        
      var i;
      
      if(Object.getPrototypeOf(from) === Object.getPrototypeOf(this))
      {
        for(i in from)
        {
          if(!(i in this))
            this[i] = from[i];
        };
      }
      else
      {
        for(i in from)
        {
          if(from.hasOwnProperty(i) && !(i in this))
            this[i] = from[i];
        };
      }
      
      return this;
    };

    /*
    if(!('defineProperty' in Object))
    {
      (function()
      {
        var code = '';
        
        if(__defineGetter__ in {})
          code += 'if(desc.get != null) v.__defineGetter__(name, desc.get);'
        else
          code += 'if(desc.get != null) throw "getters unsupported";'
        
        if(__defineSetter__ in {})
          code += 'if(desc.set != null) v.__defineSetter__(name, desc.get);'
        else
          code += 'if(desc.set != null) throw "setters unsupported";'
    
        code += 'if(desc.value != null) v[name] = desc.value;';
        code += 'if(desc.enumerable != null) throw "enumerable unsupported";';
      })();
      
      var _readonlyVar = function(v, name, value)
      {
        v.__defineGetter__(name, function(){ return value; });
        v.__defineSetter__(name, function(){ throw new SyntaxError(name + ' is readonly'); });
      };
      
      //__lookupGetter__
      Object.defineProperty = function(v, name, desc)
      {
        if(v == null || typeof(v) != 'object')
          throw TypeError();
        
        if(desc == null || typeof(desc) != 'object')
          throw TypeError();

        if(desc.enumerable === false)
          throw "enumerable unsupported";
          
        if(v.jb_ == null)
          v.jb_ = {};
        if(v.jb_.propDescMap == null)
          v.jb_.propDescMap = {};

        var propDesc = v.jb_.propDescMap || (v.jb_.propDescMap = {});
        propDesc = propDesc[name] || (propDesc[name] = {});
        v.jb_.propDescMap[name] = desc;    
        //if(desc.value)
      };
    }
    */
    if(!('create' in Object))
    {
      if('__proto__' in {})
      {
        Object.create = function(pr, initObj)
        {
          if(typeof(pr) != 'object' || pr == null)
            throw new TypeError();

          if(initObj != null)
            throw "Full implementation impossible in ecma3";
            
          return {__proto__: pr};
        };
      }
      else
      {
        Object.create = function(pr, initObj)
        {
          if(typeof(pr) != 'object' || pr == null)
            throw new TypeError();
          
          if(initObj != null)
            throw "Full implementation impossible in ecma3";

          if(pr === ObjectProto)
          {  
            return  {};
          }
          else
          {
            var _constructor = function(){};
        
            _constructor.prototype = pr;
            
            var obj = new _constructor();
            obj.constructor = _constructor; // ie not set 'constructor' property if 'prototype' of function replaced
            
            return obj;  
          }
        };
      }  
    }
    
    if('__proto__' in {})
    {
      Object._create = function(pr, initObj)
      {
        if(typeof(pr) != 'object' || pr == null)
          throw new TypeError();

        if(initObj == null)
          return {__proto__: pr};
          
        initObj.__proto__ = pr;
        
        return initObj;
      };
    }
    else
    {
      Object._create = function(pr, initObj)
      {
        if(typeof(pr) != 'object' || pr == null)
          throw new TypeError();
        
        var obj;
        
        if(pr === ObjectProto)
        {  
          return initObj || {};
        }
        else
        {
          var _constructor = function(){};
      
          _constructor.prototype = pr;
          
          obj = new _constructor();
          obj.constructor = _constructor; // ie not set 'constructor' property if 'prototype' of function replaced
        
          if(initObj != null)
            obj._overwriteFrom(initObj);
            
          return obj;  
        }

        return obj;
      };
    }  
    /*
    if(!('propertyIsEnumerable' in {}))
    {
      ObjectProto.propertyIsEnumerable = function(name)
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
    */
    // https://twitter.com/bga_/status/11006228335
    // new String('10').propertyIsEnumerable('0') === false , but key '0' is in enumeration.
    if('10'.propertyIsEnumerable('0') === false && 
      (function(v)
      {
        for(var i in v)
        {  
          if(i == '0')
            return true;
        }
        
        return false;
      })('10')
    )
    {
      (function()
      {
        var _oPropertyIsEnumerable = String.prototype.propertyIsEnumerable;
        var re = /^\d+$/;
        
        String.prototype.propertyIsEnumerable = function(name)
        {
          if(re.test(name))
            return true;
          
          return _oPropertyIsEnumerable.call(this);
        };
      })();
    }

    ObjectProto._filterExtra = function(i, obj)
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

    if(ObjectProto._filterExtra.propertyIsEnumerable('prototype'))
    {  
      Function.prototype._filterExtra = function(i, obj)
      {
        return obj.hasOwnProperty(i) && i !== 'prototype';
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
    ObjectProto._rawCopyFrom = function(src, _filter)
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
    ObjectProto._rawCopyFromAsObject = ObjectProto._rawCopyFrom;

    // invert target key=>value pairs to value=>key and set it to destObj or newly created object
    //
    // @param destObj optional. dest object or newly created object
    // @param _filter optional.  
    ObjectProto._invert = function(destObj, _filter)
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
    ObjectProto._invertAsObject = ObjectProto._invert;

    ObjectProto._findAsObject = function(value, _filter)
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

    if(Object.__count__ != null)
    {
      ObjectProto._filterExtra._length = 
      Number.prototype._filterExtra._length = 
      Boolean.prototype._filterExtra._length = 
      Function.prototype._filterExtra._length = 
      RegExp.prototype._filterExtra._length = 
      function()
      {
        return this.__count__;
      };

      ObjectProto._filterExtra._isEmpty = 
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

    ObjectProto._length = null;

    ObjectProto._length = function(_filter)
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
    ObjectProto._lengthAsObject = ObjectProto._length;

    ObjectProto._isEmpty = function(_filter)
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
    ObjectProto._isEmptyAsObject = ObjectProto._isEmpty;
  }; // _module

  if(Object.dontEnumKeys.length)
  {
    (function()
    {
      var re = /for\(\s*(?:var\s+)?([a-zA-Z_$][a-zA-Z_$0-9]*)\s+in\s+([a-zA-Z_$][a-zA-Z_$0-9]*)\s*\)[ ]*([\n\r][^\{]*)\{([\s\S]*?)\3\}/g;
      
      var _replacer = function(all, key, v, ind, body)
      {
        var extraCode = '';
        
        var 
          //i = body.indexOf(key), 
          //bodyFirstPart = body.slice(0, i) + '(' + key + ' = \'', 
          bodyFirstPart = key + ' = \'', 
          //bodyLastPart = '\'' + body.slice(i + key.length);
          bodyLastPart = '\';\n' + body;
        
        var dontEnumKeys = Object.dontEnumKeys, i = dontEnumKeys.length;
        
        while(i--)
          extraCode += bodyFirstPart + dontEnumKeys[i] + bodyLastPart;
        
        return all + '\n' + extraCode;
      }

      Object._fixDontEnumBug = function(code)
      {
        return code.replace(
          re, _replacer
        )
      };
    })();
    
    (function()
    {
      var code = "" + _module;
      
      code = code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
      code = Object._fixDontEnumBug(code);
      //$G._log(code);
      
      _module = new Function('$G, $jb', code);
    })();
  }
  
  $jb.Loader._scope().
  //_require("$jb/$jb.nav.js").
  _willDeclared("$jb/$G.Object.js").
  _completed(_module);

})();