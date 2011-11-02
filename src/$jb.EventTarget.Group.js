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

this.$jb.Loader._scope().
_require("$jb/OOP.js").
_require("$jb/$G.Function.js").
_require("$jb/$G.Array.js").
_require("$jb/$jb.EventTarget.Proxy.js").
_willDeclared("$jb/$jb.EventTarget.Group.js").
_completed(function($G, $jb){

//var EventTargetProxyProto = $jb.EventTarget.Proxy.prototype;

/** @class allow join group of event targets to one */
$jb.EventTarget.Group = Object(function()
{
  $jb.EventTarget.Proxy.call(this);

  /**
    @var {
      $jb.EventTarget.* ||
      Object(
        _attachEvent {Function(
          name {String} event name
          _func {Function} event listener
        )}
        _detachEvent {Function(
          name {String} event name
          _func {Function} event listener
        )}
      )
    }
  */  
  this.eventTargets_ = [];

  /**
    @var {Object(
      {String} event name ->
      {Function} event listener
    )} constins all temporary event listeners to currently subscribed events
  */  
  this.eventListenerMap_ = {};
});

$jb.EventTarget.Group.name = '$jb.EventTarget.Group';

/**@inherit */
$jb.EventTarget.Group._staticDeriveFrom($jb.EventTarget.Proxy);

$jb.EventTarget.Group.prototype._attachProxyEvent = function(name)
{
  var eventTargets_ = this.eventTargets_, eventTarget, i = -1;
  var 
    self = this, 
    _listener = function()
    {
      return self._fireEvent(name, this, arguments);
    }
  ;
  
  this.eventListenerMap_[name] = _listener;
  
  while((eventTarget = eventTargets_[++i]))
    eventTarget._attachEvent(_listener);
};

$jb.EventTarget.Group.prototype._detachProxyEvent = function(name)
{
  var eventTargets_ = this.eventTargets_, eventTarget, i = -1;
  var _listener = this.eventListenerMap_[name];
  
  while((eventTarget = eventTargets_[++i]))
    eventTarget._detachEvent(_listener);
  
  delete this.eventListenerMap_[name];
};

$jb.EventTarget.Group.prototype._addEventTarget = function(eventTarget)
{
  if(this.eventTargets_.indexOf(eventTarget) < 0)
  {  
    this.eventTargets_.push(eventTarget);
  
    var eventListenerMap = this.eventListenerMap_;
    
    for(var eventListenerName in eventListenerMap)
    {
      if(eventListenerMap.hasOwnProperty(eventListenerName))
        eventTarget._attachEvent(eventListenerName, eventListenerMap[eventListenerName]);
    }
  }

  return this;
};

$jb.EventTarget.Group.prototype._removeEventTarget = function(eventTarget)
{
  var pos = this.eventTargets_.indexOf(eventTarget);
  
  if(pos > -1)
  {  
    this.eventTargets_.splice(pos, 1);
  
    var eventListenerMap = this.eventListenerMap_;
    
    for(var eventListenerName in eventListenerMap)
    {
      if(eventListenerMap.hasOwnProperty(eventListenerName))
        eventTarget._detachEvent(eventListenerName, eventListenerMap[eventListenerName]);
    }
  }
  
  return this;
};

});