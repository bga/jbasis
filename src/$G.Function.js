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
_willDeclared("$jb/$G.Function.js").
_completed(function($G, $jb){

var Function = $G.Function, 
  /** @alias */
  FunctionProto = Function.prototype,
  eval = $G.eval, setTimeout = $G.setTimeout, setInterval = $G.setInterval;

/**
  @fn exec function with 'this'='that' and 'arguments'='args'
  @param that 'this'
  @param args array of arguments || 'arguments' || null
  @return result of execution
*/
FunctionProto._apply=function(that,args)
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
    code = "" + this;
  
  return code.substring(0, code.indexOf(")") + 1);
};

/**
  @fn get function name. 'function name (a,b,c)'
  @param code function code. Optional
  @return name string
*/
FunctionProto._name = function(code)
{
  if(code == null)
    code = "" + this;
  
  code = code.substring(code.indexOf("function") + 8, code.indexOf("("));
  
  return code;//._trim();
};

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
  
  return (code.length !== 0) ? code.split(",") : new Array();
};

/**
  @fn get function body. 'function name (a, b, c) {body}'
  @param code function code. Optional
  @return body string
*/
FunctionProto._body = function(code)
{
  if(code == null)
    code=""+this;
  
  return code.substring(code.indexOf("{"));
};

FunctionProto._isNative = function()
{
  return ('' + this).indexOf('[native code]') > -1;
};

/**
  @fn template function. do nothing. return 'this'
  @return 'this'
*/
$jb._this = function()
{
  return this;
};

/**
  @fn template function. do nothing. return first argument
  @return 'arguments[0]'
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
  @fn template function. do nothing. return 'false'
  @return 'false'
*/
$jb._false = function()
{
  return false;
};

/**
  @fn template function. do nothing. return '""'
  @return '""'
*/
$jb._emptyString = function()
{
  return "";
};

(function()
{
  var _fn = function _self()
  {
    Function.canFastSelf = (_fn === _self);
  };
  
  _fn();
})();

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

if(Function.canFastSelf)
{
  $jb._fConstC.__fRet = function()
  {
    return function _self()
    {
      return _self.c;
    };
  };
}
else
{
  $jb._fConstC.__fRet = function()
  {
    return function()
    {
      return arguments.callee.c;
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

if(Function.canFastSelf)
{
  FunctionProto._fBindC.__fRet = function()
  {
    return function _self()
    {
      return _self._fn.apply(_self.that || this, _self.args || arguments);
    };
  };
}
else
{
  FunctionProto._fBindC.__fRet = function()
  {
    return function()
    {
      var _self = arguments.callee;
      
      return _self._fn.apply(_self.that || this, _self.args || arguments);
    };
  };
}

/**
  @fn create function that return target function exec with 'this'='that' || 'function.this' and 'arguments'='args' || 'function.arguments'
  @param that 'this' for target function or null
  @param args array of arguments or null
  @return function 
*/
if(FunctionProto.bind && FunctionProto.bind._isNative())
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
    return function()
    {
      return new arguments.callee._fn();
    };
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
    return function()
    {
      var _self = arguments.callee;
      
      return _self._wrapper((arguments.length > 0) ? _self._fn.apply(this, arguments) : _self._fn.call(this));
    };
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
  @fn create object by array of classes eg 'new classes[2](new classes[1](new classes[0]))'
  @param classes array of constructors
  @return result object 
*/
$jb._new = function(classes)
{
  var len = classes.length;
  
  if(len === 0)
    return null;
  
  if(len === 1)
    return new classes[0]();
    
  var i = len;
  var obj = new classes[--i]();
  
  while(i--)
    obj = new classes[i]($jb._fConst(obj));
  
  return obj;
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
  return (new Function("", str))._apply(that, args);
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
    ret=(new Function("", str))._apply(that, args);
  }
  catch(err)
  {
    //($jb._error || $G.alert)(err.message);
    ret = null;
  }
  
  return ret;
};

/**
  @fn function constructor
  @param str string to eval
  @return function that eval 'str'
*/
$jb._fEval = function(str)
{
  return function()
  {
    return eval(str);
  };
};

});