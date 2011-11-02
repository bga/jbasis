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
_require('$jb/$G.Array.js'). // for Array.prototype.indexOf
_willDeclared('$jb/$jb.FunctionQueue.js').
_completed(function($G, $jb){

/**
  @class allow you manage array of functions (add, delete, has), call functions (with or without break on false return), also some extra functionality like <$jb.FunctionQueue#_isEmpty> or <$jb.FunctionQueue#_fApply>
*/
$jb.FunctionQueue = function()
{
  /** @var {Array(Function)} array of functions */
  this.queue_ = [];
  
  /** @var {Array(Function)} shadow of <$jb.FunctionQueue#queue_> during dispatch. Allow safe add or remove functions during dispatch without keeping dispatching queue original */ 
  this.queueDispatchShadow_ = null;
  
  /**
    @fn delete <_func> from queue
    @param _func {Function} function to delete
    @return {Boolean} true if <_func> suuccessfilly deleted else false
  */  
  this._detach = this.__detach;
};  

/** @alias */
var FunctionQueueProto = $jb.FunctionQueue.prototype;

/**
  @fn add <_func> to queue
  @param _func {Function} function to add
  @return {Boolean} true if <_func> suuccessfilly added else false
*/  
FunctionQueueProto._attach = function(_func)
{
  if(_func == null)
    return false;
  
  (this.queueDispatchShadow_ || this.queue_).push(_func);
  
  return true;
};

/**
  @fn add <_func> to queue if <_func> not added before
  @param _func {Function} function to add
  @return {Boolean} true if <_func> successfilly added else false
*/  
FunctionQueueProto._reattach = function(_func)
{
  if(_func == null)
    return false;
  
  var q = this.queueDispatchShadow_ || this.queue_;
  
  if(q.indexOf(_func) > -1)
    q.push(_func);
  
  return true;
};

FunctionQueueProto.__detach = function(_func)
{
  if(_func == null)
    return false;

  var i = this.queue_.indexOf(_func);
  
  if(i < 0)
    return false;
  
  this.queue_.splice(i, 1);
  
  return true;
};
FunctionQueueProto.__detachDispatch = function(_func)
{
  if(_func == null)
    return false;

  var q = this.queueDispatchShadow_ || this.queue_;
  
  var i = q.indexOf(_func);
  
  if(i < 0)
    return false;
  
  if(!this.queueDispatchShadow_) 
    q = this.queueDispatchShadow_ = this.queue_.slice(0);
  
  q.splice(i, 1);
  
  return true;
};

/**
  @fn check if queue is empty
  @return {Boolean} true if queue is empty else false
*/  
FunctionQueueProto._isEmpty = function()
{
  return (this.queueDispatchShadow_ || this.queue_).length == 0;
};

/**
  @fn check if <_func> in queue
  @param _func {Function} function to check
  @return {Boolean} true if <_func> in queue else false
*/  
FunctionQueueProto._has = function(_func)
{
  return (this.queueDispatchShadow_ || this.queue_).indexOf(_func) > -1;
};

/**
  @fn exec functions in queue with this = <that> and arguments = <args> until some function return false
  @param that {Any} this for functions
  @param args? {Array || Arguments} arguments for functions
  @throw {Error} if <$jb.FunctionQueue#_apply> or <$jb.FunctionQueue#_apply> called nested
  @return {Boolean} true if all functions in queue executed else false
*/  
FunctionQueueProto._apply = function(that, args)
{
  if(this.queueDispatchShadow_)
    throw '<$jb.FunctionQueue#_apply> nested _apply/_applyAll calls not supported';
  
  var q = this.queue_, i = q.length;
  
  this._detach = this.__detachDispatch;

  if(args != null && args.length > 0)
  {
    while(i-- && q[i].apply(that, args) !== false)
      ;
  }
  else
  {
    while(i-- && q[i].call(that) !== false)
      ;
  }

  if(this.queueDispatchShadow_)
    this.queue_ = this.queueDispatchShadow_;
    
  this.queueDispatchShadow_ = null;
  this._detach = this.__detach;
  
  return i < 0;
};

/**
  @fn exec functions in queue with this = <that> and arguments = <args>
  @param that {Any} this for functions
  @param args? {Array || Arguments} arguments for functions
  @throw {Error} if <$jb.FunctionQueue#_apply> or <$jb.FunctionQueue#_apply> called nested
  @return {Boolean} true if all functions in queue executed else false
*/  
FunctionQueueProto._applyAll = function(that, args)
{
  if(this.queueDispatchShadow_)
    throw '<$jb.FunctionQueue#_applyAll> nested _apply/_applyAll calls not supported';

  var q = this.queue_, i = q.length;
  
  this._detach = this.__detachDispatch;

  if(args != null && args.length > 0)
  {
    while(i--)
      q[i].apply(that, args);
  }
  else
  {
    while(i--)
      q[i].call(that);
  }
  
  if(this.queueDispatchShadow_)
    this.queue_ = this.queueDispatchShadow_;
    
  this.queueDispatchShadow_ = null;
  this._detach = this.__detach;

  return true;
};

/**
  @fn create anonimous function which make fq._apply(this, arguments) 
  @return {Function}
*/  
FunctionQueueProto._fApply = function()
{
  var fq = this;
  
  return function()
  {
    return fq._apply(this, arguments);
  };
};


/*  
FunctionQueueProto._fApplyC = function(that)
{
  var _ret = arguments.callee._fRet();
  
  _ret.that = that;
  _ret.fq = this;
  
  return _ret;
};
$jb._fFunctionQueueApplyC._fRet=function()
{
  return function()
  {
    var self = arguments.callee;
    
    return self.fq._apply(self.that, arguments);
  };
};
*/

});