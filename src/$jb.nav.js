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
_completed(function($G, $jb){

var $w = $G.$w, navigator = $w.navigator, RegExp = $G.RegExp;

/**
  @class detector of user agent class and traits
  @brief version is a positive float number(9.5) if can detect, -1 if feature present but version can not detected, else null
*/
$jb.Nav = function()
{
  /** @var Internet Exploror version. Detected in constructor by this.__detectUserAgent */
  this.ie_;
  
  /** @var Opera version. Detected in constructor by this.__detectUserAgent  */
  this.opera_;

  /** @var Mozilla Firefox version. Detected in constructor by this.__detectUserAgent  */
  this.ff_;

  /** @var WebKit version. Detected in constructor by this.__detectUserAgent  */
  this.webkit_;
  
  /** @var Adobe AIR version. Detected in constructor by this.__detectUserAgent  */
  this.air_;

  /** @var User Agent Name string */
  this.uaName_;
  
  /** @var Unique User Agent Id string that contains name, version, build number ... separeted by tab. Usefull for userAgent specific optimisation coeff selection and generation */
  this.uaId_;
  
  /** @var Native XPath version. Detected in constructor */
  this.nativeXPath_ = ('evaluate' in $d) ? -1 : null;
  
  /** @var Adobe Flash plugin version. Detected on demand. */
  this.flash_;
  
  this.__detectUserAgent();
};  

/** @alias */
var NavProto = $jb.Nav.prototype;

/**
  @fn get version of Internet Exploror
  @return version
*/
NavProto._ie = function() { return this.ie_; };

/**
  @fn get version of Opera
  @return version
*/
NavProto._opera = function() { return this.opera_; };

/**
  @fn get version of Mozilla Firefox
  @return version
*/
NavProto._ff = function() { return this.ff_; };

/**
  @fn get version of WebKit
  @return version
*/
NavProto._webkit = function() { return this.webkit_; };

/**
  @fn get version of Adobe AIR
  @return version
*/
NavProto._air = function() { return this.air_; };

/**
  @fn get version of Native XPath
  @return version
*/
NavProto._nativeXPath = function() { return this.nativeXPath_; };

/**
  @fn get version of XPath
  @return version
*/
NavProto._xpath = function() { return ($d.evaluate != null) ? -1 : null; };

/**
  @fn get version of Adobe Flash plugin
  @return version
*/
NavProto._flash = function()
{
  if(this.flash_)
    return this.flash_;
    
  if(this._ie() && $w.ActiveXObject != null)
  {
    var sw = 'ShockwaveFlash.ShockwaveFlash';
    
    try
    {
      var axo = new ActiveXObject(sw),
        ver = '' + axo.GetVariable('$version');
      
      if(/ (\d+\,\d+)/.test(ver))
        this.flash_ = +RegExp.$1.replace(',', '.');
    }
    catch(err)
    {
      this.flash_ = null;
    }
  }
  else if(navigator.plugins && navigator.plugins['Shockwave Flash'])
  {
    var n = navigator, d = n.plugins['Shockwave Flash'].description,
       ms, m;
    
    if(d != null && !((ms = n.mimeTypes) && (m = ms['application/x-shockwave-flash']) && !m.enabledPlugin))
    {
      d += '';
      
      if(/ (\d+\.\d+)/.test(d))
        this.flash_ = +RegExp.$1;
    }  
  }
  
  return this.flash_;
};

/**
  @fn detect user agent
*/
NavProto.__detectUserAgent = function()
{
  var t = $w.navigator.userAgent;

  if (typeof($w.navigator.mozIsLocallyAvailable) === 'function')
  {
    if(/Firefox[\/\s](\d+\.\d+)/.test(t))
      this.ff_ = +RegExp.$1;
    else
      this.ff_ = -1;
      
    this.uaId_ = (this.uaName_ = 'Firefox') + '\t' + this.ff_;  
  }
  else if($w.opera && typeof($w.opera.version) === 'function')
  {
    this.opera_ = +$w.opera.version();
    this.uaId_ = (this.uaName_ = 'Opera') + '\t' + this.opera_;  
  }
  else if(typeof($w.WebKitPoint) === 'function') /* for example */
  {
    if(/WebKit[\/\s](\d+\.\d+)/.test(t))
      this.webkit_ = +RegExp.$1;
    else
      this.webkit_ = -1;

    this.uaId_ = (this.uaName_ = 'WebKit') + '\t' + this.webkit_;  
  }
  else if('recalc' in $d)
  {
    if(/MSIE (\d+\.\d+);/.test(t))
      this.ie_ = +RegExp.$1;
    else
      this.ie_ = -1;

    this.uaId_ = (this.uaName_ = 'IE') + '\t' + this.ie_;  
  }
  
  if(/AdobeAIR\/(\d+\.\d+)/.test(t))
  {
    this.air_ = +RegExp.$1;
  }
};

/**
  @fn get User Agent Name string
  @return User Agent Name string
*/
NavProto._uaName = function()
{
  return this.uaName_;
};

/**
  @fn get User Agent Id string
  @return User Agent Id string
*/
NavProto._uaId = function()
{
  return this.uaId_;
};


/** @var helper instance of $jb.Nav for all user agent specific scripts */
$jb.nav = new $jb.Nav();

});