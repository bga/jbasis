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
 
  OOP functions for jbasis.
  
  javascript OOP in example:
  
  $G.MyClass = function(a, b)
  {
    this.c = a + b;
  };
  
  $G.MyClass.prototype._myMethod = function()
  {
    return c;
  };
  
  $G._test00 = function()
  {
    var myClass = new MyClass(1, 2);
    
    myClass._myMethod();
  };
  
  $G.MyStaticDerivedClass = function()
  {
    // call base class constructor
    MyBaseClass.apply(this, arguments);
    
    this.n = "abc";
  };
  
  $G.MyStaticDerivedClass._staticDeriveFrom($G.MyClass);
  
  $G.MyStaticDerivedClass.prototype._myNewMethod = function(m)
  {
    this.n += m;
     
    return m;
  };

  // derive from base MyClass class
  $G.MyStaticDerivedClass.prototype._myMethod = function()
  {
    // call base class version
    return MyClass.prototype._myMethod.call(this);
  };
  
  $G._test01 = function()
  {
    var myStaticDerivedClass = new MyStaticDerivedClass(1, 2);
    
    myStaticDerivedClass._myNewMethod("aaa");
    
    // derived version
    myStaticDerivedClass._myMethod("aaa");

    // base version
    MyClass.prototype._myMethod.call(myStaticDerivedClass, "aaa");
  };

  
  $G.MyProtoDerivedClass = function()
  {
    // call base class constructor
    MyBaseClass.apply(this, arguments);
    
    this.n = "abc";
  };
  
  $G.MyProtoDerivedClass._protoDeriveFrom($G.MyClass);
  
  $G.MyProtoDerivedClass.prototype._myNewMethod = function(m)
  {
    this.n -= m;
     
    return m;
  };

  // derive from base MyClass class
  $G.MyProtoDerivedClass.prototype._myMethod = function()
  {
    // call base class version
    MyClass.prototype._myMethod.call(this);
    
    // syntax sugar can be used
    this.constructor.superClass.prototype._myMethod.call(this);
    // or
    this.constructor.superProto._myMethod.call(this);
    
  };
  
  $G._test02 = function()
  {
    var myProtoDerivedClass = new MyProtoDerivedClass(1, 2);
    
    myProtoDerivedClass._myNewMethod("aaa");
    
    // derived version
    myProtoDerivedClass._myMethod("aaa");

    // base version
    MyClass.prototype._myMethod.call(myStaticDerivedClass, "aaa");
  };


  $G.MyDynamicDerivedClass = function(base0)
  {
    this._dynamicDeriveFrom(base0, "base0", "MyDynamicDerivedClass");
  };
  
  $G.MyDynamicDerivedClass.prototype._myMethod = function()
  {
    return 2 + this._baseClass("base0", "MyDynamicDerivedClass")._myMethod.call(this);
  };

  $G.MyDynamicDerivedClass.prototype._myNewMethod = function(m)
  {
    return "a" + m;
  };
  
  $G._test02 = function()
  {
    var myDynamicDerivedClassFromMyClass = new MyStaticDerivedClass(new MyClass(3, 4));
    
    // _myMethod was overwriten
    myDynamicDerivedClassFromMyClass._myMethod();
    
    // and base version
    myDynamicDerivedClassFromMyClass._baseClass("base0", "MyDynamicDerivedClass").
    _myMethod.call(myDynamicDerivedClassFromMyClass);
    
    // _myNewMethod was not overwriten
    myDynamicDerivedClassFromMyClass._myNewMethod();
    
    var myDynamicDerivedClassFromMyStaticDerivedClass = new MyDynamicDerivedClass(
      new MyStaticDerivedClass(5, 6); 
    );

    
    // _myMethod was overwriten
    myDynamicDerivedClassFromMyStaticDerivedClass._myMethod();
    
    // and base version
    myDynamicDerivedClassFromMyStaticDerivedClass._baseClass("base0", "MyDynamicDerivedClass").
    _myMethod.call(myDynamicDerivedClassFromMyStaticDerivedClass);

    
    // _myNewMethod also was overwriten
    myDynamicDerivedClassFromMyStaticDerivedClass._myNewMethod("4");
    
    // and base version
    myDynamicDerivedClassFromMyStaticDerivedClass._baseClass("base0", "MyDynamicDerivedClass").
    _myNewMethod.call(myDynamicDerivedClassFromMyStaticDerivedClass);
    
    var myDynamicDerivedClassFromObject =
    new MyDynamicDerivedClass(
      {d: 10, _myMethod:function() { return this.c + this.d + 1; }} 
    );

    // _myMethod was overwriten
    myDynamicDerivedClassFromObject._myMethod();
    // and base version
    myDynamicDerivedClassFromObject._baseClass("base0", "MyDynamicDerivedClass").
    _myMethod.call(myDynamicDerivedClassFromObject);

    // _myNewMethod was not overwriten
    myDynamicDerivedClassFromObject._myNewMethod("4");
  };
  
