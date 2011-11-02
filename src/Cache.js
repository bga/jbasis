export fix Cache = BasicClass({
  _init: #{
    @visitedMap_ = Object._create(null)
    @allMap_ = Object._create(null)
    @threadId_ = null
  },
  _ttl: #(ttl){
    if(ttl != null)
    {
      if(@threadId_ != null)
        clearInterval(@threadId_)
      @ttl_ = ttl
      @threadId_ = setInterval(@_onTimeout, ttl) // TODO use EventLoop instead
      -> @
    }
    else
    {
      -> @ttl_
    }
  },
  _get: #(k){
    fix v = @allMap_[k]
    if(v != null)
    {
      @visitedMap_[k] = v
      -> v
    }
  },
  _set: #(k, v){
    @visitedMap_[k] = @allMap_[k] = v
  },
  _has: #(k){
    -> k in @allMap_
  },
  _del: #(k){
    delete(@allMap_[k])
    delete(@visitedMap_[k])
  },
  _onTimeout: #{
    @allMap_ = @visitedMap_
    @visitedMap_ = Object._create(null)
  }
})