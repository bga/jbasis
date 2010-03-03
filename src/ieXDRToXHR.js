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

if("XDomainRequest" in window)
{
  window.__jb_ieXDRToXHR=function()
  {
    var OldXHR=window.XMLHttpRequest;
    
    window.XMLHttpRequest=function()
    {
      this.onreadystatechange=null;
      
      this.xhr_=new OldXHR();
      this.xdr_=new window.XDomainRequest();
      
      this.readyState=0;
      this.status=null;
      this.statusText=null;
      this.responseText=null;
      
      this.onreadystatechange=null;
      
      this.getResponseHeader=null;
      this.getAllResponseHeaders=null;
      
      this.setRequestHeader=null;
      
      this.abort=null;
      this.send=null;
      
      this.isXDR_=null;

      // static binding
      var self=this;
      
      self.__xdrLoaded=function(){ self.__xdrLoaded(); };
      self.__xdrError=this.xdr_.ontimeout=function(){ self.__xdrError(); };
      self.__xdrProgress=function(){ self.__xdrProgress(); };
      self.__xhrReadyStateChanged=function(){ self.__xhrReadyStateChanged(); };
    };
    
    XMLHttpRequest.prototype.open=function(method,url,asynch,user,pwd)
    {
      if(/^([a-z]+):/.test(url) && url.indexOf(document.domain)==-1)
      {
        this.isXDR_=true;
        this.__setXDRActive();
        this.xdr_.open(method,url);
      }
      else
      {
        this.isXDR_=false;
        this.__setXHRActive();
        this.xhr_.open(method,url,asynch,user,pwd);
      }
    };

    XMLHttpRequest.prototype.__xdrGetResponseHeader=function(name)
    {
      if(name=="Content-Type" && this.xdr_.contentType>"")
        return this.xdr_.contentType;
        
      return "";
    };
    XMLHttpRequest.prototype.__xdrGetAllResponseHeaders=function()
    {
      return (this.xdr_.contentType>"") ? "Content-Type: "+this.xdr_.contentType : "";
    };
    XMLHttpRequest.prototype.__xdrSetRequestHeader=function(name,value)
    {
      throw new Error("Request headers not supported");
    };
    XMLHttpRequest.prototype.__xdrLoaded=function()
    {
      if(this.onreadystatechange!=null)
      {
        this.readyState=4;
        this.status=200;
        this.statusText="OK";
        this.responseText=this.xdr_.responseText;
        
        this.__finalXDRRequest();
        
        this.onreadystatechange();
      }  
    };
    XMLHttpRequest.prototype.__xdrError=function()
    {
      if(this.onreadystatechange!=null)
      {
        this.readyState=4;
        this.status=0;
        this.statusText=""; // ???
        this.responseText="";
        
        this.onreadystatechange();
      }  
    };
    XMLHttpRequest.prototype.__xdrProgress=function()
    {
      if(this.onreadystatechange!=null && this.status!=3)
      {
        this.readyState=3;
        this.status=3;
        this.statusText="";
        this.onreadystatechange();
      }  
    };
    XMLHttpRequest.prototype.__finalXDRRequest=function()
    {
      this.xdr_.onload=
      this.xdr_.onerror=
      this.xdr_.onprogress=
      this.xdr_.ontimeout=
      null;
    };
    XMLHttpRequest.prototype.__sendXDR=function(data)
    {
      this.xdr_.onload=this.__xdrLoaded;
      this.xdr_.onerror=this.xdr_.ontimeout=this.__xdrError;
      this.xdr_.onprogress=this.__xdrProgress;
      this.responseText=null;
      
      this.xdr_.send(data);
    };
    XMLHttpRequest.prototype.__abortXDR=function()
    {
      this.__finalXDRRequest();
      this.xdr_.abort();
    };
    XMLHttpRequest.prototype.__setXDRActive=function()
    {
      this.send=this.__sendXDR;
      this.abort=this.__abortXDR;
      this.getResponseHeader=this.__xdrGetResponseHeader;
      this.getAllResponseHeaders=this.__xdrGetAllResponseHeaders;
      this.setRequestHeader=this.__xdrSetRequestHeader;
    };
    
    XMLHttpRequest.prototype.__xhrGetResponseHeader=function(name)
    {
      return this.xhr_.getResponseHeader(name);
    };
    XMLHttpRequest.prototype.__xhrGetAllResponseHeaders=function()
    {
      return this.xhr_.getAllResponseHeaders();
    };
    XMLHttpRequest.prototype.__xhrSetRequestHeader=function(name,value)
    {
      return this.xhr_.setRequestHeader(name,value);
    };
    XMLHttpRequest.prototype.__xhrReadyStateChanged=function()
    {
      if(this.onreadystatechange!=null && this.readyState!=this.xhr_.readyState)
      {
        this.readyState=this.xhr_.readyState;
        
        if(this.readyState==4)
        {
          this.status=this.xhr_.status;
          this.statusText=this.xhr_.statusText;
          this.responseText=this.xhr_.responseText;
          
          this.__finalXHRRequest();
        }
        
        this.onreadystatechange();
      }  
    };
    XMLHttpRequest.prototype.__finalXHRRequest=function()
    {
      this.xhr_.onreadystatechange=null;
    };
    XMLHttpRequest.prototype.__abortXHR=function()
    {
      this.__finalXHRRequest();
      this.xhr_.abort();
    };
    XMLHttpRequest.prototype.__sendXHR=function(data)
    {
      this.xhr_.onreadystatechange=this.__xhrReadyStateChanged;
      
      this.xhr_.send(data);
    };
    XMLHttpRequest.prototype.__setXHRActive=function()
    {
      this.send=this.__sendXHR;
      this.abort=this.__abortXHR;
      this.getResponseHeader=this.__xhrGetResponseHeader;
      this.getAllResponseHeaders=this.__xhrGetAllResponseHeaders;
      this.setRequestHeader=this.__xhrSetRequestHeader;
    };

    window.__jb_ieXDRToXHR=undefined;
  };
  
  if(window.$jb!=null && $jb.Build!=null)
  {
    $jb.Loader._scope().
    _requireIf("$jb/ieXHR.js",!("XMLHttpRequest" in window)).
    _willDeclared("$jb/ieXDRToXHR.js").
    _completed(window.__jb_ieXDRToXHR);
  }
  else
  {
    window.__jb_ieXDRToXHR();
  }  
}
