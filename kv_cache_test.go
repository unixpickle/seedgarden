package main

import (
	"fmt"
	"math/rand"
	"testing"
)

func TestKVCache(t *testing.T) {
	// We test with random single-letter keys, so 26 is the
	// maximum number of keys we will insert.
	for _, capacity := range []int{1, 2, 5, 10, 26, 27} {
		t.Run(fmt.Sprintf("Cap%d", capacity), func(t *testing.T) {
			gen := rand.New(rand.NewSource(0))
			dummy := bruteForceKVCache[float64]{capacity: capacity}
			cache := NewKVCache[float64](capacity)
			for i := 0; i < 10000; i++ {
				name := string('A' + rune(gen.Intn(26)))
				if gen.Intn(2) == 0 {
					value := gen.Float64()
					dummy.Set(name, value)
					cache.Set(name, value)
				} else {
					actual, actualOk := cache.Get(name)
					expected, expectedOk := dummy.Get(name)
					if actual != expected || actualOk != expectedOk {
						t.Fatalf("expected (%f, %v) but got (%f, %v)",
							expected, expectedOk, actual, actualOk)
					}
				}
			}
		})
	}
}

type bruteForceKVCache[T any] struct {
	capacity int
	entries  []*bftcEntry[T]
}

func (b *bruteForceKVCache[T]) Get(path string) (T, bool) {
	for _, entry := range b.entries {
		if entry.Path == path {
			return entry.Value, true
		}
	}
	var zero T
	return zero, false
}

func (b *bruteForceKVCache[T]) Set(path string, value T) {
	for i, entry := range b.entries {
		if entry.Path == path {
			entry.Value = value
			copy(b.entries[1:], b.entries[:i])
			b.entries[0] = entry
			return
		}
	}
	if len(b.entries) < b.capacity {
		b.entries = append(b.entries, nil)
	}
	copy(b.entries[1:], b.entries)
	b.entries[0] = &bftcEntry[T]{Path: path, Value: value}
}

type bftcEntry[T any] struct {
	Path  string
	Value T
}
