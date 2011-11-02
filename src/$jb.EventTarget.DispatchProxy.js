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
_require("$jb/$jb.EventTarget.Proxy.js").
_willDeclared("$jb/$jb.EventTarget.DispatchProxy.js").
_completed(function($G, $jb){

//var EventTargetProxyProto = $jb.EventTarget.Proxy.prototype;

/**@class dispatch proxy for <$jb.EventTarget.Proxy> Contains <$jb.EventTarget.DispatchProxy#eventManagerMap> map event name -> two functions(_attachEvent, _detachEvent). Call _attachEvent if there are event subscribers(has added first just now) and _detachEvent if no event subscribers (remove last just now) */
$jb.EventTarget.DispatchProxy = Object(function()
{
  $jb.EventTarget.Proxy.call(this);

  /**
    @var {Object(
      {String} event name ->
      {Object(
        _attachEvent {Function} call when listener added and no event listeners was before
        _detachEvent {Function} call when no event listeners and one event listener was before
      )}
    )}
  */
  this.eventManagerMap = {};
  
});

$jb.EventTarget.DispatchProxy.name = '$jb.EventTarget.DispatchProxy';

/** @inherit */
$jb.EventTarget.DispatchProxy._staticDeriveFrom($jb.EventTarget.Proxy);

$jb.EventTarget.DispatchProxy.prototype._attachProxyEvent = function(name)
{
  if(name in this.eventManagerMap)
    this.eventManagerMap[name]._attachEvent(this, name);
};

$jb.EventTarget.DispatchProxy.prototype._detachProxyEvent = function(name)
{
  if(name in this.eventManagerMap)
    this.eventManagerMap[name]._detachEvent(this, name);
};

});