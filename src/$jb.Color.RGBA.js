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
//_require("$jb/ext/string.js").
_willDeclared("$jb/$jb.Color.RGBA.js").
_completed(function($G, $jb){

/**@namespace $jb.Color contains color classes */
if($jb.Color == null)
  $jb.Color = {};

/**
  @class represent rgba color and allow operate with it, parse from string and stringify ti various form 
  @constructor allow create color by component ( first argument not string) or from string (first argument is string, second, optional, is alpha component with default = 1.0)
  @param r {Number} {Optional} red component of creating color or null for default value = 0 
  @param g {Number} {Optional} green component of creating color or null for default value = 0 
  @param b {Number} {Optional} blue component of creating color or null for default value = 0 
  @param a {Number} {Optional} alpha component of creating color or null for default value = 1.0
*/
$jb.Color.RGBA = function(r, g, b, a)
{
  if(typeof(r) == 'string')
  {
    this.a = (g != null) ? g : 1.0;
    this._fromString(r);
  }
  else
  {
    /**@var {Number} red component 0 - 255 @default 0*/
    this.r = r || 0;
    
    /**@var {Number} green component 0 - 255 @default 0*/
    this.g = g || 0;

    /**@var {Number} blue component 0 - 255 @default 0*/
    this.b = b || 0;
    
    /**@var {Number} alpha component 0 - 1.0 @default 1.0*/
    this.a = (a != null) ? a : 1.0;
  }  
};    
  
/** @alias */
var RGBAProto = $jb.Color.RGBA.prototype;
  
/**@var default epsilon for rgba color class instance */ 
RGBAProto.eps = 0.001;

/**@var default 1.0 - epsilon for rgba color class instance */ 
RGBAProto.oneSubEps = 1.0 - RGBAProto.eps;
  
/**@fn costum method to strict clone rgba color class instance */ 
RGBAProto._cloneStrict =
/**@fn costum method to strict copy rgba color class instance */ 
RGBAProto._copyStrict =
function()
{
  return new $jb.Color.RGBA(this.r, this.g, this.b, this.a);
};
  
/**
  @fn mul each component of color by number except alpha component <b>without clipping</b>
  @param n {Number} number to mul 
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._mulNumber = function(n)
{
  this.r *= n;
  this.g *= n;
  this.b *= n;
  
  //if(n>1.0)
  //  this._clipUp();
  
  return this;
};

/**
  @fn normalize each component of color by alpha component - mul on alpha component and set alpha component to 1.0 
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._normalizeAlpha = function()
{
  if(this.a == 1.0)
    return this;
  
  var a = this.a;
  
  this.r *= a;
  this.g *= a;
  this.b *= a;
  this.a = 1.0;
  
  return this;
};

/**
  @fn add another color, component by component without alpha component and clipping
  
  @param c {$jb.Color.RGBA || color string} color to add
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._addColor = function(c)
{
  //if(typeof(c) == 'string')
  //  c = new $jb.Color.RGBA(c);
  
  this.r += c.r;
  this.g += c.g;
  this.b += c.b;
  
  //this._clipUp();
  
  return this;
};

/**
  @fn add another color, component by component considering alpha component but without clipping
  
  @param c {$jb.Color.RGBA || color string} color to add
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._addColorA = function(c)
{
  //if(typeof(c) == 'string')
  //  c = new $jb.Color.RGBA(c);

  var coef = c.a/this.a;
  
  if(coef > this.oneSubEps)
  {
    this.r += c.r;
    this.g += c.g;
    this.b += c.b;
  }
  else
  {
    this.r += c.r*coef;
    this.g += c.g*coef;
    this.b += c.b*coef;
  }
  
  //this._clipUp();
  
  return this;
};

/**
  @fn blend with another color without clipping
  
  @param c {$jb.Color.RGBA || color string} color with which blend
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._blendWithColor = function(c)
{
  //if(typeof(c) == 'string')
  //  c = new $jb.Color.RGBA(c);

  if(this.a > this.oneSubEps)
    return this;

  var coef = this.a;
  
  this.r *= coef;
  this.g *= coef;
  this.b *= coef;

  coef = (1.0 - coef)*c.a;
  
  this.r += coef*c.r;
  this.g += coef*c.g;
  this.b += coef*c.b;
  
  this.a += coef;
  
  return this;
};


/**
  @fn clip color without alpha component
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._clipUp = function()
{
  if(this.r > 255.0)
    this.r = 255.0;
  if(this.g > 255.0)
    this.g = 255.0;
  if(this.b > 255.0)
    this.b = 255.0;
    
  return this;  
};

/**
  @fn clip color with alpha component
  
  @return {$jb.Color.RGBA} this
*/
RGBAProto._clipUpA = function()
{
  if(this.a > 1.0)
    this.a = 1.0;
  
  return this;
};

/**
  @fn convert color to hvs representation
  
  @source http://en.wikipedia.org/wiki/HSL_and_HSV
  
  @return {$jb.Color.HSVA} new hsva color
*/
RGBAProto._toHSVA = function()
{
  var r = this.r*0.003921568, // *1/255
    g = this.g*0.003921568, // *1/255
    b = this.b*0.003921568, // *1/255
    v = r,
    minC = r
    ;
  
  if(g > v)
    v = g;
  if(b > v)
    v = b;

  if(g < minC)
    minC = g;
  if(b < minC)
    minC = b;
    
  var dMaxMin = v - minC,
    s = (v < this.eps) ? 0.0: dMaxMin/v,
    h;

  switch(v)
  {
    case r:
      h = 0.16666*(g - b)/dMaxMin;
      break;
    case g:
      h = 0.3333 + 0.16666*(b - r)/dMaxMin;
      break;
    case b:
      h = 0.6666 + 0.16666*(r - g)/dMaxMin;
      break;
  }  

  if(h > 1.0)
    h -= 1.0;
  else if(h < 0.0)
    h += 1.0;
  
  return new $jb.Color.HSVA(2*Math.PI*h, s, v, this.a);  
};

/**
  @fn convert color to rgb(r,g,b) string
  
  @return {String} rgb(r,g,b) string
*/
RGBAProto._toRGBString = function()
{
  return 'rgb(' + (this.r|0) + ',' + (this.g|0) + ',' + (this.b|0) + ')';
};

/**
  @fn convert color to rgba(r,g,b,a) string
  
  @return {String} rgba(r,g,b,a) string
*/
RGBAProto._toRGBAString = function()
{
  return 'rgba(' + (this.r|0) + ',' + (this.g|0) + ',' + (this.b|0) + ',' + this.a + ')';
};

/**
  @fn convert color to #rrggbb hex string
  
  @return {String} #rrggbb hex string
*/
RGBAProto._toCSSString = function()
{
  return '#' + (this.r|256).toString(16).slice(1) + (this.g|256).toString(16).slice(1) + (this.b|256).toString(16).slice(1);
};

/**
  @fn convert color to #rrggbbaa hex string
  
  @return {String} #rrggbbaa hex string
*/
RGBAProto._toCSSAString = function()
{
  return '#' + (this.r|256).toString(16).slice(1) + (this.g|256).toString(16).slice(1) + (this.b|256).toString(16).slice(1) + ((255*this.a)|256).toString(16).slice(1);
};

/**
  @fn costum toString method which convert color to rgba(r,g,b,a) or rgb(r,g,b) string depend of alpha component value
  
  @return {String} rgba(r,g,b,a) or rgb(r,g,b) string
*/
RGBAProto.toString = function()
{
  if(this.a > this.oneSubEps)
    return this._toRGBString();
  else
    return this._toRGBAString();
};

(function()
{
  var _parseValue = function(t)
  {
    console.log(t);
    
    return (t.slice(-1) == '%') ? 2.55*t.slice(0, -1) : +t;
  };

  /**
    @fn parse color from any popular string representation of color i.e. rgb(r,g,b) rgba(r,g,b,a) #rgb #rrggbb #rrggbbaa and set all color components. Also hsv(h,s,v) hsva(h,s,v,a) with convertation to rgba if $jb.Color.HSVA class loaded
    
    @return {Boolean} parse success status 
  */
  RGBAProto._fromString = function(s)
  {
    // css color
    if(s.charAt(0) == '#')
    {
      switch(s.length)
      {
        // short version
        case 4:
          this.r = 0x11*('0x' + s.charAt(1));
          this.g = 0x11*('0x' + s.charAt(2));
          this.b = 0x11*('0x' + s.charAt(3));
          break;
        
        // long version
        case 7: 
        case 9:
          this.r = +('0x' + s.substr(1, 2));
          this.g = +('0x' + s.substr(3, 2));
          this.b = +('0x' + s.substr(5, 2));

          // css3 alpha support
          if(s.length == 9)
            this.a = 0.003921568*('0x' + s.substr(7, 2)); // 1/255*
      }
      
      return true;
    }
    
    var j = 0,
      endChar,
      _parseValueC = _parseValue;

    if(s.substr(0, 4) == 'rgb(')
    {  
      j = 3;
      endChar = ')';
    }
    else if(s.substr(0, 5) == 'rgba(')
    {
      j = 4;
      endChar = ',';
    }
    
    // canvas rgb
    if(j > 0)
    {
      this.r = _parseValueC(s.substring(++j, (j = s.indexOf(',', j))));
      this.g = _parseValueC(s.substring(++j, (j = s.indexOf(',', j))));
      this.b = _parseValueC(s.substring(++j, (j = s.indexOf(endChar, j))));
    }
    
    // canvas rgba
    if(endChar == ',')
      this.a = 0.003921568*_parseValueC(s.substring(++j, (j = s.indexOf(')', j)))); // 1/255*
    
    if(j > 0)
      return true;
    
    // try read as HSVA color
    
    if($jb.Color.HSVA == null)
      return false;
      
    var hsva = new $jb.Color.HSVA();
    
    if(hsva._fromString(s))
    {
      var rgba = hsva._toRGBA();
      
      this.r = rgba.r;
      this.g = rgba.g;
      this.b = rgba.b;
      this.a = rgba.a;
      
      return true;
    }
    
    return false;
  };
})();  
});