package main

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

var SignatureSeed []byte

func init() {
	SignatureSeed = make([]byte, 32)
	if _, err := rand.Read(SignatureSeed); err != nil {
		panic(err)
	}
}

// Sign hashes the string in a secret way.
func Sign(str string) string {
	data := append(append(append([]byte{}, SignatureSeed...), []byte(str)...), SignatureSeed...)
	hash := sha256.Sum256(data)
	return hex.EncodeToString(hash[:])
}
