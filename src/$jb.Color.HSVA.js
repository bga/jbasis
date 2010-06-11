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
//_require("$jb/ext/number.js").
_willDeclared("$jb/$jb.Color.HSVA.js").
_completed(function($G, $jb){

if($jb.Color == null)
  $jb.Color = {};

/** @alias */
var Color = $jb.Color;

Color.HSVA = function(h, s, v, a)
{
  this.h = h; // 0.0-2pi
  this.s = s; // 0.0-1.0
  this.v = v; // 0.0-1.0
  this.a = a || 1.0; // 0.0-1.0
};  

/** @alias */
var HSVAProto = Color.HSVA.prototype;

HSVAProto.eps = 0.0001;
HSVAProto.oneSubEps = 1.0 - HSVAProto.eps;


// @source http://www.tecgraf.puc-rio.br/~mgattass/color/HSVtoRGB.htm
HSVAProto._toRGBA = function()
{
  var s = this.s, v = 255*this.v;
  
  if(s < this.eps) 
  {
    return new RGBA(v, v, v, this.a);
  }
  else
  {
    var var_h = this.h*0.9549296, // *6/(2*pi)
      var_i = var_h|0
      //var_1 = v*(1 - s),
      //var_2 = v*(1 - s*(var_h - var_i)),
      //var_3 = v*(1 - s*(1 - (var_h - var_i)))
      ;

    switch(var_i)
    {
      case 0:
        return new Color.RGBA(
          v,
          v*(1 - s*(1 - (var_h - var_i))),
          v*(1 - s),
          this.a
        );
      
      case 1:
        return new Color.RGBA(
          v*(1 - s*(var_h - var_i)),
          v, 
          v*(1 - s), 
          this.a
        );
      
      case 2: 
        return new Color.RGBA(
          v*(1 - s), 
          v, 
          v*(1 - s*(1 - (var_h - var_i))), 
          this.a
        );
      
      case 3: 
        return new Color.RGBA(
          v*(1 - s), 
          v*(1 - s*(var_h - var_i)), 
          v, 
          this.a
        );
    
      case 4: 
        return new Color.RGBA(
          v*(1 - s*(1 - (var_h - var_i))), 
          v*(1 - s), 
          v, 
          this.a
        );
      
      case 5: 
        return new Color.RGBA(
          v, 
          v*(1 - s), 
          v*(1 - s*(var_h - var_i)), 
          this.a
        );
    }
  }
};

(function()
{
  var pi = Math.PI;
  var _parseHueE = function(t)
  {
    if(t.slice(-3) == 'deg')
      return 0.0174532*t.slice(0, -3) // 2*Math.PI/360;
    if(t.slice(-2) == 'pi')
      return (t.length == 2) ? pi : pi*t.slice(0, -2);
    else
      return +t;
  }
  var _parseSOrV = function(t)
  {
    return (t.slice(-1) == '%') ? 0.01*t.slice(0, -1) : +t;
  };

  HSVAProto._fromString = function(s)
  {
    var j = 0,
      endChar,
      _parseSOrVC = _parseSOrV;
    
    if(s.substr(0, 4) === "hsv(")
    {  
      j = 3;
      endChar = ')';
    }
    else if(s.substr(0, 5) === "hsva(")
    {
      j = 4;
      endChar = ',';
    }  

    // my hsv format
    if(j > 0)
    {
      this.h = _parseHue(s.substring(++j, (j = s.indexOf(',', j))));
      this.s = _parseSOrVC(s.substring(++j, (j = s.indexOf(',', j))));
      this.v = _parseSOrVC(s.substring(++j, (j = s.indexOf(endChar, j))));
    }
    
    // my hsva format
    if(endChar == ',')
    {
      this.a = _parseSOrVC(s.substring(++j, (j = s.indexOf(')', j))))
    }
    
    if(j > 0)
      return true;
    
    if(Color.RGBA == null)
      return false;
      
    var rgba = new Color.RGBA();
    
    if(rgba._fromString(s))
    {
      var hsva = hsva._toHSVA();
      
      this.h = hsva.h;
      this.s = hsva.s;
      this.v = hsva.v;
      this.a = hsva.a;
      
      return true;
    }
    
    return false;
  };
})();

HSVAProto._toHSVString = function()
{
  return 'hsv(' + ((this.h*57.2957)|0) + 'deg,' + ((this.s*100)|0) + '%,' + ((this.v*100)|0) + '%)';
};
HSVAProto._toHSVAString = function()
{
  return 'hsva(' + ((this.h*57.2957)|0) + 'deg,' + ((this.s*100)|0) + '%,' + ((this.v*100)|0) + '%,' + this.a + ')';
};
HSVAProto.toString = function()
{
  if(a > this.oneSubEps)
    return this._toHSVString();
  else
    return this._toHSVAString();
};

});