*/

$jb.Loader._scope().
_require('$jb/$G.Object.js').
_willDeclared("$jb/OOP.js").
_completed(function($G, $jb){

var Object = $G.Object, Function = $G.Function;

/**
  @fn extend this.prototype by _constuctor.prototype
  @param _constuctor constuctor from which prototype extend 
  @return this
*/
Function.prototype._staticDeriveFrom = function(_constuctor)
{
  var i, dpr = this.prototype, spr = _constuctor.prototype;
  
  if(Object.getPrototypeOf(dpr) === Object.getPrototypeOf(spr))
  {
    for(i in spr)
    {
      if(!(i in dpr))
        dpr[i] = spr[i];
    };
  }
  else
  {
    for(i in spr)
    {
      if(spr.hasOwnProperty(i) && !(i in dpr))
        dpr[i] = spr[i];
    };
  }
  
  return this;
};

Function.prototype._protoDeriveFrom = function(_constuctor)
{
  ((this.prototype = Object.create(_constuctor.prototype)).constructor = this).superClass = _constuctor;
  this.superProto = _constuctor.prototype;
  
  return this;
};

/**
  @fn extend this by baseObject and update system derivation map
  @param baseObject  base from which this extend 
  @param baseName full simbolic text name of base object. For example "$jb.Net.Base" or "_cl00()" (in case if base object has anonimous or generic class and passed by anonimous constructor) 
  @param derivedName full simbolic text name of derived(this) object.
  @return this
*/
Object.prototype._dynamicDeriveFrom = function(baseObject, baseName, derivedName)
{
  var jb, jbB;
  
  if((jb = this.jb_) == null)
    jb = this.jb_ = {};

  if((jbB = baseObject.jb_) == null)
    jbB = baseObject.jb_ = {};
    
  var thisBOMR = jb.baseObjMapRef,
    baseBOMR = baseObject.jb_ && baseObject.jb_.baseObjMapRef;
  
  if(thisBOMR == null && baseBOMR != null)
  {
    thisBOMR = jb.baseObjMapRef = baseBOMR;
  }
  else if(thisBOMR == null && baseBOMR == null)
  {
    thisBOMR = jb.baseObjMapRef = baseBOMR = jbB.baseObjMapRef = {};
    thisBOMR.baseObjMap = {};
  }
  else if(thisBOMR != null && baseBOMR != null)
  {
    var baseObjMap = baseBOMR.baseObjMap, thisObjMap = thisBOMR.baseObjMap,
      lastNode = thisObjMap.lastNode;
    
    for(var i in baseObjMap)
    {
      if(!(i in thisObjMap) && baseObjMap.hasOwnProperty(i))
        lastNode = thisObjMap[i] = {obj: baseObjMap[i].obj, prevNode: lastNode};
    }
    
    thisObjMap.lastNode = lastNode;
    
    delete baseBOMR.baseObjMap;
    baseBOMR.baseObjMap = thisBOMR.baseObjMap;
  }
  
  var bpr = baseObject.constructor.prototype;
  
  thisBOMR.baseObjMap.lastNode = thisBOMR.baseObjMap[baseName + ' ' + derivedName] =
  {prevNode: thisBOMR.baseObjMap.lastNode, obj: bpr};
  
  for(var i in baseObject)
  {
    if(!(i in this) && (baseObject.hasOwnProperty(i) || bpr.hasOwnProperty(i)))
      this[i] = baseObject[i];
  };
  
  return this;
};

/**
  @fn find base object prototype in system derive map by base object and derived object full simbolic text names. 
 
  @desc this function usefull for anonimous derivation when you know only "_cl00()" as constructor name. Function lookup object prototype by given pair (baseName,derivedName). Keep in mind that you can simple call base object function as MyBaseClass.prototype._hello.call(this,"Hello!") if you know your MyBaseClass. To know is it, you can use this._hasBaseClass(MyBaseClass) to test that fact. 

  @param baseName full simbolic text name of base object
  @param derivedName full simbolic text name of derived object
  @return base object prototype or null
*/
Object.prototype._baseClass = function(baseName, derivedName)
{
  var jb, b;
  
  return (jb = this.jb_) && (b = jb.baseObjMapRef) && b.baseObjMap[baseName + ' ' + derivedName].obj;
};

/**
  @fn test if system derivation map contains given constructor
  @param _con constructor to test
  @return true if finded else false
*/
Object.prototype._hasBaseClass = function(_con)
{
  if(this.constructor === _con)
    return true;
  
  var pr = _con.prototype,
    i = this.jb_ && this.jb_.baseObjMapRef && this.jb_.baseObjMapRef.baseObjMap &&
      this.jb_.baseObjMapRef.baseObjMap.lastNode;
  
  while(i != null && i.obj !== pr)
    i = i.prevNode;
  
  return i != null;
};

});
