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
_require("$jb/$jb.FunctionQueue.js").
_willDeclared("$jb/$jb.EventTarget.js").
_completed(function($G, $jb){

var FunctionQueue = $jb.FunctionQueue;

$jb.EventTarget = function()
{
  this.beforeEventFQMap_ = {};
  this.onEventFQMap_ = {};
  this.afterEventFQMap_ = {};
  
  this.eventLockCountMap_ = {};
};

/** @alias */ 
var EventTargetProto = $jb.EventTarget.prototype;

EventTargetProto._attachEvent = function(name, _func, stage)
{
  var map = (stage == null) ? this.onEventFQMap_ : this[stage + 'EventFQMap_'];
    
  (map[name] || (map[name] = new FunctionQueue()))._attach(_func);
  
  return this;
};
EventTargetProto._detachEvent = function(name, _func, stage)
{
  var map = (stage == null) ? this.onEventFQMap_ : this[stage + 'EventFQMap_'];

  if(name in map)
    return map[name]._detach(_func);
    
  return false;
};
EventTargetProto._lockEvent = function(name)
{
  var elcm = this.eventLockCountMap_;

  if(name in elcm)
    return ++elcm[name];
  
  return elcm[name] = 1;  
};
EventTargetProto._unlockEvent = function(name)
{
  var elcm = this.eventLockCountMap_;
  
  if(name in elcm)
  {
    if(elcm[name] > 0)
      return --elcm[name];
    
    return 0;
  }
  
  return elcm[name] = 0;  
};

EventTargetProto._fireEvent = function(name, scope, args)
{
  if(this.eventLockCountMap_[name] > 0)
    return null;
    
  if(scope == null)
    scope = this;
  
  var ret = null;
  
  if(name in this.beforeEventFQMap_)
    this.beforeEventFQMap_[name]._applyAll(scope, args);
  
  if(name in this.onEventFQMap_)
    ret = this.onEventFQMap_[name]._apply(scope, args);
  
  if(name in this.afterEventFQMap_)
    this.afterEventFQMap_[name]._applyAll(scope, args);
    
  return ret;
};

});