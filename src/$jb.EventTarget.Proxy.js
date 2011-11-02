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
_require("$jb/$jb.EventTarget.Base.js").
_willDeclared("$jb/$jb.EventTarget.Proxy.js").
_completed(function($G, $jb){

var EventTargetBaseProto = $jb.EventTarget.Base.prototype;

/**@class proxy for <$jb.EventTarget.Base>. Call <ThisClass#_attachProxyEvent> if there are event subscribers(has added first just now) and <ThisClass#_detachProxyEvent> if no event subscribers (remove last just now) */
$jb.EventTarget.Proxy = Object(function()
{
  $jb.EventTarget.Base.call(this);

  /**@var {Object(
    {String} event name ->
    {Number} event listeners count for event(all stages)
  )}
  */
  this.eventCountMap_ = {};
});

$jb.EventTarget.Proxy.name = '$jb.EventTarget.Proxy';

/**@inherit */
$jb.EventTarget.Proxy._staticDeriveFrom($jb.EventTarget.Base);

/**
  @fn is called by <$jb.EventTarget.Proxy#_attachEvent> if event subscribers count become > 0
  @param {String} event name
*/  
$jb.EventTarget.Proxy.prototype._attachProxyEvent = function(name)
{

};

/**
  @fn is called by <$jb.EventTarget.Proxy#_detachEvent> if event subscribers become == 0
  @param {String} event name
*/  
$jb.EventTarget.Proxy.prototype._detachProxyEvent = function(name)
{

};

$jb.EventTarget.Proxy.prototype._attachEvent = function(name, _func, stage)
{
  if(this.eventCountMap_[name] == null)
  {  
    this.eventCountMap_[name] = 1;
    this._attachProxyEvent(name);
  }
  else if(this.eventCountMap_[name] == 0)
  {
    ++this.eventCountMap_[name];
    this._attachProxyEvent(name);
  }
  
  return EventTargetBaseProto._attachEvent.call(this, name, _func, stage);
};

$jb.EventTarget.Proxy.prototype._detachEvent = function(name, _func, stage)
{
  var ret = EventTargetBaseProto._detachEvent.call(this, name, _func, stage);
  
  if(ret &&
    this.eventCountMap_[name] == 1
  )
  {
    --this.eventCountMap_[name];
    this._detachProxyEvent(name);
  }
  
  return ret;
};

$jb.EventTarget.Proxy.prototype._hasEvents = function(name)
{
  return this.eventCountMap_[name] > 0;
};

});