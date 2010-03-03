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
  
  declare $jb.Nav class and $jb.nav helper instance
  
*/

$jb.Loader._scope().
_willDeclared("$jb/$jb.nav.js").
_completed(function(){

/**
  @class detector of user agent class and traits
  @brief version is a positive float number(9.5) if can detect, -1 if feature present but version can not detected, else null
*/
$jb.Nav=function()
{
  /** @var Internet Exploror version. Detected in constructor by this.__detectUserAgent */
  this.ie_=null;
  
  /** @var Opera version. Detected in constructor by this.__detectUserAgent  */
  this.opera_=null;

  /** @var Mozilla Firefox version. Detected in constructor by this.__detectUserAgent  */
  this.ff_=null;

  /** @var WebKit version. Detected in constructor by this.__detectUserAgent  */
  this.webkit_=null;
  
  /** @var Adobe AIR version. Detected in constructor by this.__detectUserAgent  */
  this.air_=null;

  /** @var User Agent Name string */
  this.uaName_=null;
  
  /** @var Unique User Agent Id string that contains name, version, build number ... separeted by tab. Usefull for userAgent specific optimisation coeff selection and generation */
  this.uaId_=null;
  
  /** @var Native XPath version. Detected in constructor */
  this.nativeXPath_= (document.evaluate!=null) ? -1 : null;
  
  /** @var Adobe Flash plugin version. Detected on demand. */
  this.flash_=null;
  
  this.__detectUserAgent();
};  

/**
  @fn get version of Internet Exploror
  @return version
*/
$jb.Nav.prototype._ie=function() { return this.ie_; };

/**
  @fn get version of Opera
  @return version
*/
$jb.Nav.prototype._opera=function() { return this.opera_; };

/**
  @fn get version of Mozilla Firefox
  @return version
*/
$jb.Nav.prototype._ff=function() { return this.ff_; };

/**
  @fn get version of WebKit
  @return version
*/
$jb.Nav.prototype._webkit=function() { return this.webkit_; };

/**
  @fn get version of Adobe AIR
  @return version
*/
$jb.Nav.prototype._air=function() { return this.air_; };

/**
  @fn get version of Native XPath
  @return version
*/
$jb.Nav.prototype._nativeXPath=function() { return this.nativeXPath_; };

/**
  @fn get version of XPath
  @return version
*/
$jb.Nav.prototype._xpath=function() { return (document.evaluate!=null) ? -1 : null; };

/**
  @fn get version of Adobe Flash plugin
  @return version
*/
$jb.Nav.prototype._flash=function()
{
  if(this.flash_)
    return this.flash_;
    
  if(this._ie() && window.ActiveXObject!=null)
  {
    var sw="ShockwaveFlash.ShockwaveFlash";
    
    try
    {
      var axo=new ActiveXObject(sw);
      var ver=axo.GetVariable("$version")+"";
      
      if(/ (\d+\,\d+)/.test(ver))
        this.flash_=($G.RegExp.$1+"").replace(",",".")-0;
    }
    catch(err)
    {
      this.flash_=null;
    }
  }
  else if(navigator.plugins && navigator.plugins["Shockwave Flash"])
  {
    var d=navigator.plugins["Shockwave Flash"].description;
    var n=navigator,ms,m;
    
    if(d!=null && !((ms=n.mimeTypes) && (m=ms["application/x-shockwave-flash"]) && !m.enabledPlugin))
    {
      d+="";
      
      if(/ (\d+\.\d+)/.test(d))
        this.flash_=$G.RegExp.$1-0;
    }  
  }
  
  return this.flash_;
};

/**
  @fn detect user agent
*/
$jb.Nav.prototype.__detectUserAgent=function()
{
  var t=$w.navigator.userAgent;

  if (typeof($w.navigator.mozIsLocallyAvailable)=="function")
  {
    if(/Firefox[\/\s](\d+\.\d+)/.test(t))
      this.ff_=$G.RegExp.$1-0;
    else
      this.ff_=-1;
      
    this.uaId_=(this.uaName_="Firefox")+"\t"+this.ff_;  
  }
  else if($w.opera && typeof($w.opera.version)=="function")
  {
    this.opera_=$w.opera.version()-0;
    this.uaId_=(this.uaName_="Opera")+"\t"+this.opera_;  
  }
  else if(typeof($w.WebKitPoint)=="function") /* for example */
  {
    if(/WebKit[\/\s](\d+\.\d+)/.test(t))
      this.webkit_=$G.RegExp.$1-0;
    else
      this.webkit_=-1;

    this.uaId_=(this.uaName_="WebKit")+"\t"+this.webkit_;  
  }
  else if("recalc" in $d)
  {
    if(/MSIE (\d+\.\d+);/.test(t))
      this.ie_=$G.RegExp.$1-0;
    else
      this.ie_=-1;

    this.uaId_=(this.uaName_="IE")+"\t"+this.ie_;  
  }
  
  if(/AdobeAIR\/(\d+\.\d+)/.test(t))
  {
    this.air_=$G.RegExp.$1-0;
  }
};

/**
  @fn get User Agent Name string
  @return User Agent Name string
*/
$jb.Nav.prototype._uaName=function()
{
  return this.uaName_;
};

/**
  @fn get User Agent Id string
  @return User Agent Id string
*/
$jb.Nav.prototype._uaId=function()
{
  return this.uaId_;
};


/** @var helper instance of $jb.Nav for all user agent specific scripts */
$jb.nav=new $jb.Nav();

});