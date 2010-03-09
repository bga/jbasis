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
_require("$jb/$G.Function.js").
_require("$jb/OOP.js").
_require("$jb/exceptions.js").
_require("$jb/$jb.Net.Base.js").
_requireIf("$jb/ieXHR.js", $w.XMLHttpRequest==null). // for ie 5.5-6.0 alse requred "iexhr.js"
_requireIf("$jb/ieXDRToXHR.js", ("XDomainRequest" in $w)). // XDomainRequest IE support
_willDeclared("$jb/$jb.Net.XHR.js").
_completed(function(){


if($w.XMLHttpRequest==null)
  return;

if($jb.Net==null)
  $jb.Net={};

$jb.Net.XHR=function()
{
  $jb.Net.Base.call(this);
  
  this.xhr_=new $w.XMLHttpRequest();

  this.url=null;
  this.method=null;
  this.sendData=null;

  this.requestHeaderMap={};
  this.user=null;
  this.pwd=null;
  
  this._acceptStatus=function(status) { return status === 200; }; // only 200 accept
  
  this.isCompleted_=null;
  
  this.__stateChanged=this.__stateChanged._fBind(this);
  this.__stateChangedReal=this.__stateChangedReal._fBind(this);
};

$jb.Net.XHR._staticDeriveFrom($jb.Net.Base);

$jb.Net.XHR.prototype._xhr=function()
{
  return this.xhr_;
};

$jb.Net.XHR.prototype._data=function()
{
  return this.xhr_.responseText;
};

$jb.Net.XHR.prototype.__stateChanged=function()
{
  if(this.xhr_.readyState!=4)
    return;

  //if(this.isCompleted_)
    //return;
    
  return this.__stateChangedReal._after();
};

(function()
{  
  var re=new RegExp(/^[a-z]+:\/\/([a-zA-Z\._-]+)\//);
  
  $jb.Net.XHR.prototype.__isCrossDomain=function(url)
  {
    return re.test(url) && RegExp.$1.indexOf($d.domain) === -1;
  };
})();

$jb.Net.XHR.prototype.__stateChangedReal=function()
{
  var status=this.xhr_.status;
  
  this.isCompleted_=true;
  
  if(status === 0 || status === 12029 || ( !this.__isCrossDomain(this.url) && this.xhr_.getAllResponseHeaders()=="" ))
  {
    this._fireEvent("error",this,[new NetworkErr()]);
  }
  else
  {
    if(this._acceptStatus!=null && !this._acceptStatus(status))
      this._fireEvent("error",this,[new InvalidStatusErr()]);
    else
      this._fireEvent("dataReceived",this);
  }

  this.readyState=2;
  this._fireEvent("closed",this);
  this.xhr_.onreadystatechange=null;
};

$jb.Net.XHR.prototype._setRequestHeader=function(key,value)
{
  this.requestHeaderMap[key]=value;
  
  return this;
};

$jb.Net.XHR.prototype.__setRequestHeaders=function()
{
  var i=null;
  var hm=this.requestHeaderMap;
  
  for(i in hm)
  {
    if(hm.hasOwnProperty(i))
      this.xhr_.setRequestHeader(i,hm[i]);
  }
};

$jb.Net.XHR.prototype._getResponseHeader=function(key)
{
  return this.xhr_.getResponseHeader(key);
};
$jb.Net.XHR.prototype._getAllResponseHeaders=function()
{
  return this.xhr_.getAllResponseHeaders();
};


$temp._declareFn=function(method)
{
  $jb.Net.XHR.prototype["_"+method.toLowerCase()]=function(url)
  {
    this.method=method;
    this.url=url;
    
    return this;
  };
};
$temp._declareFn("GET");
$temp._declareFn("POST");
$temp._declareFn("HEAD");
$temp._declareFn("PUT");
$temp._declareFn("DELETE");
$temp._declareFn("TRACE");

delete $temp._declareFn;

$jb.Net.XHR.prototype._auth=function(user,pwd)
{
  this.user=user;
  this.pwd=pwd;
  
  return this;
};

$jb.Net.XHR.prototype._status=function()
{
  return (this.isCompleted_==true) ? this.xhr_.status : null;
};

$jb.Net.XHR.prototype._send=function(data)
{
  this.sendData=data;
  
  return this;
};

$jb.Net.XHR.prototype._reopen=function(isSilentClose)
{
  this._close(isSilentClose);
  
  try
  {
    this.isCompleted_=false;
    this.readyState=0;
    this.xhr_.open(this.method,this.url,true,this.user,this.pwd);
    this.xhr_.onreadystatechange=this.__stateChanged;
    this.__setRequestHeaders();
    
    this.readyState=1;
    this._fireEvent("opened",this);
    
    this.xhr_.send(this.sendData);
  }
  catch(err)
  {
    this.isCompleted_=true;
    
    this._fireEvent("error",this,[err]);
    
    if(this.readyState === 1)
    {
      this.readyState=2;
      this._fireEvent("closed",this);
    }
    else
    {
      this.readyState=2;
    }
  }
  
  return this;
};

$jb.Net.XHR.prototype._close=function(isSilentClose)
{
  if(this.isCompleted_ === false)
  {
    this.isCompleted_=true;
    this.xhr_.onreadystatechange=null;
    this.xhr_.abort();
  }
  
  if(this.readyState !== 2)
  {
    this.readyState=2;

    if(isSilentClose === false)
      this._fireEvent("closed",this);
  }  
  
  return this;
};

});

// if offline. non cross domain
// webkit statusText "" status 0 responseText "" getAllResponseHeaders ""
// ff same statusText "" status 0 responseText "" getAllResponseHeaders null
// opera statusText OK status 200 responseText "" getAllResponseHeaders "" OR
// opera statusText "" status 0 responseText "" getAllResponseHeaders ""
// ie6 statusText "" status 200 responseText "" getAllResponseHeaders ""
// ie7 statusText Unknown status 12029 responseText "" getAllResponseHeaders ""
// ie8 same as ie7

// if online. cross domain
// ff statusText "" status 0 responseText "" getAllResponseHeaders null
// webkit statusText "" status 0 responseText "" getAllResponseHeaders ""
// webkit statusText "" status 0 responseText "" getAllResponseHeaders ""

// if cross domain denied
// webkit statusText "" status 0 responseText "" getAllResponseHeaders ""
// ff same statusText "" status 0 responseText "" getAllResponseHeaders null
// webkit statusText "" status 0 responseText "" getAllResponseHeaders ""
