/**
  @file
  @author  Fyodorov "bga" Alexander <bga.email@gmail.com>
 
  @section LICENSE
 
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
//_require("$jb/$G.Function.js").
_require("$jb/$G.String.js"). // ._escapeForRegExp _escapeForRegExpReplace .trim .trimLeft .trimRight
//_require("$jb/$G.Number.js"). // ._fixupIntToUIntBug
_require("$jb/$jb.JSParser.js"). // ._fMatchExpr
_willDeclared("$jb/$jb.Preprocessor.js").
_completed(function($G, $jb){

var argsSplitRE = /,\s*/;

$jb._namespace('$jb.Preprocessor');

$jb._defClass(
{
  name: '$jb.Preprocessor.Macros',
  
  _constructor: function(signature, expr)
  {
    if(signature != null)
    {
      this._setSignature(signature);
    }
    else
    {
      this.name_ = null;
      this.match_ = null;
      this.indexes_ = null;
    }
    
    if(expr != null)
      this._setExpr(expr);
    else  
      this.expr_ = null;
  },
  
  _getMacrosType: function()
  {
    if(this.args_ != null)
    {
      if(typeof(this.expr_) == 'function')
        return $jb.Preprocessor.Macros.MacrosType.NATIVE_FN;
      else
        return $jb.Preprocessor.Macros.MacrosType.TEXT_FN;
    }
    else
    {
      return $jb.Preprocessor.Macros.MacrosType.TEXT_REPLACE;
    }
    
    return $jb.Preprocessor.Macros.MacrosType.UNKNOWN;
  },

  _copy: function()
  {
    var m = new $jb.Preprocessor.Macros();
    
    m.signature_ = this.signature_;
    m.name_ = this.name_;
    m.match_ = this.match_;
    m.args_ = this.args_ && this.args_.slice(0);
    m.indexes_ = this.indexes_ && this.indexes_.slice(0);

    return m;
  },

  _clone: function()
  {
    var m = new $jb.Preprocessor.Macros();
    
    m.signature_ = this.signature_;
    m.name_ = this.name_;
    m.match_ = this.match_;
    m.args_ = this.args_ && this.args_.slice(0);
    m.indexes_ = this.indexes_ && this.indexes_.slice(0);

    return m;
  },
  
  __argsToIndexes: function(args)
  {
    var i = args.length
      , indexes = new Array.U32(i);
    
    while(i--)
      indexes[i] = i;
    
    indexes.sort(function(a, b){ return args[b].length - args[a].length; });
    
    //console.log(args);
    //console.log(indexes);
    return indexes;
  },

  __argsToArgMatches: function(args)
  {
    var i = args.length;
    
    while(i--)
      args[i] = new RegExp(args[i]._escapeForRegExp(), 'g');
    
    return args;
  },
  
  _setSignature: function(signature)
  {
    var i = signature.indexOf('(');
    
    this.signature_ = signature;

    if(i < 0)
    {  
      this.name_ = signature;
      this.nameRE_ = new RegExp(signature._escapeForRegExp(), 'g');
      this.args_ = null;
      this.indexes_ = null;
    }
    else
    {
      var args = signature.slice(i + 1, signature.lastIndexOf(')')).trim().split(argsSplitRE) 
        , indexes = this.__argsToIndexes(args);
        
      this.__argsToArgMatches(args);
      
      this.name_ = signature.slice(0, i);
      this.args_ = args;
      this.indexes_ = indexes;
    }
  },

  _getSignature: function()
  {
    return this.signature_;
  },
  
  _getName: function()
  {
    return this.name_;
  },
  
  _setExpr: function(expr)
  {
    this.expr_ = expr;
  },
  
  _getExpr: function()
  {
    return this.expr_;
  }
}); // class $jb.Preprocessor.Macros  

$jb._defEnum('$jb.Preprocessor.Macros.MacrosType',
{
  UNKNOWN: 0,  
  TEXT_REPLACE: 1,  
  TEXT_FN: 2,  
  NATIVE_FN: 3
});  


