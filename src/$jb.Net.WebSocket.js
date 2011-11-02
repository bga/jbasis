/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
_require("$jb/$jb.nav.js").
_completed(function(){

if(!("WebSocket" in $w) && !$jb.nav._flash())
{
  $jb.Loader._scope()._willDeclared("$jb/$jb.Net.WebSocket.js");
  
  return;
}

$jb.Loader._scope().
_require("$jb/$G.Function.js").
_require("$jb/OOP.js").
_require("$jb/$jb.Net.Base.js").
_requireIf("$jb/_3rdParty/swfobject/swfobject.js", !("WebSocket" in $w),true).
_completed(function(){

$jb.Loader._scope().
_requireIf("$jb/_3rdParty/websocket-flash-js/js/WebSocket.js", !("WebSocket" in $w), true).
_willDeclared("$jb/$jb.Net.WebSocket.js").
_completed(function($G, $jb){

if(!('WebSocket' in $w))
  return;

if($jb.Net == null)
  $jb.Net = {};

$jb.Net.WebSocket = function()
{
  $jb.Net.Base.call(this);
  
  this.ws_ = null;

  this.url = null;
  this.protocol = null;

  this.data_ = null;
  
  this.waitFlushCount_ = 0;
  this.flushWaiterThreadId_ = null;
  
  this.__wsOpened = this.__wsOpened._fBind(this);
  this.__wsError = this.__wsError._fBind(this);
  this.__wsMessageReceived = this.__wsMessageReceived._fBind(this);
  this.__wsClosed = this.__wsClosed._fBind(this);
  this.__flushWaiterThread = this.__flushWaiterThread._fBind(this);
};

$jb.Net.WebSocket._staticDeriveFrom($jb.Net.Base);

/** @alias */
var WebSocketProto = $jb.Net.WebSocket.prototype;

WebSocketProto._data = function()
{
  return this.data_;
};

WebSocketProto.__wsOpened = function(e)
{
  this.readyState = 1;
  this._fireEvent('opened', this, [this]);
};
WebSocketProto.__wsError = function(e)
{
  this.readyState = 2;
  this._fireEvent('error', this, [this]);
};
WebSocketProto.__wsMessageReceived = function(e)
{
  this.data_ = e.data;
  this._fireEvent('dataReceived', this, [this]);
};
WebSocketProto.__wsClosed = function(e)
{
  if(this.readyState === 1)
  {  
    this.readyState = 2;
    this._fireEvent('closed', this, [this]);
  }
  else
  {
    this.readyState = 2;
  }
};

WebSocketProto._setUrl = function(url, protocol)
{
  this.url = url;
  this.protocol = protocol;
  
  return this;
};

WebSocketProto._send = function(data)
{
  if(this.readyState !== 1)
    this._fireEvent('error', this, [this, new InvalidStateError()]);
  
  if(this.ws_.send('' + data) !== true)
    this._fireEvent('error', this, [this, new NetworkError()]);
  
  return this;
};

WebSocketProto.__flushWaiterThread = function()
{
  if(!this._isFlushed())
    return;
    
  clearInterval(this.flushWaiterThreadId_);
  this.flushWaiterThreadId_ = null;
  
  this._fireEvent('flushed', this, [this]);
};

WebSocketProto._waitFlush = function()
{
  if(this.waitFlushCount_ === 0 && this._isFlushed())
  {
    this._fireEvent('flushed', this, [this]);
    
    return this;
  }
  
  if(++this.waitFlushCount_ === 1)
  {
    this.flushWaiterThreadId_ = this.__flushWaiterThread._period(25);
  }
  
  return this;
};

WebSocketProto._stopWaitFlush = function()
{
  if(this.waitFlushCount_ === 0)
    return this;
    
  if(--this.waitFlushCount_ === 0)
  {
    clearInterval(this.flushWaiterThreadId_);
    this.flushWaiterThreadId_ = null;
  }
  
  return this;
};
WebSocketProto._isFlushed = function()
{
  return this.ws_ && !(this.ws_.bufferedAmount > 0);
};


WebSocketProto._reopen = function(isSilentClose)
{
  this._close(isSilentClose);
  
  var ws;
  
  try
  {
    this.readyState = 0;
    ws = this.ws_ = new $w.WebSocket(this.url, this.protocol || 'sample');
    
    ws.onopen = this.__wsOpened;
    ws.onerror = this.__wsError;
    ws.onmessage = this.__wsMessageReceived;
    ws.onclose = this.__wsClosed;
  }
  catch(err)
  {
    this._fireEvent('error', this, [this, err]);

    if(this.readyState === 1)
    {
      this.readyState = 2;
      this._fireEvent('closed', this, [this]);
    }
    else
    {
      this.readyState = 2;
    }
  }
  
  return this;
};

WebSocketProto._close = function(isSilentClose)
{
  if(this.ws_ && this.ws_.readyState !== 2)
  {
    try
    {
      this.ws_.close();
    }
    catch(err)
    {
    
    }
  }
  
  delete this.ws_;
  
  if(this.readyState !== 2)
  {
    this.readyState = 2;
    
    if(isSilentClose === false)
      this._fireEvent('closed', this, [this]);
  }
  
  return this;
};

});
});
});