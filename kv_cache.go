package main

import "sync"

// A KVCache is a capped map from strings to values.
// Least recently updated keys are evicted when the
// capacity is reached.
//
// Access (both get and set) is thread-safe and will run in
// constant time.
type KVCache[T any] struct {
	capacity int
	lock     sync.RWMutex
	first    *cacheObj[T]
	last     *cacheObj[T]
	mapping  map[string]*cacheObj[T]
}

func NewKVCache[T any](capacity int) *KVCache[T] {
	return &KVCache[T]{
		capacity: capacity,
		mapping:  map[string]*cacheObj[T]{},
	}
}

func (k *KVCache[T]) Get(path string) (T, bool) {
	k.lock.RLock()
	defer k.lock.RUnlock()

	if entry, ok := k.mapping[path]; ok {
		return entry.Value, true
	} else {
		var zero T
		return zero, false
	}
}

func (k *KVCache[T]) Set(path string, value T) {
	k.lock.Lock()
	defer k.lock.Unlock()

	entry, ok := k.mapping[path]
	if ok {
		k.moveToFirst(entry)
		entry.Value = value
	} else {
		if len(k.mapping) == k.capacity {
			k.removeLast()
		}
		entry := &cacheObj[T]{Path: path, Value: value}
		k.insertFirst(entry)
	}
}

func (k *KVCache[T]) removeLast() {
	obj := k.last
	k.last = obj.Prev
	if k.last != nil {
		k.last.Next = nil
	} else {
		k.first = nil
	}
	delete(k.mapping, obj.Path)
}

func (k *KVCache[T]) insertFirst(obj *cacheObj[T]) {
	if k.first == nil {
		k.first = obj
		k.last = obj
		obj.Next = nil
	} else {
		k.first.Prev = obj
		obj.Next = k.first
		k.first = obj
	}
	obj.Prev = nil
	if _, ok := k.mapping[obj.Path]; !ok {
		k.mapping[obj.Path] = obj
	}
}

func (k *KVCache[T]) moveToFirst(obj *cacheObj[T]) {
	if obj == k.first {
		return
	}
	if obj == k.last {
		k.last = obj.Prev
	}
	if obj.Prev != nil {
		obj.Prev.Next = obj.Next
	}
	if obj.Next != nil {
		obj.Next.Prev = obj.Prev
	}
	obj.Next, obj.Prev = nil, nil
	k.insertFirst(obj)
}

type cacheObj[T any] struct {
	Path  string
	Value T

	Prev *cacheObj[T]
	Next *cacheObj[T]
}