$jb._defClass(
{
  name: '$jb.Preprocessor.MacrosGroup',
  
  _constructor: function()
  {
    this.macroses = [];
  },
  
  __lookupMacrosByName: function(name)
  {
    var ms = this.macroses, msI = -1, m;
      
    while((m = ms[++msI]))
    {
      if(m._getName() == name)
        break;
    }  
      
    return (m) ? i : -1; 
  },
  
  _sortMacrosesByName: function()
  {
    this.macroses.sort(function(a, b){ return 2*(b._getName() > a._getName()) - 1; });
  },

  _sortMacrosesByNameLength: function()
  {
    this.macroses.sort(function(a, b){ return b._getName().length - a._getName().length; });
  },

  _def: function(signatureArg, exprArg)
  {
    var name;
    
    if(signatureArg instanceof $jb.Preprocessor.Macros)
      name = signatureArg._getName();
    else
      name = signatureArg.slice(0, signatureArg.indexOf('(') >>> 0);
    
    if(this.__lookupMacrosByName(name) < 0)
    {  
      var macros;
      
      if(signatureArg instanceof $jb.Preprocessor.Macros)
        macros = signatureArg;
      else
        macros = new $jb.Preprocessor.Macros(signatureArg, exprArg);
      
      this.macroses.push(macros);
    }
    
    return this;
  },

  _import: function(mg)
  {
    var extraMacroses = mg.macroses, i = extraMacroses.length;
    var macroses = this.macroses, j = macroses.length;
    
    while(i--)
      macroses[j++] = extraMacroses[i];
    
    this.macroses.sort(function(a, b){ return 2*(b._getName() > a._getName()) - 1; });
    this.macroses._sub()._uniqueSelf(function(a, b){ return b._getName() != a._getName(); });
    
    return this;
  };
  
  _undef: function(name)
  {
    name = name.slice(0, name.indexOf('(') >>> 0);
    
    var i = this.__lookupMacrosByName(name); 

    if(i > -1)
      this.macroses.splice(i, 1);
  },
  
  _copy: function()
  {
    var mg = new $jb.Preprocessor.MacrosGroup();
    
    mg.macroses = this.macroses.slice(0);
  
    return mg;
  },

  _clone: function()
  {
    var mg = new $jb.Preprocessor.MacrosGroup();
    var macroses = this.macroses, i = macroses.length;
    var newMacroses = new Array(i);
    
    while(i--)
      newMacroses[i] = macroses[i]._cloneStrict();
    
    mg.macroses = this.macroses.slice(0);
  
    return mg;
  }
}; // class $jb.Preprocessor.MacrosGroup  

$jb._defEnum(
  '$jb.Preprocessor.MacrosGroup.MacrosesSortOrder',
  {
    UNKNOWN: 0,
    BY_NAME: 1,
    BY_NAME_LENGTH: 2
  }
);  

var _matchArg = $jb.JSParser._fMatchExpr([',']);

$jb.Preprocessor._pass = function(s, mgs)
{
  var dsm = this.definesMap,
    groups = [], groupsI,
    dsI, ds, d, name,
    out, p, op,
    argMatches, aI, aLen, argMatch, match, expr, exprs = [], indexes, temp,
    __matchArgC = this.__matchArg
    ;
    
  if(groups.length < 1)
    return this;
  
  groupsI = -1;
  p = groupNames.length; while(p--)
  {  
    if((name = groupNames[p]) in dsm)
      groups[++groupsI] = dsm[name];
  }

  this.__sortDefines(groups);
  
  //console.log(this.defineFns);
  
  
  do
  {
    groupsI = -1; lblMainLoop: while(ds = groups[++groupsI])
    {
      dsI = -1; while((d = ds[++dsI]))
      {
        if((p = s.indexOf((name = d.name))) < 0)
          continue;
        
        // defFn
        if((argMatches = d.argMatches))
        {
          op = 0, out = '';
        
          do
          {
            out += s.slice(op, p);
            p = s.indexOf('(', p + name.length) + 1;
            
            aI = -1; aLen = argMatches.length;
            expr = d.expr;
            exprs.length = aLen;
            
            while(
              s.charAt(p - 1) != ')' &&
              ++aI < aLen &&
              (p = __matchArgC(s, (op = p))) != 4294967295
            )
            {
              exprs[aI] = s.slice(op, p++).trim();
            }  
            //expr = expr.replace(argMatch, s.slice(op, p++).trim());
            
            //console.log(aLen - j);
            
            while(++aI < aLen)
              exprs[aI] = '';
              
            if(typeof(expr) == 'function')
            {
              out += expr.apply(this, exprs);
            }  
            else
            {
              aI = -1; indexes = d.indexes;

              while(++aI < aLen)
                expr = expr.replace(argMatches[(temp = indexes[aI])], exprs[temp]);
            
              //console.log(s.charAt(p - 1));
              
              /*
              if(s.charAt(p) != ')')
              {
                --p;
                while(s.charAt(p++) != ')' && isFinite(p = this.__matchArg(s, p)))
                  console.log(s.charAt(p));
                  
                op = ++p;  
              }
              */
              
              out += expr;
            }  
          }
          while((p = s.indexOf(name, (op = p))) > -1)

          s = out + s.slice(op);
        }
        // defConst
        else
        {
          s = s.slice(0, p) + d.expr + s.slice(p + name.length).replace(d.match, d.expr);
        }
        
        break lblMainLoop;
      }
    }  
  }
  while(d);
  
  return s;
};

(function()
{
  var p = new $jb.Preprocessor();
  
  // concat ie A_$$B_$$_C(D_)
  p._define('$$', '', ['common']); 
  
  // unwrap CString ie A_$$_C_TEXT('+')$$_B -> A_ + B_
  // usefull for pass non valid expr to macroses ie _A(_C_TEXT('++'))
  p._define(
    '_C_TEXT(A_)', 
    function(a)
    { 
      var b;
      
      switch((b = a.trimLeft()).charAt(0))
      {
        case '"':
        case '\'':
          return b.trimRight().slice(1, -1)._unescapeCString();
        default:
          return a;
      }
    }, 
    ['common']
  );

  // unwrap function code from function, analog of $jb._fnCode
  // _C_FN_CODE(function(){ a++; }) -> a++;
  /*
    _C_IF(
      A_ > 5,
      _C_FN_CODE(function(){
        _a();
        ++b;
      }),
      _C_FN_CODE(function(){
        _c();
        --f;
        d = 4;
      })
    )
  */
  p._define(
    '_C_FN_CODE(FN_)', 
    function(fn)
    { 
      fn = fn.trim();
      
      return fn.slice(fn.indexOf('{') + 1, fn.lastIndexOf('}'));
    }, 
    ['common']
  );
  
  // simple conditional macros 
  // _C_IF(A_ > 0, B_, C_)
  p._define(
    '_C_IF(COND_, IF_TRUE_, IF_FALSE_)', 
    function(cond, ifTrue, ifFalse)
    { 
      if((new Function('return ('.concat(cond, ')')))())
        return ifTrue;
      else
        return ifFalse
    }, 
    ['common']
  );
  
  // simple evalute expr and return result 
  // _C_EVAL(A_ + B_ + 1)
  p._define(
    '_C_EVAL(EXPR_)', 
    function(expr)
    { 
      return (new Function('return ('.concat(expr, ')')))()
    }, 
    ['common']
  );

  // trim expr 
  // _C_TRIM(  A_   ) -> A_
  p._define(
    '_C_TRIM(A_)', 
    function(a)
    { 
      return a.trim();
    }, 
    ['common']
  );
  

  // (re)define const during <$jb.Preprocessor#_pass>
  // _C_DEF_CONST(A_ + B_ + 1)
  p._define(
    '_C_DEF_CONST(WHAT_, TO_, GROUP_)', 
    function(what, to, group)
    { 
      if(group > '')
      group = (group)
      this._
    }, 
    ['common']
  );
  
  
})();

});