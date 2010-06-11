/*
  Romove difference between IE8 and w3c cross domain XHRs. Require ieXHR.js for ie6 native XHR

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

if('XDomainRequest' in window)
{
  window.__jb_ieXDRToXHR = function(window)
  {
    var OldXHR = window.XMLHttpRequest;
    
    window.XMLHttpRequest = function()
    {
      this.onreadystatechange = null;
      
      this.xhr_;
      this.xdr_;
      
      this.readyState = 0;
      this.status;
      this.statusText;
      this.responseText;
      
      this.onreadystatechange;
      
      this.getResponseHeader;
      this.getAllResponseHeaders;
      
      this.setRequestHeader;
      
      this.abort;
      this.send;
      
      this.isXDR_;

      // static binding
      var self = this;
      
      self.__xdrLoadedBinded = function(){ self.__xdrLoaded(); };
      self.__xdrErrorBinded = function(){ self.__xdrError(); };
      self.__xdrProgressBinded = function(){ self.__xdrProgress(); };
      self.__xhrReadyStateChangedBinded = function(){ self.__xhrReadyStateChanged(); };
      
      //self.__finalXDRRequestBind=function(){ self.__finalXDRRequest(); };
      //self.__finalXHRRequestBind=function(){ self.__finalXHRRequest(); };
    };
    
    var XHRProto = XMLHttpRequest.prototype;
    var protocolRE = /^([a-z]+):/;
    
    XHRProto.open = function(method, url, asynch, user, pwd)
    {
      if(protocolRE.test(url) && url.indexOf(document.domain) < 0)
      {
        if(this.xdr_ == null)
          this.xdr_ = new window.XDomainRequest();
        
        this.isXDR_ = true;
        this.__setXDRActive();
        this.xdr_.open(method, url);
      }
      else
      {
        if(this.xhr_ == null)
          this.xhr_ = new OldXHR();

        this.isXDR_ = false;
        this.__setXHRActive();
        this.xhr_.open(method, url, asynch, user, pwd);
      }
    };

    XHRProto.__xdrGetResponseHeader = function(name)
    {
      if(name === 'Content-Type' && this.xdr_.contentType > '')
        return this.xdr_.contentType;
        
      return '';
    };
    XHRProto.__xdrGetAllResponseHeaders = function()
    {
      return (this.xdr_.contentType > '') ? 'Content-Type: ' + this.xdr_.contentType : '';
    };
    XHRProto.__xdrSetRequestHeader=function(name, value)
    {
      throw new Error('Request headers not supported');
    };
    XHRProto.__xdrLoaded = function()
    {
      if(this.onreadystatechange != null)
      {
        this.readyState = 4;
        this.status = 200;
        this.statusText = 'OK';
        this.responseText = this.xdr_.responseText;
        
        //setTimeout(this.__finalXDRRequestBind,0);
        
        this.onreadystatechange();
      }  
    };
    XHRProto.__xdrError = function()
    {
      if(this.onreadystatechange != null)
      {
        this.readyState = 4;
        this.status = 0;
        this.statusText = ''; // ???
        this.responseText = '';

        //setTimeout(this.__finalXDRRequestBind,0);
        
        this.onreadystatechange();
      }  
    };
    XHRProto.__xdrProgress = function()
    {
      if(this.onreadystatechange != null && this.status != 3)
      {
        this.readyState = 3;
        this.status = 3;
        this.statusText = '';
        this.onreadystatechange();
      }  
    };
    XHRProto.__finalXDRRequest = function()
    {
      var xdr = this.xdr_;
      
      delete xdr.onload;
      delete xdr.onerror;
      delete xdr.onprogress;
      //this.xdr_.ontimeout=
    };
    XHRProto.__sendXDR = function(data)
    {
      var xdr = this.xdr_;

      xdr.onload = this.__xdrLoadedBinded;
      xdr.onerror = this.xdr_.ontimeout=this.__xdrErrorBinded;
      xdr.onprogress = this.__xdrProgressBinded;
      this.responseText = null;
      
      this.xdr_.send(data);
    };
    XHRProto.__abortXDR = function()
    {
      this.__finalXDRRequest();
      this.xdr_.abort();
    };
    XHRProto.__setXDRActive = function()
    {
      this.send = this.__sendXDR;
      this.abort = this.__abortXDR;
      this.getResponseHeader = this.__xdrGetResponseHeader;
      this.getAllResponseHeaders = this.__xdrGetAllResponseHeaders;
      this.setRequestHeader = this.__xdrSetRequestHeader;
    };
    
    XHRProto.__xhrGetResponseHeader = function(name)
    {
      return this.xhr_.getResponseHeader(name);
    };
    XHRProto.__xhrGetAllResponseHeaders = function()
    {
      return this.xhr_.getAllResponseHeaders();
    };
    XHRProto.__xhrSetRequestHeader = function(name, value)
    {
      return this.xhr_.setRequestHeader(name, value);
    };
    XHRProto.__xhrReadyStateChanged = function()
    {
      if(this.onreadystatechange != null && this.readyState != this.xhr_.readyState)
      {
        var xhr = this.xhr_;
        
        this.readyState = xhr.readyState;
        
        if(this.readyState == 4)
        {
          this.status = xhr.status;
          this.statusText = xhr.statusText;
          this.responseText = xhr.responseText;
          
          //setTimeout(this.__finalXHRRequestBind,0);
        }
        
        this.onreadystatechange();
      }  
    };
    XHRProto.__finalXHRRequest = function()
    {
      delete this.xhr_.onreadystatechange;
    };
    XHRProto.__abortXHR = function()
    {
      this.__finalXHRRequest();
      this.xhr_.abort();
    };
    XHRProto.__sendXHR = function(data)
    {
      this.xhr_.onreadystatechange = this.__xhrReadyStateChangedBinded;
      
      this.xhr_.send(data);
    };
    XHRProto.__setXHRActive = function()
    {
      this.send = this.__sendXHR;
      this.abort = this.__abortXHR;
      this.getResponseHeader = this.__xhrGetResponseHeader;
      this.getAllResponseHeaders = this.__xhrGetAllResponseHeaders;
      this.setRequestHeader = this.__xhrSetRequestHeader;
    };

    window.__jb_ieXDRToXHR = undefined;
  };
  
  if(window.$jb != null && $jb.Loader != null)
  {
    $jb.Loader._scope().
    _requireIf("$jb/ieXHR.js", !("XMLHttpRequest" in window)).
    _willDeclared("$jb/ieXDRToXHR.js").
    _completed(window.__jb_ieXDRToXHR);
  }
  else
  {
    window.__jb_ieXDRToXHR(window);
  }  
}
