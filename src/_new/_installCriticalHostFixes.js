sjsExport._ = #{
  fix Object = @Object
  fix Function = @Function
  
  if(Function.prototype.apply == null && Function.prototype.call != null)
  {  
    (#{
      fix defaultThis = (#{ -> @ }())
      var fnCode = """
        if(that !== defaultThis) { 
          switch(args.length) { 
            default: _patchCall(args.length) 
              return this.apply(that, args) 
          } 
        } else { 
          switch(args.length) { 
            default: _patchNoCall(args.length) 
              return this.apply(that, args) 
          } 
        }
      """
      fix _applyPatch = #{
        Function.prototype.apply = Function(
          '_patchCall, _patchNoCall, defaultThis',
          `return function(that, args) { %fnCode }`
        )(_patchCall, _patchNoCall, defaultThis)
      }
      fix _patch = #(n, op, s)
      {
        var t = `case %n: return this %op`
        var i = -1, len  = n; while(++i < len)
          t += `args[%i],`;
        t = t.slice(0, -1) + ');\n'
        fnCode = fnCode.replace(s, t + s)
        SafeJS._log(fnCode)
        _applyPatch()
      }
      fix _patchCall = #(n)
      {
        _patch(n, '.call(that,', 'default: _patchCall(args.length)')
      }
      fix _patchNoCall = #(n)
      {
        _patch(n, '( ', 'default: _patchNoCall(args.length)')
      }
      _applyPatch()
    }())  
  }  

  if(
    !Object.prototype.hasOwnProperty && 
    (#{ 
      fix b = Object(){a: 1}
      fix a = Object(){__proto__: b}
      if(a.a != 1) 
        -> no
      a.__proto__ = null
      if(a.a != null) 
        -> no
      a.__proto__ = b
      if(a.a != 1) 
        -> no
      -> yes  
    })
  )
  {
    Object.prototype.hasOwnProperty = #(k){
      fix proto = @__proto__
      @__proto__ = null
      fix has = k in @
      @__proto__ = proto
      -> has
    }
  }
}  