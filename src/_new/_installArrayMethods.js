sjsExport._ = #{
  Array = @Array
  Array.prototype._overwriteFrom({
    _begin: #{ -> 0 },
    
    _end: #{ -> @length },
    
    _get: #(k){ -> @[k] },
    
    _set: #(k, v){ fix old = @vs[k]; @vs[k] = v; -> old != v },
    
    _has: #(k){ -> 0 <= k && k < @length },
    
    _moveRight: #(b, e, shift){
      while(--e >= b)  
        @[e + shift] = @[e]
    },

    _moveLeft: #(b, e, shift){
      for(; b < e; ++b)
        @[b] = @[b + shift]
    },
    
    _del: 
      _exportConst(Array().splice) && #(k){ @splice(k, 1) } ||
      #(k){ 
        if(@_has(k)) 
        {
          if(k != @length - 1)
            @_moveLeft(k, @length - 1, 1)
          @length--
          -> yes
        }
        else
        {
          -> no
        }
      }  
    ,
    
    _delMany: 
      _exportConst(Array().splice) && #(k, n){ @splice(k, n) } ||
      #(k, n){
        if(@_has(k)) 
        {
          if(k + n >= @length)
            n = @length - k
          if(k < @length - n)
            @_moveLeft(k, @length - n, n)
          @length -= n
          -> yes
        }
        else
        {
          -> no
        }
      }
    ,
    
    _insertBefore: 
      _exportConst(Array().splice) && #(k, v){ if(k == 0) @_popFront() else @splice(k - 1, 0, v) } ||
      #(k, v){
        throw 'todo'
      }
    ,
    
    _insertAfter: 
      _exportConst(Array().splice) && #(k, v){ @splice(k, 0, v) } ||
      #(k, v){ throw 'todo' }
    ,
    
    //_insertMany: #(k, vs){ -> @splice.apply([k, 0], v) },
    //_splice: #(k, delCount, )
    
    _pushBack: 
      _exportConst(Array().push) && #(v){ @push(v) } ||
      #(v){ @[@length] = v }
    ,
    
    _popBack: 
      _exportConst(Array().pop) && #{ -> @pop() } ||
      #{ -> @[@length--] }
    ,
    
    _pushFront: 
      _exportConst(Array().unshift) && #(v){ @unshift(v) } ||
      #(v){
        var i = @length; while(i--)
          @[i + 1] = @[i]
        @[0] = v  
      }
    ,
    
    _popFront: 
      _exportConst(Array().shift) && #(v){ -> @shift() } ||
      #{
        if(@length == 0)
          -> null
        fix ret = @[0]
        var i = @length - 1; while(i--)
          @[i] = @[i + 1]
        @length--
        -> ret
      }
    ,
    
    _pushBackMany: 
      _exportConst(Array().push) && #(vs){ @push.apply(@, vs) } ||
      #(vs){
        fix e = @length
        var i = -1; while(++i < vs.length)
          @[e + i] = vs[i]
      }
    ,
    
    _pushFrontMany: 
      _exportConst(Array().unshift) && #(vs){ @unshift.apply(@, vs) ||
      #(vs){
        fix shift = vs.length
        var i = @length; while(i--)
          @[i + shift] = @[i]
        var i = vs.length; while(i--)
          @[i] = vs[i]
      }
    },
    
    _copy: #{ -> @concat() },
    
    _slice: Array().slice,
    
    _splice: 
      _exportConst(Array().splice) ||
      #{ throw 'todo' }
    ,
    
    _each: #(_fn){
      var i = @length; while(i--)
      {
        fix ret = _fn(@[i], i, @)
        if(ret != null)
          -> ret
      }
    },
    
    _map: #(_fn, out){
      out || (out = Array(@length))
      var i = @length; while(i--)
        out[i] = _fn(@[i], i, @)
      -> out
    },

    _grep: #(_fn, out){
      out || (out = Array(@length))
      var j = 0
      var i = -1; while(++i < @length)
      {  
        if(_fn(@[i], i, @))
          out[j++] = @[i]
      }
      -> out
    },
    
    _indexOf: 
      _exportConst(Array().indexOf) ||
      #(v, i){
        if(i < 0)
          i = 0
        if(i >= @length)
          -> -1
        for(; i < @length; ++i)
        {
          if(@[i] == v)
            -> i
        }
        -> -1
      }
    ,

    _lastIndexOf: 
      _exportConst(Array().lastIndexOf) ||
      #(v, i){
        if(i >= @length)
          i = @length - 1
        if(i < 0)
          -> -1
        for(; i >=0 ; --i)
        {
          if(@[i] == v)
            -> i
        }
        -> -1
      }
    ,
    
    _reduce: 
      _exportConst(Array().reduce) ||
      #(_fn, r){
        var i = -1
        if(r == null)
          r = @[++i]
        while(++i < @length)
          r = _fn(r, @[i], i, @)
        -> r  
      }
    ,

    _reduceRight: 
      _exportConst(Array().reduceRight) ||
      #(_fn, r){
        var i = @length
        if(r == null)
          r = @[--i]
        if(@length <= 1)
          -> r
        while(i--)
          r = _fn(r, @[i], i, @)
        -> r  
      }
    ,
    
  })
}  