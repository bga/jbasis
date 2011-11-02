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
  
  contains '$G.Function' useful functions and most used function templates
*/

$jb.Loader._scope().
//_require('$jb/$jb.Deploy.js').
_willDeclared("$jb/$G.Function.js").
_completed(function($G, $jb){

var Function = $G.Function, 
  /** @alias */
  FunctionProto = Function.prototype,
  setTimeout = $G.setTimeout, setInterval = $G.setInterval;

$jb._defConst('es:support:Function#apply', (typeof(FunctionProto.apply) == 'function'))
$jb._defConst(
  'es:defaultThis', 
  (function()
  { 
    return (this == null) ? 'null' : '$G'; 
  })()
);
  
$jb._defClass(
{
  name: '$jb.FunctionFactory',
  _constructor: function()
  {
  
  },
  _create: function(argString, body)
  {
    return new Function(argString, body);
  }
};  
  
$jb._defClass(
{
  name: '$jb.ClosuredFunctionFactory',
  _constructor: function(varMap)
  {
    this.varMap_;
    
    if(varMap)
      this._setVarMap(varMap);
  },
  _getVarMap: function()
  {
    return this.varMap_;
  },
  _setVarMap: function(varMap)
  {
    var argString = ''
      , argValues = []
      , i = 0
    ;  
    
    for(var varName in varMap)
    {
      if(varMap.hasOwnProperty(varName))
      {
        argString += varName + ',';
        argValues[i++] = varMap[varName];
      }
    }
    
    this.varMap_ = varMap;
    this.argString_ = argString;
    this.argValues_ = argValues;
  },
  _updateVarMap: function()
  {
    if(this.varMap_)
      this._setVarMap(this.varMap_);
  },
  _create: function(argString, body)
  {
    if(this.argValues_ && this.argValues_.length)
    {
      return (new Function(this.argString_, 'return function(' + argNames +  '){' + body + '};')).apply($G, this.argValues_);
    }
    else
    {
      return new Function(argString, body);
    }  
  }
};  

// wsh and ie6- hasnt Function#apply
if(!$jb._const('es:support:Function#apply'))
{
  (function()
  {
    var fnTml = $jb._fnCode(function()
    {
      if(that != /*#<*/ defaultThis /*#>*/ /*#eval*/ /*## $jb._const('es:defaultThis') */ /*#evalend*/)
      {
        switch(args.length)
        {
          case 0: return this.call(that);
          case 1: return this.call(that, args[0]);
          case 2: return this.call(that, args[0], args[1]);
          case 3: return this.call(that, args[0], args[1], args[2]);
          case 4: return this.call(that, args[0], args[1], args[2], args[3]);
          case 5: return this.call(that, args[0], args[1], args[2], args[3], args[4]);
          default:
            PATCH_WITH_CALL();
            var t = 'case '.concat(args.length, ': return this.call(that, ');
            
            var i = -1, len  = args.length; while(++i < len)
            {
              t += 'args[' + i + '],';
            }
            
            t = t.slice(0, -1) + ');';

            var fnCode = '1,' + Function.prototype.apply;
            
            fnCode = fnCode.replace('return this.call(that);', 'return this.call(that);\n' + t);

            //console.log(fnCode);
            
            Function.prototype.apply = eval(fnCode);
            
            return this.apply(that, args);
        }
      }
      else
      {
        switch(args.length)
        {
          case 0: return this();
          case 1: return this(args[0]);
          case 2: return this(args[0], args[1]);
          case 3: return this(args[0], args[1], args[2]);
          case 4: return this(args[0], args[1], args[2], args[3]);
          case 5: return this(args[0], args[1], args[2], args[3], args[4]);
          default:
            PATCH_WITHOUT_CALL();
            var t = 'case '.concat(args.length, ': return this(');
            
            var i = -1, len  = args.length; while(++i < len)
            {
              t += 'args[' + i + '],';
            }
            
            t = t.slice(0, -1) + ');';
            
            var fnCode = '1,' + Function.prototype.apply;

            //console.log(fnCode);
            
            fnCode = fnCode.replace('return this();', 'return this();\n' + t);
            
            Function.prototype.apply = eval(fnCode);
            
            return this.apply(that, args);
        }
      }
    };
    FunctionProto.apply = function(that, args)
    {
    };
  
  /*#<*/
  Function.prototype.apply = eval(
    ('1,' + Function.prototype.apply).
      replace('defaultThis', $jb._const('es:defaultThis'))
  );
  /*#>*/
}  

/**
  @fn exec function with 'this'='that' and 'arguments'='args'
  @param that 'this'
  @param args array of arguments || 'arguments' || null
  @return result of execution
*/
FunctionProto._apply = function(that, args)
{
  return (args == null || args.length === 0) ? this.call(that) : this.apply(that, args);
};

/**
  @fn get header of function. 'function name (a,b,c)'
  @param code function code. Optional
  @return header string
*/
FunctionProto._header = function(code)
{
  if(code == null)
    code = '' + this;
  
  return code.substring(0, code.indexOf(')') + 1);
};

$jb._defConst(
  'es:support:Function#name',
  (function _fn(){}).name === '_fn'
);

/**
  @fn get function name. 'function name (a,b,c)'
  @param code function code. Optional
  @return name string
*/
FunctionProto._name = $jb._const('es:support:Function#name')
  ? function(code)
  {
    return this.name
  }
  : function(code)
  {
    if(code == null)
      code = '' + this;
    
    code = code.substring(code.indexOf('function') + 8, code.indexOf('('));
    
    return code;//._trim();
  }
;

/**
  @fn get function argument names string. 'a,b,c' in 'function name (a,b,c)'
  @param code function code. Optional
  @return array of argument names
*/
FunctionProto._argNamesString = function(code)
{
  if(code == null)
    code = "" + this;
  
  return code.substring(code.indexOf("(") + 1, code.indexOf(")"));
};

/**
  @fn get function argument names. ['a','b','c'] in 'function name (a,b,c)'
  @param code function code. Optional
  @return array of argument names
*/
FunctionProto._argNames = function(code)
{
  code = this._argNamesString(code);
  
  return (code.length !== 0) ? code.split(",") : [];
};

/**
  @fn get function body. 'function name (a, b, c) {body}'
  @param code function code. Optional
  @return body string
*/
FunctionProto._body = function(code)
{
  if(code == null)
    code = String(this);
  
  return code.substring(code.indexOf("{"));
};

FunctionProto._isNative = function()
{
  return ('' + this).indexOf('[native code]') > -1;
};

/**
  @fn template function. do nothing. return <this>
  @return <this>
*/
$jb._this = function()
{
  return this;
};

/**
  @fn template function. do nothing. return first argument
  @return <arguments[0]>
*/
$jb._self = function(v)
{
  return v;
};

/**
  @fn template function. do nothing. return null
  @return null
*/
$jb._null = function()
{
};

/**
  @fn template function. do nothing. return 'true'
  @return 'true'
*/
$jb._true = function()
{
  return true;
};

/**
  @fn template function. do nothing. return <false>
  @return <false>
*/
$jb._false = function()
{
  return false;
};

/**
  @fn template function. do nothing. return <''>
  @return <''>
*/
$jb._emptyString = function()
{
  return "";
};

$jb._defConst(
  'es:bug:wrongInternalSelfInNamedFunction', 
  (function()
  {
    var _fn = function _self()
    {
      return (_fn !== _self);
    };
    
    return _fn();
  })()
)

/**
  @fn create copyable function that return 'c'
  @return function. 'function.c' is 'c'
*/
$jb._fConstC = function(c)
{
  var __fRet = arguments.callee.__fRet,
    _ret = __fRet();
  
  _ret.c = c;
  _ret.jbCopyRule = 2;
  _ret._copySelf = __fRet;
  
  return _ret;
};

if($jb._const('es:bug:wrongInternalSelfInNamedFunction'))
{
  $jb._fConstC.__fRet = function()
  {
    var _self = function()
    {
      return _self.c;
    };
    
    return _self;
  };
}
else
{
  $jb._fConstC.__fRet = function()
  {
    return function _self()
    {
      return _self.c;
    };
  };
}

/**
  @fn create function that return 'c'
  @return function.
*/
$jb._fConst = function(c)
{
  return function()
  {
    return c;
  };
};

/**
  @fn create copyable function that return target function exec with 'this'='that' || 'function.this' and 'arguments'='args' || 'function.arguments'
  @param that 'this' for target function or null
  @param args array of arguments or null
  @return function. 'function.that' is 'that', 'function.args' is 'args' 
*/
FunctionProto._fBindC = function(that, args)
{
  var __fRet = arguments.callee.__fRet,
    _ret = __fRet();

  _ret._fn = this;
  _ret.args = args;
  _ret.that = that;
  _ret.prototype = this.prototype;
  _ret.jbCopyRule = 2;
  _ret._copySelf = __fRet;

  return _ret;
};

if($jb._const('es:bug:wrongInternalSelfInNamedFunction'))
{
  FunctionProto._fBindC.__fRet = function()
  {
    var _self = function()
    {
      return _self._fn.apply(_self.that || this, _self.args || arguments);
    };
    
    return _self;
  };
}
else
{
  FunctionProto._fBindC.__fRet = function()
  {
    return function _self()
    {
      return _self._fn.apply(_self.that || this, _self.args || arguments);
    };
  };
}

$jb._defConst('es:support:Function#bind', typeof(Function.prototype.bind) == 'function' && Function.prototype.bind._isNative());

/**
  @fn create function that return target function exec with 'this'='that' || 'function.this' and 'arguments'='args' || 'function.arguments'
  @param that 'this' for target function or null
  @param args array of arguments or null
  @return function 
*/
if($jb._const('es:support:Function#bind'))
{
  (function(){
    var _bind  = FunctionProto.bind;
    
    FunctionProto._fBind = function(that, args)
    {
      var _fn = this, _ret;
      
      if(that != null)
      {
        _ret = (args != null) 
          ? function(){ return _fn.apply(that, args); }
          : _bind.call(_fn, that);
      }
      else
      {
        _ret = (args != null) 
          ? function(){ return _fn.apply(this, args); }
          : function(){ return (arguments.length > 0) ? _fn.apply(this, arguments) : _fn.call(this); };
      }
      
      _ret.prototype = _fn.prototype;
      
      return _ret;
    };
  })();  
}
else
{
  FunctionProto._fBind = function(that, args)
  {
    var _fn = this, _ret;
    
    if(that != null)
    {
      _ret = (args != null) 
        ? function(){ return _fn.apply(that, args); }
        : function(){ return (arguments.length > 0) ? _fn.apply(that, arguments) : _fn.call(that); };
    }
    else
    {
      _ret = (args != null) 
        ? function(){ return _fn.apply(this, args); }
        : function(){ return (arguments.length > 0) ? _fn.apply(this, arguments) : _fn.call(this); };
    }

    _ret.prototype = _fn.prototype;
    
    return _ret;
  };
}

/**
  @fn create copyable function that create new class instance by target constructor
  @return function. 'function._fn' is target function 
*/
FunctionProto._fNewC = function()
{
  var __fRet = arguments.callee.__fRet,
    _ret = __fRet();
  
  _ret._fn = this;
  _ret.jbCopyRule = 2;
  _ret._copySelf = __fRet;
  
  return _ret;
};
if(Function.canFastSelf)
{
  FunctionProto._fNewC.__fRet = function()
  {
    return function _self()
    {
      return new _self._fn();
    };
  };
}
else
{
  FunctionProto._fNewC.__fRet = function()
  {
    var _self = function()
    {
      return new _self._fn();
    };
    
    return _self; 
  };
}

/**
  @fn create function that create new class instance by target constructor
  @return function 
*/
FunctionProto._fNew = function()
{
  var _fn = this;
  
  return function()
  {
    return new _fn();
  };
};

/**
  @fn create copyable function that wrap target function by '_wrapper' eg '_wrapper'(target function())
  @return function. 'function._fn' is target function, 'function._wrapper' is '_wrapper' 
*/
FunctionProto._fWrapC = function(_wrapper)
{
  var __fRet = arguments.callee.__fRet,
    _ret = __fRet();
  
  _ret._wrapper = _wrapper;
  _ret.prototype = _wrapper.prototype;
  _ret._fn = this;
  _ret.jbCopyRule = 2;
  _ret._copySelf = __fRet;

  return _ret;
};
if(Function.canFastSelf)
{
  FunctionProto._fWrapC.__fRet = function()
  {
    return function _self()
    {
      return _self._wrapper((arguments.length > 0) ? _self._fn.apply(this, arguments) : _self._fn.call(this));
    };
  };
}
else
{
  FunctionProto._fWrapC.__fRet = function()
  {
    var _self = function()
    {
      return _self._wrapper((arguments.length > 0) ? _self._fn.apply(this, arguments) : _self._fn.call(this));
    };
    
    return _self;
  };
}

/**
  @fn create function that wrap target function by '_wrapper' eg '_wrapper'(target function())
  @return function. 'function._fn' is target function, 'function._wrapper' is '_wrapper' 
*/
FunctionProto._fWrap = function(_wrapper)
{
  var _fn = this,
    _ret = function()
    {
      return _wrapper((arguments.length > 0) ? _fn.apply(this, arguments) : _fn.call(this));
    };
  
  _ret.prototype = _wrapper.prototype;
  
  return _ret;
};

/**
  @fn (defer, delay, exec after) target function execution after 'time' ms but after current function execution
  @param time time to delay. Optional. Default 0
  @return numeric id for pass to $w.clearTimeout to prevent execution
*/
FunctionProto._defer = 
FunctionProto._delay = 
FunctionProto._after = 
function(time)
{
  return setTimeout(this, time || 0);
};

/**
  @fn start exec target function each 'time' ms
  @param time time to delay between execution.
  @return numeric id for pass to $w.clearInterval to prevent period execution
*/
FunctionProto._period = function(time)
{
  return setInterval(this, time);
};

/**
  @fn eval 'str' as function with 'this'='that' and 'arguments'='args'
  @param str string to eval
  @param that 'this' for eval
  @param args 'arguments' for eval
  @return result of eval
*/
$jb._funcEval = function(str, that, args)
{
  return (new Function('', str))._apply(that, args);
};

/**
  @fn eval 'str' as function with 'this'='that' and 'arguments'='args' safe (in try catch block) 
  @param str string to eval
  @param that 'this' for eval
  @param args 'arguments' for eval
  @return result of eval
*/
$jb._funcEvalSafe = function(str, that, args)
{
  if(str === "")
    return null;
    
  var ret = null;
  
  try
  {
    ret=(new Function('', str))._apply(that, args);
  }
  catch(err)
  {
    //($jb._error || $G.alert)(err.message);
    ret = null;
  }
  
  return ret;
};

/**
  @fn hide <this> source code and return 'function(){ [native code] }' instead.
  @return {Function} this
*/  
Function.prototype._makeLikeNative = function()
{
  if(Object.defineProperty)
  {
    var blackLabelProp = 
    {
      enumerable: false,
      configurable: false,
      writable: false,
      value: true 
    };

    Function.prototype._makeLikeNative = function()
    {
      Object.defineProperty(this, 'jbIsSourceHided_', blackLabelProp);
    };

    var _oldFnToString = Function.prototype.toString;
    
    Object.defineProperty(Function.prototype, 'toString',
      {
        configurable: false,
        writable: false,
        value: function()
        {
          if(this.jbIsSourceHided_ === true)
            return 'function () { [native code] }';
            
          return _oldFnToString.call(this);  
        }
      }
    );

    Function.prototype.toString._makeLikeNative();
  }
  else
  {
    var _hider = function()
    {
      return 'function () { [native code] }';
    }; 

    _hider.toString = _hider;

    Function.prototype._makeLikeNative = function()
    {
      // also dont remember that IE do not enum valueOf and toString properties :P
      this.toString = _hider;
    };
  }
  
  Function.prototype._makeLikeNative._makeLikeNative();
  
  this._makeLikeNative();
  
  return this;
};

/**
  @fn call function with <this> = <that> and <arguments> matched from <argMap> by names
  @param that {Any} <this> for function call
  @param argMap {Object(
    {String} argument name ->
    {Any} argument value
  )}
  @example
    var _fn = function(a, b, c)
    {
      console.log('a = ', a, 'b = ', b, 'ñ = ', c); 
    };

    _fn._namedApply(null, {b: 1}); // a =  undefined b =  1 ñ =  undefined
    _fn._namedApply(null, {b: 1, a: 0}); // a =  0 b =  1 ñ =  undefined
    _fn._namedApply.call(1, 1, {}); // TypeError: first argument must be function
    _fn._namedApply(null, 1); // TypeError: 3rd argument must not null
    _fn._namedApply(null, {b: 1, a: 0, d: 3}); // SyntaxError: function hasnt argument "d"
  
    var _fn2 = function(){};
    _fn2._namedApply(null, {b: 1, a: 0, d: 3}); // SyntaxError: function hasnt named arguments
  @return result of function call
*/
Function.prototype._namedApply = function(that, argMap)
{
  var _fn = this;
  
  if(typeof(_fn) != 'function')
    throw new TypeError('<this> must be function');

  if(argMap == null)
    throw new TypeError('3rd argument must not null');
    
  var argToPosMap = _fn.jbArgToPosMap_;
  
  if(argToPosMap == null)
  {
    var fnCode = '' + _fn;
    
    var argString = fnCode.slice(fnCode.indexOf('(') + 1, fnCode.lastIndexOf(')', fnCode.indexOf('{'))). // get arguments string
      replace(/\/\*[\s\S]*?\*\//g, ''). // and strip comments
      replace(/\/\/[\s\S]*?\n/g, '').
      /*#if $jb._const('es:support:String#trim') */
      /*## trim() */
      /*#else*/
      replace(/^\s+|\s+$/g, '')
      /*#endif*/
      ;
      
    argToPosMap = _fn.jbArgToPosMap_ = {};

    if(argString)
    {
      var argNames = argString.split(/\s*,\s*/);
      
      var i = -1, len = argNames.length; while(++i < len)
        argToPosMap[argNames[i]] = i;
    }
    else
    {
      _fn.jbHasntArguments_ = true;
    }
  }
  
  if(_fn.jbHasntArguments_)
  {
    /*#if $jb._const('es:support:Object#__count__') */
    /*## if(argMap.__count__) throw new SyntaxError('function hasnt named arguments'); */
    /*#else*/
    for(var name in argMap)
    {
      if(argMap.hasOwnProperty(name))
        throw new SyntaxError('function hasnt named arguments')
    }
    /*#endif*/
  }
  else
  {
    var argValues = [];
    
    for(var name in argMap)
    {
      if(argMap.hasOwnProperty(name))
      {  
        var pos = argToPosMap[name];

        if(pos == null)
          throw new SyntaxError('function hasnt argument "' + name + '"')
        
        argValues[pos] = argMap[name];
      }
    }
    
    return _fn.apply(that, argValues);
  }
};

// known issues:
// 1) not cross frame (_fn.toString === Function.prototype.toString)  
$jb._isFunction = function(_fn)
{
  return typeof(_fn) == 'function' || 
    (
      typeof(_fn) != 'string' && 
      !(_fn instanceof String) &&
      String(_fn).replace(/^\s+/, '').slice(0, 8) == 'function' &&
      (
        !('toString' in _fn) ||
        _fn.toString === Function.prototype.toString
      )
    );
};

});
