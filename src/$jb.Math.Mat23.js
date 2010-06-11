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
_willDeclared("$jb/$jb.Math.Mat23.js").
_completed(function($G, $jb){

if($jb.Math == null)
  $jb.Math = {};

var _sin = Math.sin, _cos = Math.cos, _tan = Math.tan;
  
$jb.Math.Mat23 = function(m11, m12, m21, m22, m13, m23)
{
  this.m11 = (m11 == null) ? 1 : m11;
  this.m12 = (m12 == null) ? 0 : m12;
  this.m21 = (m21 == null) ? 0 : m21;
  this.m22 = (m22 == null) ? 1 : m22;
  this.m13 = (m13 == null) ? 0 : m13;
  this.m23 = (m23 == null) ? 0 : m23;

  return this;
};

/* @alias */
var Mat23Proto = $jb.Math.Mat23.prototype;

Mat23Proto._identity = function(c)
{
  if(c == null)
    c = 1.0;
  
  this.m11 = this.m22 = c;
  this.m12 = this.m21 = this.m13 = this.m23 = 0;
  
  return this;
};

Mat23Proto._mulPoint = function(p)
{
  return {
    x: (p.x*this.m11 + p.y*this.m12 + this.m13),
    y: (p.x*this.m21 + p.y*this.m22 + this.m23)
  };
};
Mat23Proto._mulPointX = function(p)
{
  return p.x*this.m11 + p.y*this.m12 + this.m13;
};
Mat23Proto._mulPointY = function(p)
{
  return p.x*this.m21 + p.y*this.m22 + this.m23;
};
Mat23Proto._mulMat23 = function(a)
{
  return new $jb.Math.Mat23(
    this.m11*a.m11 + this.m12*a.m21,
    this.m11*a.m12 + this.m12*a.m22,
    this.m21*a.m11 + this.m22*a.m21,
    this.m21*a.m12 + this.m22*a.m22,
    this.m11*a.m13 + this.m12*a.m23 + this.m13,
    this.m21*a.m13 + this.m22*a.m23 + this.m23
  );    
};

Mat23Proto._rot = function(angle)
{
  this.m11 = this.m22 = _cos(angle);
  this.m12 = _sin(angle);
  this.m21 = -this.m12;
  
  return this;
};
Mat23Proto._rotSelf = function(angle)
{
  var a = _cos(angle), b = _sin(angle);
  
  var m11 = a*this.m11 - b*this.m12;
  var m12 = b*this.m11 + a*this.m12;
  
  this.m21 = a*this.m21 - b*this.m22;
  this.m22 = b*this.m21 + a*this.m22;
  
  this.m11 = m11;
  this.m12 = m12;
  
  return this;
};

Mat23Proto._scaleX = function(aspect)
{
  this.m11 = aspect;
  
  return this;
};
Mat23Proto._scaleXSelf = function(aspect)
{
  this.m11 *= aspect;
  this.m12 *= aspect;
  this.m13 *= aspect;
  
  return this;
};
Mat23Proto._scaleY = function(aspect)
{
  this.m22 = aspect;
  
  return this;
};
Mat23Proto._scaleYSelf = function(aspect)
{
  this.m21 *= aspect;
  this.m22 *= aspect;
  this.m23 *= aspect;
  
  return this;
};
Mat23Proto._scale = function(aspectX, aspectY)
{
  this.m11 = aspectX;
  this.m22 = (aspectY != null) ? aspectY : aspectX;
  
  return this;
};
Mat23Proto._scaleSelf = function(aspectX, aspectY)
{
  if(aspectY == null)
    aspectY = aspectX;
    
  this.m11 *= aspectX;
  this.m12 *= aspectX;
  this.m13 *= aspectX;

  this.m21 *= aspectY;
  this.m22 *= aspectY;
  this.m23 *= aspectY;
  
  return this;
};

Mat23Proto._shearX = function(aspect)
{
  this.m21 = aspect;
  
  return this;
};
Mat23Proto._shearXSelf = function(aspect)
{
  this.m11 += this.m12*aspect;
  this.m21 += this.m22*aspect;
  
  return this;
};
Mat23Proto._shearY = function(aspect)
{
  this.m12 = aspect;
  
  return this;
};
Mat23Proto._shearYSelf = function(aspect)
{
  this.m12 += this.m11*aspect;
  this.m22 += this.m21*aspect;
  
  return this;
};
Mat23Proto._shear = function(ax, ay)
{
  if(ay == null)
    ay = ax;

  this.m12 = ax;
  this.m21 = ay;
  
  return this;
};
Mat23Proto._shearSelf = function(ax, ay)
{
  if(ay == null)
    ay = ax;
  
  var m11 = this.m11 + this.m12*ax;
  var m21 = this.m21 + this.m22*ax;
  
  this.m12 += this.m11*ay;
  this.m22 += this.m21*ay;

  this.m11 = m11;
  this.m21 = m21;
  
  return this;
};

Mat23Proto._skewX = function(angle)
{
  this.m21 = _tan(angle);
  
  return this;
};
Mat23Proto._skewXSelf = function(angle)
{
  var a = _tan(angle);
  
  this.m11 += this.m12*a;
  this.m21 += this.m22*a;
  
  return this;
};
Mat23Proto._skewY = function(angle)
{
  this.m12 = _tan(angle);
  
  return this;
};
Mat23Proto._skewYSelf = function(angle)
{
  var a = _tan(angle);
  
  this.m12 += this.m11*a;
  this.m22 += this.m21*a;
  
  return this;
};
Mat23Proto._skew = function(angleX, angleY)
{
  var ax = _tan(angleX), ay;

  if(angleX == null)
    ay = ax;
  else
    ay = _tan(angleY);
    
  var m11 = this.m11 + this.m12*ax;
  var m21 = this.m21 + this.m22*ax;
  
  this.m12 += this.m11*ay;
  this.m22 += this.m21*ay;

  this.m11 = m11;
  this.m21 = m21;
  
  return this;
};

Mat23Proto._squeeze = function(n)
{
  this.m11 = n;
  this.m22 = 1.0/n;
  
  return this;
};
Mat23Proto._squeezeSelf = function(n)
{
  var invN = 1.0/n;

  this.m11 *= n;
  this.m12 *= n;
  this.m13 *= n;

  this.m21 *= invN;
  this.m22 *= invN;
  this.m23 *= invN;
  
  return this;
};

Mat23Proto._translateX = function(x)
{
  this.m13 = x;
  
  return this;
};
Mat23Proto._translateXSelf = function(x, y)
{
  this.m13 += x*this.m11;
  this.m23 += x*this.m21;
  
  return this;
};
Mat23Proto._translateY = function(y)
{
  this.m23 = y;
  
  return this;
};
Mat23Proto._translateYSelf = function(x, y)
{
  this.m13 += y*this.m12;
  this.m23 += y*this.m22;
  
  return this;
};
Mat23Proto._translate = function(x, y)
{
  this.m13 = x;
  this.m23 = y;
  
  return this;
};
Mat23Proto._translateSelf = function(x, y)
{
  this.m13 += x*this.m11 + y*this.m12;
  this.m23 += x*this.m21 + y*this.m22;
  
  return this;
};

Mat23Proto._set = function(m11, m12, m21, m22, m13, m23)
{
  this.m11 = m11;
  this.m12 = m12;
  this.m13 = m13;
  this.m21 = m21;
  this.m22 = m22;
  this.m23 = m23;
  
  return this;
};

Mat23Proto.toString = 
Mat23Proto._toStyleString = 
function()
{
  return 'matrix(' + this.m11 + ',' + this.m12 + ',' + this.m21 + ',' + this.m22 + ',' + this.m13 + ',' + this.m23 + ')';
};
/*
Mat23Proto._fromStyleString = 
function()
{
  
  return "matrix("+this.m11+","+this.m12+","+this.m21+","+this.m22+","++this.m13+","+this.m23+")";
};
*/

});