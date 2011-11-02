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
*/

$jb.Loader._scope().
//_require("$jb/nav.js").
_require("$jb/OOP.js").
_require("$jb/$G.Function.js").
_require("$jb/$jb.EventTarget.DispatchProxy.js").
_willDeclared("$jb/$jb.Host.eventTarget.js").
_completed(function($G, $jb){

/**@namespace contains all common stuff related to host */
if($jb.Host == null)
  $jb.Host = {};

/**@class provide host event target. Currently support only 'unload' event */
$jb.Host.RootEventTarget = function()
{
  $jb.EventTarget.DispatchProxy.call(this);

  this.__onUnload = this.__onUnload._fBind(this);
};

/**@inherit */
$jb.Host.RootEventTarget._staticDeriveFrom($jb.EventTargetProxy);


/**@var {$jb.Host.RootEventTarget} host event target*/ 
$jb.Host.eventTarget = new $jb.Host.RootEventTarget();

var eventManagerMap = $jb.Host.eventTarget.eventManagerMap;

$jb._defConst('host:support:History#navigationMode', $jb._isExist('$G.history.navigationMode'));
$jb._defConst('dom:support:DOMWindow#addEventListener', $jb._isExist('$G.window.addEventListener'));
$jb._defConst('dom:support:DOMWindow#removeEventListener', $jb._isExist('$G.window.removeEventListener'));
$jb._defConst('dom:support:DOMWindow#attachEvent', $jb._isExist('$G.window.attachEvent'));
$jb._defConst('dom:support:DOMWindow#detachEvent',  $jb._isExist('$G.window.detachEvent'));

/**
  @fn central unload event hook
*/
$jb.Host.RootEventTarget.prototype.__onUnload = function()
{
  this._fireEvent('unload', this, [this]);
};

eventManagerMap['unload'] = 
{
  _attachEvent: function(self, name)
  {
    if($jb._const('host:support:History#navigationMode'))
      $G.history.navigationMode = 'compatible';
    
    if($jb._const('host:name') == 'opera unite')
      $G.opera.io.webserver.addEventListener('_close', self.__onUnload, false);
    else if($jb._const('dom:support:DOMWindow#addEventListener')
      $G.window.addEventListener('unload', self.__onUnload, false);
    else if($jb._const('dom:support:DOMWindow#attachEvent'))
      $G.window.attachEvent('onunload', self.__onUnload);
    else if($jb._const('host:name') == 'node.js')
      $G.process.on('exit', self.__onUnload);
    else if($jb._const('host:name') == 'ringo.js')
      $G.java.lang.Runtime.getRuntime().addShutdownHook(this.javaShutdownHookThread_ || (this.javaShutdownHookThread_ = new $G.java.lang.Thread(new $G.java.lang.Runnable({run: self.__onUnload}))));
   
    // envs which not support unload event: wsh, opera browser(partial), opera unite(buggy) 
  },
  _detachEvent: function(self, name)
  {
    if($jb._const('host:support:History#navigationMode'))
      $G.history.navigationMode = 'automatic';
    
    if($jb._const('host:name') == 'opera unite')
      $G.opera.io.webserver.removeEventListener('_close', self.__onUnload, false);
    else if($jb._const('dom:support:DOMWindow#removeEventListener'))
      $G.window.removeEventListener('unload', self.__onUnload, false);
    else if($jb._const('dom:support:DOMWindow#detachEvent'))
      $G.window.detachEvent('onunload', self.__onUnload);
    else if($jb._const('host:support:process'))
      $G.process.removeListener('exit', self.__onUnload);
    else if($jb._const('host:support:java'))
      $G.java.lang.Runtime.getRuntime().removeShutdownHook(this.javaShutdownHookThread_);
  }
};  

});