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

(function($G)
{
  var NativeString = $G.String, NativeStringProto = NativeString.prototype;
  var _objectClass = $G.Object.prototype.toString, 
    _objectIsPrototypeOf = $G.Object.prototype.isPrototypeOf;
  
  /*
  $jb.Deploy._defConst('String.jbCopyingSliceThreshold',
    $jb.Optimize._calcPairSplitPoint(
      {  
        methodMap:
        {
          '_ncSlice': function(c, strL)
          {
            strL._ncSlice(0, c);
          },
          'slice': function(c, strL)
          {
            strL.slice(0, c);
          }
        },
        unitMap:
        {
          'c':
          {
            _gen: function(n)
            {
              return [n, undefined];
            }
          }
        }
      },
      {
        method1: '_ncSlice',
        method2: 'slice',
        unit: 'c',
        unitMin: 1,
        unitMax: 100000,
        args: [undefined, '1'._jbMulNumber(100000)]
      }  
    )
  );
  */  

  var copyThreshold = -1; // for test
  //var copyThreshold = $jb.Deploy._const('String.jbCopyingSliceThreshold');
  //var copyThreshold = 20500;
  
  if(document.recalc) // IE
    copyThreshold = 20500; // experimental value
  else
    copyThreshold = 0;

  /*#if String.jbCopyingSliceThreshold < 10 */
  if(/*false && */copyThreshold < 10)
  {
    NativeStringProto._ncSlice = NativeStringProto.slice;
    NativeStringProto._ncSubstring = NativeStringProto.substring;
    NativeStringProto._ncSubstr = NativeStringProto.substr;
    NativeString._isNCString = function(str)
    {
      return false;
    };
    
    return;
  }
  /*else*/

  NativeString._isNCString = function(str)
  {
    return str.isPrototypeOf.begin_ != null;
  };
  
  var TypeError = $G.TypeError;
  
  var _oldStringCharAt = NativeStringProto.charAt,
    _oldStringCharCodeAt = NativeStringProto.charCodeAt,
    
    _oldStringSlice = NativeStringProto.slice,
    _oldStringSubstr = NativeStringProto.substr,
    _oldStringSubstring = NativeStringProto.substring,
    
    _oldStringIndexOf = NativeStringProto.indexOf,
    _oldStringLastIndexOf = NativeStringProto.lastIndexOf,
    
    _oldStringValueOf = NativeStringProto.valueOf,
    _oldStringToString = NativeStringProto.toString;
  
  
  var NCString = function(s/*, begin, end*/)
  {
    // uses to hide private data. IE DontEnum bug sometimes very helpfull
    var data = this.isPrototypeOf = function()
    {
      return _objectIsPrototypeOf.call(this);
    };
    
    data.s_ = s;
    
    if(arguments.length != 3)
    {
      data.begin_ = 0;
      this.length = data.end_ = s.length;
    }
    else
    {
      data.begin_ = arguments[1];
      data.end_ = arguments[2];
      this.length = arguments[2] - arguments[1];
    }
    
    //data.subS_;
  };
  
  var NCStringProto = NCString.prototype = new NativeString();
  
  NCStringProto.constructor = NativeString; // ???
  NCString.fromCharCode = NativeString.fromCharCode;
  
  /*
  NCString.toString = function()
  {  
    return 'function String() { [native code] }';
  };
  */

  NCStringProto.valueOf = function()
  {
    // ecma5 allow pass primitive strings to valueOf via call/apply
    if(/*#if ecma5*/typeof(this) == 'string' || /*#endif*/ _objectClass.call(this) == '[object String]')
    {
      return this;
    }
    else if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;
      
      if(data.subS_ != null)
        return data.subS_;
      else  
        return (data.subS_ = data.s_.substring(data.begin_, data.end_));
    }

    return _oldStringValueOf.call(this);
  };
  NCStringProto.toString = function()
  {
    // ecma5 allow pass primitive strings to toString via call/apply
    if(/*#if ecma5*/typeof(this) == 'string' || /*#endif*/ _objectClass.call(this) == '[object String]')
    {
      return this;
    }
    else if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;
      
      if(data.subS_ != null)
        return data.subS_;
      else  
        return (data.subS_ = data.s_.substring(data.begin_, data.end_));
    }
      
    return _oldStringToString.call(this);
  };
  
  /*#if String.jbNativeDirectCharAccess */
  if(('1')[0] === '1')
  {
    NCStringProto.charAt = function(pos)
    {
      if(this.isPrototypeOf.begin_ != null)
      {
        var data = this.isPrototypeOf;

        if(pos >= 0 && (pos += data.begin_) < data.end_)
          return data.s_[pos];
        else
          return '';
      }
      
      return _oldStringCharAt.call(this, pos);
    };
  }
  else /*#else*/
  {
    NCStringProto.charAt = function(pos)
    {
      if(this.isPrototypeOf.begin_ != null)
      {
        var data = this.isPrototypeOf;

        if(pos >= 0 && (pos += data.begin_) < data.end_)
          return data.s_.charAt(pos);
        else
          return '';
      }
      
      return _oldStringCharAt.call(this, pos);
    };
  }
  /*#endif*/  

  NCStringProto.charCodeAt = function(pos)
  {
    if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;

      if(pos >= 0 && (pos += data.begin_) < data.end_)
        return data.s_.charCodeAt(pos);
      else
        return NaN;
    }
    
    return _oldStringCharCodeAt.call(this, pos);
  };

  NCStringProto._ncSlice = NCStringProto.slice = function(b, e)
  {
    if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;
      var begin = data.begin_, end = data.end_;
      
      if(b == null)
      {  
        b = begin;
      }
      else if(b >= 0)
      {  
        if((b += begin) >= end)
          return '';
      }
      else if((b += end) < begin)
      {    
        b = begin;
      }
      
      if(e == null)
      {  
        e = end;
      }
      else if(e >= 0)
      {  
        if((e += begin) >= end)
          e = end;
      }
      else if((e += end) < begin)
      {    
        return '';
      }
      
      var len = e - b;
      
      if(len <= 0)
        return '';
      else if(len < copyThreshold)  
        return data.s_.substr(b, len);
      else  
        return new NCString(data.s_, b, e);
    }
    
    return _oldStringSlice.call(this, b, e);
  };

  NCStringProto._ncSubstring = NCStringProto.substring = function(b, e)
  {
    if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;
      var begin = data.begin_, end = data.end_;
      
      if(b == null)
        b = begin;
      else if(b < 0)
        b = begin;
      else if ((b += begin) >= end)
        b = end;
      
      if(e == null)
        e = end;
      else if(e < 0)
        e = begin;
      else if ((e += begin) >= end)
        e = end;
      
      if(b >= e)
      {
        var temp = b;
        b = e;
        e = temp;
      }
      
      var len = e - b;
      
      if(len == 0)
        return '';
      else if(len < copyThreshold)  
        return data.s_.substr(b, len);
      else  
        return new NCString(data.s_, b, e);
    }    
    
    return _oldStringSubstring.call(this, b, e);
  };

  NCStringProto._ncSubstr = NCStringProto.substr = function(b, len)
  {
    if(this.isPrototypeOf.begin_ != null)
    {
      if(len < 0 || len === 0)
        return '';
      
      var data = this.isPrototypeOf;
      var begin = data.begin_, end = data.end_;

      if(len < copyThreshold || end < copyThreshold)
        return this.substr(b, len);
      
      if(b == null)
      {  
        b = begin;
      }
      else if(b < 0)
      {  
        if((b += end) < begin)
          b = begin;
      }
      else
      {
        if((b += begin) >= end)
          return '';
      }
      
      if(len == null || (len += b) >= end)
        len = end;
      
      if(len < copyThreshold)
        return data.s_.substring(b, len);
      else
        return new NCString(data.s_, b, len); 
    }

    return _oldStringSubstr.call(this, b, len);
  };
  
  NCStringProto.indexOf = function(str/*, b*/)
  {
    var b = arguments[1];
    
    if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;

      if(data.subS_ != null)
        return data.subS_.indexOf(str, b);

      var p, begin = data.begin_;
      
      if(b == null)
      {  
        b = begin;
      }
      else if(b >= 0)
      {  
        if((b += begin) >= data.end_)
          b = data.end_;
      }
      //else if((b += data.end_) < begin) // :(
      else if(b < 0)
      {    
        b = begin;
      }
        
      if((p = data.s_.indexOf(str, b)) < 0 || p >= data.end_)
        return -1;
      
      return p - begin;
    }

    return _oldStringIndexOf.call(this, str, b);  
  };
  
  NCStringProto.lastIndexOf = function(str/*, b*/)
  {
    var b = arguments[1];

    if(this.isPrototypeOf.begin_ != null)
    {
      var data = this.isPrototypeOf;

      if(data.subS_ != null)
        return data.subS_.lastIndexOf(str, b);

      var p, begin = data.begin_;
      
      if(b == null)
      {  
        b = data.end_ - 1;
      }
      else if(b >= 0)
      {  
        if((b += begin) >= data.end_)
          b = data.end_ - 1;
      }
      //else if((b += data.end_) < begin) // :(
      else if(b < 0)
      {    
        b = begin;
      }
      
      if((p = data.s_.lastIndexOf(str, b)) < begin)
        return -1;
      
      return p - begin;
    }
    
    return _oldStringLastIndexOf.call(this, str, b);
  };
  
  NativeStringProto._ncSlice = function(b, e)
  {
    var end = this.length;

    if(end < copyThreshold)
      return this.slice(b, e);
    
    if(b == null)
    {  
      b = 0;
    }
    else if(b < 0)
    {  
      if((b += end) < 0)
        b = 0;
    }
    else
    {
      if(b >= end)
        return '';
    }
    
    if(e == null)
    {  
      e = end;
    }
    else if(e < 0)
    {  
      if((e += end) < 0)
        return '';
    }
    else
    {
      if(e >= end)
        e = end;
    }
    
    var len = e - b;
    
    if(len <= 0)
    {
      return '';
    }
    if(len < copyThreshold)
    {
      return this.substr(b, len);
    }
    else
    {
      return new NCString('' + this, b, e);
    }  
  };

  NativeStringProto._ncSubstring = function(b, e)
  {
    var end = this.length;

    if(end < copyThreshold)
      return this.substring(b, e);
    
    if(b == null)
      b = 0;
    else if(b < 0)
      b = 0;
    else if (b >= end)
      b = end;
    
    if(e == null)
      e = end;
    else if(e < 0)
      e = 0;
    else if (e >= end)
      e = end;
    
    if(b >= e)
    {
      var temp = b;
      b = e;
      e = temp;
    }
    
    var len = e - b;
    
    if(len == 0)
      return '';
    if(len < copyThreshold)
      return this.substr(b, len);
    else
      return new NCString('' + this, b, e);
  };

  NativeStringProto._ncSubstr = function(b, len)
  {
    if(len < 0 || len === 0)
      return '';
    
    var end = this.length;

    if(len < copyThreshold || end < copyThreshold)
      return this.substr(b, len);
    
    if(b == null)
    {  
      b = 0;
    }
    else if(b < 0)
    {  
      if((b += end) < 0)
        b = 0;
    }
    else
    {
      if(b >= end)
        return '';
    }
    
    if(len == null || (len += b) >= end)
      len = end;
      
    if(len < copyThreshold)  
      return this.substring(b, len);
    else
      return new NCString('' + this, b, len);
  };
  
  /*#endif*/
})(this);
