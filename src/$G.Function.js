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
_completed(function(){

/**
  @fn exec function with 'this'='that' and 'arguments'='args'
  @param that 'this'
  @param args array of arguments || 'arguments' || null
  @return result of execution
*/
Function.prototype._apply=function(that,args)
{
  return (args==null) ? this.call(that) : this.apply(that,args);
};

/**
  @fn get header of function. 'function name (a,b,c)'
  @param code function code. Optional
  @return header string
*/
Function.prototype._header=function(code)
{
  if(code==null)
    code=Object(""+this);
  
  return code.substring(0,code.indexOf(")")+1);
};

/**
  @fn get function name. 'function name (a,b,c)'
  @param code function code. Optional
  @return name string
*/
Function.prototype._name=function(code)
{
  if(code==null)
    code=Object(""+this);
  
  code=code.substring(code.indexOf("function")+8,code.indexOf("("));
  
  return code;//._trim();
};

/**
  @fn get function argument names string. 'a,b,c' in 'function name (a,b,c)'
  @param code function code. Optional
  @return array of argument names
*/
Function.prototype._argNamesString=function(code)
{
  if(code==null)
    code=Object(""+this);
  
  return code.substring(code.indexOf("(")+1,code.indexOf(")"));
};

/**
  @fn get function argument names. ['a','b','c'] in 'function name (a,b,c)'
  @param code function code. Optional
  @return array of argument names
*/
Function.prototype._argNames=function(code)
{
  code=this._argNamesString(code);
  
  return code.length>0 ? code.split(",") : [];
};

/**
  @fn get function body. 'function name (a,b,c) {body}'
  @param code function code. Optional
  @return body string
*/
Function.prototype._body=function(code)
{
  if(code==null)
    code=Object(""+this);
  
  return code.substring(code.indexOf("{"));
};

/**
  @fn template function. do nothing. return 'this'
  @return 'this'
*/
$jb._this=function()
{
  return this;
};

/**
  @fn template function. do nothing. return first argument
  @return 'arguments[0]'
*/
$jb._self=function(v)
{
  return v;
};

/**
  @fn template function. do nothing. return null
  @return null
*/
$jb._null=function()
{
}

/**
  @fn template function. do nothing. return 'true'
  @return 'true'
*/
$jb._true=function()
{
  return true;
}

/**
  @fn template function. do nothing. return 'false'
  @return 'false'
*/
$jb._false=function()
{
  return false;
}

/**
  @fn template function. do nothing. return '""'
  @return '""'
*/
$jb._emptyString=function()
{
  return "";
};

(function()
{
  var _f=function _self()
  {
    Function.canFastSelf=(_f==_self);
  };
  
  _f();
})();

/**
  @fn create copyable function that return 'c'
  @return function. 'function.c' is 'c'
*/
$jb._fConstC=function(c)
{
  var __fRet=arguments.callee.__fRet;
  var _ret=__fRet();
  
  _ret.c=c;
  _ret.jbCopyRule=2;
  _ret._copySelf=__fRet;
  
  return _ret;
};

if(Function.canFastSelf)
{
  $jb._fConstC.__fRet=function()
  {
    return function _self()
    {
      return _self.c;
    };
  };
}
else
{
  $jb._fConstC.__fRet=function()
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
$jb._fConst=function(c)
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
Function.prototype._fBindC=function(that,args)
{
  var __fRet=arguments.callee.__fRet;
  var _ret=__fRet();

  _ret._func=this;
  _ret.args=args;
  _ret.that=that;
  _ret.prototype=this.prototype;
  _ret.jbCopyRule=2;
  _ret._copySelf=__fRet;

  return _ret;
};

if(Function.canFastSelf)
{
  Function.prototype._fBindC.__fRet=function()
  {
    return function _self()
    {
      return _self._func.apply(_self.that || this, _self.args || arguments);
    };
  };
}
else
{
  Function.prototype._fBindC.__fRet=function()
  {
    return function()
    {
      var _self=arguments.callee;
      
      return _self._func.apply(_self.that || this, _self.args || arguments);
    };
  };
}

/**
  @fn create function that return target function exec with 'this'='that' || 'function.this' and 'arguments'='args' || 'function.arguments'
  @param that 'this' for target function or null
  @param args array of arguments or null
  @return function 
*/
$G.Function.prototype._fBind=function(that,args)
{
  var _func=this;
  var _ret=function()
  {
    return _func._apply(that || this, args || arguments);
  };
  
  _ret.prototype=_func.prototype;
  
  return _ret;
};

/**
  @fn create copyable function that create new class instance by target constructor
  @return function. 'function._func' is target function 
*/
Function.prototype._fNewC=function()
{
  var __fRet=arguments.callee.__fRet;
  var _ret=__fRet();
  
  _ret._func=this;
  _ret.jbCopyRule=2;
  _ret._copySelf=__fRet;
  
  return _ret;
};
if(Function.canFastSelf)
{
  Function.prototype._fNewC.__fRet=function()
  {
    return function _self()
    {
      return new _self._func();
    };
  };
}
else
{
  Function.prototype._fNewC.__fRet=function()
  {
    return function()
    {
      return new arguments.callee._func();
    };
  };
}

/**
  @fn create function that create new class instance by target constructor
  @return function 
*/
Function.prototype._fNew=function()
{
  var _func=this;
  
  return function()
  {
    return new _func();
  };
};

/**
  @fn create copyable function that wrap target function by '_wrapper' eg '_wrapper'(target function())
  @return function. 'function._func' is target function, 'function._wrapper' is '_wrapper' 
*/
Function.prototype._fWrapC=function(_wrapper)
{
  var __fRet=arguments.callee.__fRet;
  var _ret=__fRet();
  
  _ret._wrapper=_wrapper;
  _ret.prototype=_wrapper.prototype;
  _ret._func=this;
  _ret.jbCopyRule=2;
  _ret._copySelf=__fRet;

  return _ret;
};
if(Function.canFastSelf)
{
  Function.prototype._fWrapC.__fRet=function()
  {
    return function _self()
    {
      return _self._wrapper(_self._func.apply(this,arguments));
    };
  };
}
else
{
  Function.prototype._fWrapC.__fRet=function()
  {
    return function()
    {
      var _self=arguments.callee;
      
      return _self._wrapper(_self._func.apply(this,arguments));
    };
  };
}

/**
  @fn create function that wrap target function by '_wrapper' eg '_wrapper'(target function())
  @return function. 'function._func' is target function, 'function._wrapper' is '_wrapper' 
*/
Function.prototype._fWrap=function(_wrapper)
{
  var _func=this;
  
  var _ret=function()
  {
    return _wrapper(_func.apply(this,arguments));
  };
  
  _ret.prototype=_wrapper.prototype;
  
  return _ret;
};

/**
  @fn create object by array of classes eg 'new classes[2](new classes[1](new classes[0]))'
  @param classes array of constructors
  @return result object 
*/
$jb._new=function(classes)
{
  var len=classes.length;
  
  if(len==0)
    return null;
  if(len==1)
    return new classes[0]();
    
  var i=len;
  var obj=new classes[--i]();
  
  while(i--)
    obj=new classes[i]($jb._fConst(obj));
  
  return obj;
};

/**
  @fn (defer, delay, exec after) target function execution after 'time' ms but after current function execution
  @param time time to delay. Optional. Default 0
  @return numeric id for pass to $w.clearTimeout to prevent execution
*/
Function.prototype._defer=
Function.prototype._delay=
Function.prototype._after=
function(time)
{
  return $w.setTimeout(this,time || 0);
};

/**
  @fn start exec target function each 'time' ms
  @param time time to delay between execution.
  @return numeric id for pass to $w.clearInterval to prevent period execution
*/
Function.prototype._period=function(time)
{
  return $w.setInterval(this,time);
};

/**
  @fn eval 'str' as function with 'this'='that' and 'arguments'='args'
  @param str string to eval
  @param that 'this' for eval
  @param args 'arguments' for eval
  @return result of eval
*/
$jb._funcEval=function(str,that,args)
{
  return (new Function("",str))._apply(that,args);
};

/**
  @fn eval 'str' as function with 'this'='that' and 'arguments'='args' safe (in try catch block) 
  @param str string to eval
  @param that 'this' for eval
  @param args 'arguments' for eval
  @return result of eval
*/
$jb._funcEvalSafe=function(str,that,args)
{
  if(str=="")
    return null;
    
  var ret=null;
  
  try
  {
    ret=(new Function("",str))._apply(that,args);
  }
  catch(err)
  {
    //($jb._error || $G.alert)(err.message);
    ret=null;
  }
  
  return ret;
};

/**
  @fn function constructor
  @param str string to eval
  @return function that eval 'str'
*/
$jb._fEval=function(str)
{
  return function()
  {
    return $G.eval(str);
  };
};

});