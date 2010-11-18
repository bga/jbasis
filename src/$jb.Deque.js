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
_require("$jb/OOP.js").
_require("$jb/$G.Array.js").
//_require("$jb/$G.Function.js").
//_require("$jb/$jb.EventTarget.DispatchProxy.js").
_willDeclared("$jb/$jb.Deque.js").
_completed(function($G, $jb){

$jb._defClass(
  {
    name: '$jb.HoledDeque', 

    _constructor: function()
    {
      this.items = {length: 0};
      this.lowerBound = 0;
      this.itemsCount = 0;
    },

    _indexOf: function(v)
    {
      return []._indexOf.call(this.items, v, this.lowerBound);
    },

    _delete: function(i)
    {
      //console.log(i, v, this.lowerBound);
      
      delete(this.items[i]);
      
      if(--this.itemsCount == 0)
      {
        this.lowerBound = this.items.length = this.itemsCount = 0;
        
        return;
      }

      switch(i)
      {
        case this.lowerBound:
          ++this.lowerBound;
          
          if(this._isNeedToOptimize())
          {
            var items = this.items;
            var lowerBound = this.lowerBound, upperBound = this.items.length; 
            
            while(lowerBound < upperBound && !items.hasOwnProperty(lowerBound))
            {
              ++lowerBound;
            }

            this.lowerBound = lowerBound;
          }
          
          break;
        
        case this.items.length - 1:
          --this.items.length;

          if(this._isNeedToOptimize())
          {
            var items = this.items;
            var lowerBound = this.lowerBound, upperBound = this.items.length - 1; 
          
            while(lowerBound <= upperBound && !items.hasOwnProperty(upperBound))
            {
              --upperBound;
            }

            this.items.length = upperBound + 1;
          }

          break;
      
        default:
      }
    },

    _push: function(v)
    {
      var p = this.items.length++;
      
      this.items[p] = v;
      ++this.itemsCount;

      return p;
    },

    _isNeedToOptimize: function()
    {
      return this.itemsCount < 0.5*(this.items.length - this.lowerBound);
    },

    _getItems: function()
    {
      return this.items;
    },

    _getUpperBound: function()
    {
      return this.items.length;
    },

    _getLowerBound: function()
    {
      return this.lowerBound;
    },
    
    _each: function(_fn)
    {
      if(this.lowerBound <)
        []._each.call(this.items)
    },

    _isEmpty: function()
    {
      return this.itemsCount <= 0;
    }
  }
); // class $jb.HoledDeque  
});

/*
var a = {length: 1000};

var i = 990; while(++i < 1000)
  a[i] = i;

//var i = 0; while((i += 2) < 1000)
//  a[i] = i;

var aL = a; 

var _fnL = function(v){ return 2*v };  

_speedTest(
  [
    function(n)
    {
      var a = aL, _fn = _fnL;
      
      var i = n; while(i--)
        [].map.call(a, _fn);
    },
    
    function(n)
    {
      var a = aL, _fn = _fnL;
      
      var i = n; while(i--)
      {
        var ret = [];
        var j = a.length; while(j--)
        {
          var v = ret[j];
          
          if(typeof(v) != 'undefined')
            ret[j] = _fn(v)
        }
      }  
    },
    
    function(n)
    {
      var a = aL, _fn = _fnL;
      
      var i = n; while(i--)
      {
        var ret = [];
        var j = a.length; while(j--)
        {
          if(a.hasOwnProperty(j))
            ret[j] = _fn(a[j])
        }
      }  
    },
    
    function(n)
    {
      var a = aL, _fn = _fnL;
      
      var i = n; while(i--)
      {
        var keys = Object.keys(a);
        var ret = [];
        var j = keys.length; while(j--)
        {
          var key = keys[j];
          
          ret[key] = _fn(a[key]);
        }
      }  
    }
  ],
  1000
);
*/
/*
chrome9
  0 x 0
    0: 277 ms
    1: 303 ms
    2: 438 ms
    3: 353 ms
    
  x x 0
    0: 403 ms
    1: 299 ms
    2: 425 ms
    3: 45 ms
*/