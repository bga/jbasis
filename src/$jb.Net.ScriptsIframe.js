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
_require("$jb/$jb.ExternalInterface.js").
//_require("$jb/ext/dom.js").
_require("$jb/$G.Function.js").
_require("$jb/OOP.js").
_require("$jb/$jb.Net.Base.js").
_willDeclared("$jb/$jb.Net.ScriptsIframe.js").
_completed(function($G, $jb){

var ei = $jb.ei, $d = $G.$d;

if($jb.Net == null)
  $jb.Net = {};

$jb.Net.ScriptsIframe = function()
{
  $jb.Net.Base.call(this);
  
  this.url = null;
  this.realUrl = null;
  
  this.doc = $d;
  this.iframe_ = null;

  //this.closeIframeThreadId_=null;
  //this.closeIframeInterval=30000000;
  
  this.gCount_ = 0;
  
  var objName = $jb.ei._regObject(this);
  
  this.objCode = $jb.ei._nameToCode(objName);
  
  this.data_ = null;
  
  this.__iframeLoaded = this.__iframeLoaded._fBind(this);

  this._recreateIframe();
  
  return this;
};

$jb.Net.ScriptsIframe._staticDeriveFrom($jb.Net.Base);

/**@alias */
var ScriptsIframeProto = $jb.Net.ScriptsIframe.prototype;
  
ScriptsIframeProto.gcThreshold = 100;

(function()
{
  var re = /<%=\s*objCode\s*%>/g;
  
  ScriptsIframeProto._passSelfExtName = function()
  {
    this.realUrl = this.url.replace(re, this.objCode);
  };
})();  
  
ScriptsIframeProto._data = function()
{
  return this.data_;
};

ScriptsIframeProto._removeIframe = function()
{
  if(this.iframe_ == null)
    return false;
    
  this.iframe_.parentNode.removeChild(this.iframe_);
  this.iframe_ = null;
  
  return true;
};

ScriptsIframeProto._recreateIframe = function()
{
  this._removeIframe();
  
  var jbasis = this.doc.getElementById('jbasis');
  var iframe = this.doc.createElement('iframe');
  
  jbasis.appendChild(iframe);
  
  this.iframe_ = iframe;
};

/* ScriptsIframeProto.__closeIframeThread=function()
{
  this.closeIframeThreadId_=null;
  this._close(false);
};
 */
 
if($de.removeNode)
{
  ScriptsIframeProto.__gc = function()
  {
    if(this.gCount_ < this.gcThreshold)
      return;

    var scripts = this.iframe_.contentWindow.document.getElementsByTagName('script');
    var i = scripts.length;
    
    while(i--)
      scripts[0].removeNode();
      
    this.gCount_ = 0;  
  };
}
else
{
  ScriptsIframeProto.__gc = function()
  {
    if(this.gCount_ < this.gcThreshold)
      return;

    var scripts = this.iframe_.contentWindow.document.getElementsByTagName('script');
    var i = scripts.length;
    
    while(i--)
      scripts[0].parentNode.removeChild(scripts[0]);
      
    this.gCount_ = 0;  
  };
} 

ScriptsIframeProto.__iframeLoaded = function()
{
  this._close._fBind(this, [false])._after();
};

if($d.addEventListener != null) // ff opera webkit
{
  ScriptsIframeProto.__attachEvents = function()
  {
    this.iframe_.contentWindow.document.addEventListener(
      'DOMContentLoaded',
      this.__iframeLoaded,
      false
    ); 
  };
  
  ScriptsIframeProto.__detachEvents = function()
  {
    this.iframe_.contentWindow.document.removeEventListener(
      'DOMContentLoaded',
      this.__iframeLoaded,
      false
    ); 
  };
}
else // ie
{
  ScriptsIframeProto.__attachEvents = function()
  {
    this.iframe_.contentWindow.document.onreadystatechange = function()
    {
      if(this.readyState == 'loaded' || this.readyState == 'complete')
        this.__iframeLoaded();
    };    
  };
  
  ScriptsIframeProto.__detachEvents = function()
  {
    this.iframe_.contentWindow.document.onreadystatechange = null;
  };

}

ScriptsIframeProto.__iframeBegin = function()
{
  this.__attachEvents();
  
  if(this.readyState != 1)
  {
    this.readyState = 1;
    this._fireEvent('opened', this, [this]);
  }  

  ++this.gCount_;
  this.__gc();
};

ScriptsIframeProto.__iframeData = function(data)
{
  this.data_ = data;
  this._fireEvent('dataReceived', this, [this]);

  ++this.gCount_;
  this.__gc();
};

ScriptsIframeProto._setUrl = function(url)
{
  this.url = url;
  
  return this;
};

ScriptsIframeProto._reopen = function(isSilentClose)
{
  this._close(isSilentClose);
  
  this.readyState = 0;
  
  if(this._passSelfExtName != null)
    this._passSelfExtName();
    
  this.iframe_.src = this.realUrl;
  
  //this.closeIframeThreadId_=this.__closeIframeThread._fBind(this)._delay(this.closeIframeInterval);
  
  return this;
};

ScriptsIframeProto._close = function(isSilentClose)
{
  this.__detachEvents();
  this.iframe_.src = '';
  this.gCount_ = 0;
  
/*   if(this.closeIframeThreadId_!=null)
  {
    clearTimeout(this.closeIframeThreadId_);
    this.closeIframeThreadId_=null;
  }
 */  
  if(this.readyState !== 2)
  {
    this.readyState = 2;
  
    if(isSilentClose === false)
      this._fireEvent('closed', this, [this]);
  }
  
  return this;
};


});