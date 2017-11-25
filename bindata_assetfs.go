// Code generated by go-bindata.
// sources:
// assets/index.html
// assets/images/loader.svg
// assets/script/script.js
// assets/style/style.css
// DO NOT EDIT!

package main

import (
	"github.com/elazarl/go-bindata-assetfs"
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

func (fi bindataFileInfo) Name() string {
	return fi.name
}
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}
func (fi bindataFileInfo) IsDir() bool {
	return false
}
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var _assetsIndexHtml = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x8c\x51\x4b\x6e\xc3\x20\x10\x5d\x27\xa7\xa0\xac\x63\x93\x2c\x2a\x55\x15\xf8\x12\x3d\x01\x81\x97\x32\x2d\x60\x0b\x26\x4e\x72\xfb\xca\xc6\x52\xab\xae\xb2\x01\xde\x0f\xc4\x3c\xfd\xe2\x47\xc7\x8f\x09\x22\x70\x8a\xc3\x5e\xb7\x6d\xa7\x03\xac\x1f\xf6\xbb\x9d\x4e\x60\x2b\x5c\xb0\xa5\x82\x8d\xbc\xf2\xa5\x7b\x93\xbf\x42\xb6\x09\x46\xce\x84\xdb\x34\x16\x96\xc2\x8d\x99\x91\xd9\xc8\x1b\x79\x0e\xc6\x63\x26\x87\x6e\x05\x07\x41\x99\x98\x6c\xec\xaa\xb3\x11\xe6\xd4\x1f\x0f\x22\xd9\x3b\xa5\x6b\xfa\x4b\x5d\x2b\xca\x8a\xed\x39\xc2\xe4\xb1\xbd\xc6\xc4\x11\xc3\x07\xe0\x3f\x6d\xf1\xc8\x5a\x35\x66\xbf\x88\x91\xf2\xb7\x28\x88\x46\x56\x7e\x44\xd4\x00\xb0\x14\xa1\xe0\xb2\x31\x6a\x5d\x7b\x57\xab\x14\xcb\x6f\x8d\x64\xdc\x59\x2d\xb8\xdd\x50\x5d\xa1\x89\x45\x2d\xce\xc8\xc0\x3c\xd5\x77\xa5\x2e\xe7\x3e\x41\x15\x58\xc7\xdd\xe9\xb5\x3f\xf6\xc7\xfe\xab\xca\x41\xab\x66\x1e\x9e\xc9\xf9\x31\x3d\x95\x6d\xe7\x4d\xfd\x6f\xd5\x6a\x6b\x43\x9f\x47\xff\x58\xb3\x9e\x66\x41\xde\xc8\x6d\xde\x6d\x46\xca\xd3\xbc\xda\x9b\x4d\xab\x56\xe6\x4f\x00\x00\x00\xff\xff\x55\xab\x4e\xde\xe4\x01\x00\x00")

func assetsIndexHtmlBytes() ([]byte, error) {
	return bindataRead(
		_assetsIndexHtml,
		"assets/index.html",
	)
}

func assetsIndexHtml() (*asset, error) {
	bytes, err := assetsIndexHtmlBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "assets/index.html", size: 484, mode: os.FileMode(420), modTime: time.Unix(1511559486, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _assetsImagesLoaderSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x4c\xcd\x41\x6e\xc3\x20\x14\x04\xd0\x3d\xa7\x18\xfd\x6e\x1d\x03\x69\x5a\xa1\x0a\x88\x7a\x80\x1e\xa2\x0d\x04\xa3\x12\xb0\x0c\x35\x3e\x7e\x65\xc9\x8b\xcc\xec\x66\xf1\x46\x5f\xb7\x47\xc2\xea\x97\x1a\x4b\x36\x24\x47\x41\xf0\xf9\x56\x5c\xcc\xc1\xd0\x5f\xbb\x9f\x14\xe1\x6a\x99\xae\x6b\xc0\xf6\x48\xb9\x1a\x9a\x5a\x9b\x3f\x38\xef\xbd\x8f\xfd\x75\x2c\x4b\xe0\x67\x21\x04\xaf\x6b\x20\x86\x3d\x4f\x9c\x24\xcb\x00\x3d\x7f\xb7\x09\xb5\x2d\xe5\xd7\x1b\x7a\x79\x7f\xfb\xb9\xb9\x0b\x1d\xc3\xa9\x47\xd7\x26\x43\x17\xc2\x3d\xa6\x64\x28\x97\xec\x0f\x09\x80\x33\xf4\x75\x1e\xa4\xc0\xa7\x1a\x14\x04\xe4\x5e\x31\x48\x45\xe0\x96\xe9\xfd\xd6\xb2\xff\x00\x00\x00\xff\xff\x24\x9c\x62\x4d\xc7\x00\x00\x00")

func assetsImagesLoaderSvgBytes() ([]byte, error) {
	return bindataRead(
		_assetsImagesLoaderSvg,
		"assets/images/loader.svg",
	)
}

func assetsImagesLoaderSvg() (*asset, error) {
	bytes, err := assetsImagesLoaderSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "assets/images/loader.svg", size: 199, mode: os.FileMode(420), modTime: time.Unix(1511559486, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _assetsScriptScriptJs = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xd4\x3c\x5d\x73\xdb\x38\x92\xef\xfe\x15\x3d\xba\xba\x90\xda\xc8\x8c\x3d\x57\xf7\x22\x8f\x2e\xe5\xaf\x6c\x7c\xeb\xc4\x29\xdb\xb9\xab\xa9\x54\x2a\x05\x91\x90\xc5\x18\x02\x34\x20\x18\x5b\xf1\xea\xbf\x6f\xe1\x8b\x04\x40\x52\xa2\x27\xce\x64\xf3\x32\xb1\x40\xa0\xbb\xd1\x68\xf4\x37\x26\x25\xa8\x28\xe0\x08\xad\xce\xe8\x8c\x01\xbe\x17\x98\x66\x05\x5c\x62\x94\x8a\xe4\x98\x2d\x96\x8c\x62\x2a\xe0\x61\x07\x20\x65\xb4\x10\xbc\x4c\x05\xe3\xf1\x92\xb3\x65\x31\x54\xc3\x00\x45\xb9\xc4\x76\xe8\x40\x8d\x88\x79\x5e\x24\x85\x40\x02\xc3\xc4\x4c\x02\x20\x0c\x65\x39\xbd\x19\x83\xe0\x25\x1e\x99\x41\xcc\x39\xe3\x63\xa0\x25\x21\x76\x28\xa7\x33\xa6\x47\xd4\xc0\xda\x01\xf9\x89\x30\x76\x5b\x2e\x61\xa2\x3e\xcb\x0f\xeb\x1d\x45\x99\xa1\xf3\xff\x73\x42\xde\xb0\x92\x8a\xd8\xd2\x16\x2e\xc3\x77\x72\xaf\xe7\xea\xb7\x26\x39\xc9\xb3\x91\x9e\x36\x45\xab\x63\x44\xc8\x14\xa5\xb7\xc9\x34\xa7\x59\x2c\x47\x87\xc3\x76\x34\xef\xe9\xa2\x13\x51\x92\x22\x9a\x62\x12\xd7\x4b\x39\xa6\x19\xe6\xd5\xe4\x7c\x06\x71\xcd\xa3\xc4\x70\x66\x58\xb1\x8a\x63\x51\x72\x6a\x4e\x21\xe5\x18\x09\x7c\x4a\xf0\x02\x53\x11\x9f\x33\x94\x61\xfe\x0e\x51\x3c\x52\x4c\x30\x1c\x5f\x03\x26\x05\x0e\x01\x2b\xee\xf6\x02\x6b\x66\x00\x0c\xb2\xfc\xcb\x60\x54\xfd\x7c\x00\x25\x20\x6f\xd1\x02\x8f\x61\xa0\xe0\xed\x2e\x11\xc5\x03\x58\xd7\x93\x42\x8c\xe6\x83\x4f\xda\x93\x11\x31\x45\xab\x5d\x29\x23\x1e\x09\x1b\xc1\x01\x0c\x08\x9a\x62\xe2\x80\xec\x02\xba\x4b\xd1\xc2\xdf\x9c\xb7\x3d\x39\x25\x91\x53\xaa\xcf\xc3\xef\x40\x43\x81\x71\x86\x79\xb1\x85\x0c\x33\xeb\xbb\x52\x42\x30\x4e\xe7\xdb\x49\xb1\xd3\xfe\x0c\x2d\xd3\x52\x08\x46\xfb\x10\x83\xb2\x6c\xb7\x65\x36\x00\xa3\xc7\x24\x4f\x6f\xc7\x10\x0f\x61\xf2\x3f\x9a\x3a\x7d\xb7\x19\x3d\xcc\xb2\x38\x24\x77\x81\x6e\x28\x16\xef\x2f\xcf\x87\xfe\xb6\x06\x87\x59\x06\xd7\x8c\x73\x4c\xc5\xa0\xde\x4b\x20\xce\xf6\x4e\x3b\xea\x22\x56\x62\x3f\x52\xaa\xcb\x53\x08\x05\x16\x57\x12\x6f\xfc\x50\xab\xbf\x19\x22\x05\x1e\x59\xcd\xe7\xac\x1c\xab\xff\xc2\xda\xa8\x8d\xf5\x8e\xd2\xb8\x70\x79\xfa\xea\xf2\xf4\xea\xf5\xa7\xb3\xb7\xd7\xa7\x97\xff\x77\x78\x0e\x13\xf8\xef\xbd\xbd\xbd\x03\xf3\xf9\xe8\xf0\xf7\x4f\x57\xa7\x87\x97\xc7\xaf\x3f\x9d\x9c\x9e\x1f\xfe\x0e\x13\xd8\x57\x9f\x77\xb4\x6a\x37\xfb\x39\x26\x79\x9b\x22\xf7\xa8\x65\xf4\x78\x8e\xe8\x8d\x54\xda\x9a\x93\x8a\xd4\x83\x1d\x47\xc1\x65\xec\x8e\xca\x9d\x14\x8e\x0e\xb6\xdf\x6e\xb0\x10\x39\xbd\x39\xcf\x0b\x01\x13\xbb\xd6\xfb\x2c\x3f\x49\xad\xa8\xcd\x06\x16\x67\x54\x60\xfe\x05\x91\xd8\x39\xb8\x7a\xde\xa8\xb1\xf5\x5a\xa1\x56\x74\x78\x3a\xf5\x97\x80\xc8\x86\xea\xab\x49\x5e\xef\x38\xc3\xc1\xb2\x64\x81\x96\x31\x9b\x7e\x96\x34\x5d\x4c\x3f\xe3\x54\x24\xa8\x28\xf2\x1b\x1a\x3f\xac\x47\xc0\xa6\x9f\x1d\xa3\x90\x61\x82\x05\x36\x4c\x8e\xe7\xa8\x98\xfb\x16\x41\x18\xf6\x23\x42\xe2\x48\x4f\x8e\x46\xa0\xe6\x55\x30\x0a\x81\xb8\xe8\x09\x42\xcd\x6d\x81\xc0\x96\xbd\x01\xb0\x65\x63\x3d\xca\x32\xbb\xdc\xb9\x1c\x1a\xc6\xa7\x14\x11\x72\x84\xd2\x5b\x4c\xb3\xc3\x77\x67\x71\xf4\x02\x2d\xf3\x17\x28\xcb\x5e\x96\x9c\x4c\x22\x78\x0e\x98\xa6\x2c\xc3\xef\x2f\xcf\x2a\x87\xc1\x81\x52\x23\xa9\x4f\x36\x34\x83\x9e\xe8\xfc\xf3\x9f\x86\x6c\x94\x8a\x9c\xd1\xe2\x1d\xa6\xf2\xe2\xc4\xc3\xf0\x34\xdd\x83\x6c\x93\x40\xe9\x67\x1c\x6c\xd8\x42\x75\xde\xd1\x30\x11\x73\x4c\xe3\x0c\x09\x24\xcf\xdc\xa2\xd9\x22\xd6\xee\x06\xba\x69\xf5\xa9\xb5\xf4\xb6\xdd\x27\x89\x5e\x89\xde\xbd\x4b\x04\xc0\x7d\x22\xa1\x7f\x91\xd7\xf2\xde\x78\x55\xbf\x4c\x60\xef\x20\x98\xc0\xa8\xc1\x1e\x52\x59\x89\xf9\x7d\x45\xc3\xd0\xfe\x55\x60\x71\x9d\x2f\x30\x2b\x45\xec\xa9\x80\x11\xec\x59\x7d\x37\x4c\x52\x24\xd2\x79\x8c\x1f\xc5\x9a\x17\x2f\xe0\xfa\xe2\xe4\x62\x0c\x0b\xb4\x9a\x62\x98\x23\x9a\x11\xac\xb5\x1d\xcc\x31\xc7\x49\x92\x98\x99\x52\x1d\x31\x82\x13\xc1\x51\x8a\x63\x5c\xa1\xad\xe5\x26\x64\xae\xa1\xa2\xfd\xf2\xc2\xb3\x67\x8d\xfb\x3c\x93\xde\x9c\xe2\x6a\xc0\x2a\x07\x89\x7b\x49\xa4\xb8\x98\x2b\x62\x70\xcd\x18\x87\x98\x60\x01\x39\x48\xd6\x43\x0e\xbf\x35\xb0\x10\x4c\x6f\xc4\xfc\x00\x9e\x3f\xcf\xeb\xe3\x97\x6b\x32\x22\xa5\xd1\x9f\xfd\x21\xff\xe8\x4a\x51\x46\x12\x89\x0e\x26\x13\x85\x56\x6e\xe2\x97\x8c\x04\xc4\x3a\x32\x11\x7e\xf3\xc4\xbd\x5b\xe4\xe5\x6d\x95\x1f\xe0\x39\x44\x2f\x25\xa2\xae\xfb\xab\xf6\x6e\xae\x85\x56\xce\x0f\x8e\xa1\x6c\xc1\x1e\x48\x5c\x1f\xc9\x0a\x24\xc9\x1a\x07\xfb\xa1\x12\xbc\x3f\x83\xbf\x96\xf0\xb5\x63\xb5\xd7\xd6\x28\x1e\xa1\xd5\x15\x46\x3c\x9d\x37\x0c\xe2\x1f\x25\xe6\xab\x11\xa4\x53\x4f\x85\xaa\x51\x98\x80\xfa\xd7\x35\x6a\xe9\x14\x26\x90\x4e\xf5\xd0\x8b\x17\x70\x82\x09\x5a\x81\x98\x63\xe0\xf8\x8f\x12\x17\x02\x0a\x06\x62\x8e\x04\xdc\x61\xc8\x18\x8d\x04\x14\x4b\xb4\x50\x33\xa6\x68\x65\x97\xdd\xcd\x73\x82\xd5\x60\x59\x60\x0e\x62\xb5\xc4\x05\xb0\x52\x00\x82\x42\xd3\xa9\x30\x27\x2e\x66\x44\x88\x61\x30\x4c\x5c\x6e\xfb\xec\x6a\x9b\x5c\x5b\xc1\x2e\x39\x99\xa2\x95\xc6\xfb\x52\xe1\xed\x92\x12\xf5\xd1\x8a\x89\x31\x98\x0f\x7e\x58\xf0\x29\x9d\xc6\x2a\xba\x53\x76\xb3\x56\x40\x56\xa9\x70\xde\xb1\x08\x73\xee\x45\x38\xf5\x99\xae\x47\x0d\xa7\xc7\x09\xd2\x4c\xe8\xd5\x30\x31\x0e\x0b\xea\x8b\x94\x12\x8c\xb8\x27\xa6\xde\xbc\xa6\x85\x51\xe7\x1d\xdf\x8f\x60\xa5\xb8\x5c\x87\xa1\x95\x68\x1d\x2b\x02\xd0\x94\x60\xa9\x4a\x1a\xf2\x55\x72\xd2\x90\x2e\x5f\x8a\xc2\x13\x29\x39\x69\xe7\x70\x27\x7f\xbb\xb8\xdb\xc9\xdb\x75\x27\xff\xfa\xee\xba\x0a\xaa\xab\x14\xc2\x16\x3e\xc8\xa8\xbb\x66\x83\x4e\x21\x54\xb2\xa7\xc3\xe8\x97\x79\xd6\x25\x78\x79\x36\x54\xcb\x03\x2a\xa4\x0a\x79\x95\x13\x5c\xf4\xa5\x42\xaa\xb9\x2e\x3a\x66\x12\xd0\x76\x25\xe9\xd3\x31\x2b\xa9\x52\x4c\xad\xa7\xa8\x90\x18\xab\x35\xc3\xf2\x80\xea\xb3\xe5\xb8\x58\xd6\x67\xa5\x9c\x59\x39\x94\xb0\xdb\x86\x13\xfb\x8e\xb3\x45\x5e\xe0\x84\x63\xe9\x9a\xc6\x14\xdf\xc1\xa9\xb4\xab\x71\x64\x75\xce\x0c\xe5\x04\x67\xd1\x70\xd8\xe2\xeb\x2a\xa8\x9f\x0b\x46\x4d\x7a\xa2\x4d\xb6\x24\x7a\x36\xfd\x2c\x4d\xd2\xc5\x1d\x7d\xc7\xd9\x12\x73\xb1\x8a\x23\x65\xbe\xa3\x86\x23\x16\x52\xc4\xa6\x9f\x3f\x98\xb9\x1f\xdb\x48\xf8\x44\xd8\x1d\xe6\x29\x2a\xf0\xc5\xf4\x73\x6c\xe5\x56\x0a\xa1\xc7\xc1\xc6\x2c\x85\x56\xd2\x76\xc8\x39\x5a\x25\x79\xa1\xfe\x55\x9f\x02\x9f\x40\x12\x2f\x3d\x29\x0f\x86\x39\x25\x6d\x93\x39\x2e\x4a\x22\x95\xe1\x83\x4a\x30\x19\x37\xff\x16\xaf\x0a\x05\x2f\x99\x31\x7e\x8a\xd2\x79\x7c\xeb\x73\xe5\x56\x5a\xe8\xe8\xec\x24\x72\x79\x20\x21\x25\x79\x06\x13\x89\xf7\xc3\xed\xc7\x8e\xbc\x87\x9c\xf6\xe1\xf6\xc3\xde\xc7\x44\xb0\x73\x49\xd7\x31\x2a\x70\x3c\x84\xe7\x70\x9b\x14\xe5\xb4\x10\x3c\xde\x1f\x7e\x0c\xa1\xec\xd8\xeb\x59\x9f\x5f\x49\x84\x64\x95\x96\xf9\x13\xe3\x51\x3c\x2a\x7f\xe7\xcb\x7b\x6b\xd6\x0e\x94\xfc\x9f\x7b\x49\x3b\x3d\x76\xea\xe4\xec\xf4\x88\xfe\xe1\xa5\xea\xe4\xf8\x25\xfe\xe3\xb1\xa9\x3a\x67\x19\xbe\xab\xef\x73\xec\xc4\xf4\xd6\x85\x4a\xf4\xe5\xad\x96\x15\xdf\x98\xbc\x33\xa8\xb7\x26\xef\x74\xd8\x5d\xfb\x74\x3e\x55\x07\xae\x18\x6e\xc8\x7d\x78\x29\x2e\x3f\xe1\x61\x41\x85\x59\xae\xcd\x29\x33\x21\x95\x5c\x67\xd2\xcc\x83\xb9\xab\xe7\x3e\x26\x7f\x26\xa6\x2c\x5b\x79\x69\x17\x37\x65\xdb\x03\x82\x84\xc1\x83\xbc\x4d\x08\xa2\x07\x10\x09\x26\x0b\xc0\xb4\x01\x02\x18\xc8\x9d\x0f\xbc\xc1\xe1\x77\x43\x96\x11\x3f\x2b\x08\x4e\xde\xa8\x81\xf9\xdf\x8e\x53\xef\x38\xbb\xe1\xb8\x28\xfe\x2a\x6e\xc5\xfb\x7b\x7b\xf0\x37\xc9\x34\x79\x2b\x09\x16\x38\x3b\x5a\x09\x5c\xc0\x0b\x39\x56\xe4\x5f\xb1\xfa\x39\x4c\x04\x7b\x95\xdf\xe3\x2c\xfe\x55\x2a\xc9\xe8\x3f\xa3\x9f\x94\xbf\x57\xf9\xd7\xbf\x4c\x12\x67\x8c\x2f\x90\x90\x18\x63\x8f\x97\x3f\x29\xeb\x8e\xad\x80\xfc\x18\xfe\xf9\xf2\xf9\xb3\x32\xf1\xe4\x1c\x2e\x91\xf8\x8b\x45\x50\x62\x94\x2c\xb4\x96\x47\xfe\xfe\x59\x19\xf8\xfe\x47\x32\xb0\x5c\xfe\xf4\xec\x53\x3b\xf8\x51\x77\x58\xf3\xef\x9a\x09\x44\x36\x30\x70\x27\xfc\x6b\xd8\xcf\xed\xda\x50\xa9\x8c\x2a\xa7\xcb\x24\x30\x65\x18\x19\x37\x72\x57\x2f\x21\xaa\xca\x19\xbb\x33\xce\xbe\x62\x1a\xc1\x18\xa2\xc8\xab\x4e\x99\x65\x5f\x30\xbc\xfc\xf6\x92\x5a\x40\x58\x55\x55\xab\x2b\x69\x5e\x0d\xed\x4a\xb0\x65\x50\x29\x93\x43\x4e\x89\x0c\xc6\x3f\x80\x28\xc4\x45\x83\x2a\xc4\xdd\xca\xdd\x13\x56\x21\x2b\xea\x74\x0d\x67\x1b\x75\x27\x6a\x56\x40\x9e\x1e\x6c\xa9\x2c\xda\x59\x75\x2c\x63\x69\xd4\x53\xea\x58\xc4\xff\xd8\xde\x4e\xa0\xe6\x3c\x61\xd5\xbf\x16\x4e\x09\xb8\xab\xf2\xaf\x3e\xd6\xe5\x8b\x6d\x0c\x47\x01\xaf\x6f\xf1\x6a\x0c\xf7\x09\xc9\xe9\xed\x08\xe6\x1c\xcf\xec\x2f\x9f\x87\xf7\xc9\x12\x89\x79\xcd\xc1\xb0\x38\xdb\xda\x06\x51\x47\xad\xdf\x8d\x2b\xbb\x2a\xdd\xb1\x91\x37\xa7\xdf\xbf\x35\x22\xa0\xc9\x94\x9c\xb7\x06\x7a\xba\xa7\xc4\x64\x04\x03\x0a\x3d\xc1\x0b\xeb\xdd\x9e\xa4\x85\x05\x6f\x3f\x7f\x60\xaa\xde\x6e\x02\xc1\x05\x32\xd6\xff\x38\xc5\xef\x3a\x11\xe4\xa8\xf3\xa9\x72\xc3\xea\x74\x06\x14\xe5\x6c\x96\xdf\xe3\x02\x26\xf0\x21\x82\x7f\x1c\x45\x23\x88\xe0\x8d\xfe\xe7\xef\xfa\x9f\xeb\xa3\x48\xe5\x52\xda\x4a\x38\x76\x79\x5b\xed\xc6\x45\x00\x93\x6a\x6a\x55\xb8\x31\xdf\xf3\xaf\x18\x26\x30\x35\xf1\xcb\x1b\x24\xe6\xc9\x92\xdd\xc5\xfb\x7b\x23\xf8\x2f\xf8\x1b\xc4\x39\x3c\x87\x7d\x9b\x89\x93\x82\xa9\x56\xfc\x06\xfb\x7b\x0d\x61\x94\x5f\xfc\x98\x47\x23\x6d\xc8\x76\x05\x62\x0b\x8c\xfd\x5e\x30\x9a\x40\xd4\x2e\x38\x2b\x69\xa6\xa6\x35\xa0\x98\x3c\x9a\x99\xad\xf7\xfe\x1c\x22\xfd\x57\x74\xd0\x72\x7a\xca\x99\xe1\xd2\x87\xf1\x92\xa0\xf5\xc9\xea\x6f\xcf\x21\x7a\x51\xe0\x54\x81\xa8\x20\xd8\x0c\x97\x2a\x10\x39\x9d\x67\x72\x17\x7e\xf2\xc5\x9e\x23\x4c\x26\x13\xd8\x0b\x72\x82\xfd\x93\x31\x79\x36\x86\x01\x65\xbb\x15\xd8\xde\x49\x98\xf9\xbe\x73\x37\x7d\xd7\x64\xf0\x96\x55\x3b\xa9\x22\x6d\x4f\xbd\xeb\xc4\x24\xd1\xc5\xd4\x70\x63\x52\xb1\x66\xa4\x4e\x46\x6e\xd8\x94\xc5\x72\x4a\x05\x5f\x8d\xe0\xa1\xf2\x2e\xc6\x90\x55\x04\x29\x7d\x6b\xaa\x8e\x76\x2c\xe8\xa3\xb1\xb6\x4c\x0d\xda\x0a\xe5\xd0\x5e\xd1\x61\xc2\xf1\x17\xcc\x0b\x1c\xbb\xd9\xc9\x4e\xf6\x0c\x98\x6d\x38\x32\xfc\x6d\x32\x57\xee\x7c\x47\x71\xc3\x95\x1f\x6f\x37\xee\xf1\x6f\xc5\x48\xf2\x0a\x63\x9b\x57\xa6\xbc\x31\xbd\xc7\xbe\x0e\x59\x83\x51\x1e\x8b\xec\x3e\xda\x28\xd2\x12\xd6\xe5\x1f\x2a\x2b\xb1\xeb\x10\x54\xe5\x38\x2b\x9f\x2f\xd2\x7f\x29\x42\x72\x6a\x7e\xc8\xc3\xe8\xc6\x69\x85\xdb\xef\xf6\xea\xb0\x18\x41\xdf\x5b\x40\x46\x95\xdc\xea\x81\xae\x47\x62\x53\xee\xb7\xff\xa5\x0a\xbb\xd5\xba\x80\xe6\x5f\xfd\x9c\xa6\xa3\x5d\x82\xed\x34\xd2\x22\x3d\x9d\xfd\x9e\x94\xe8\x88\xa3\x27\x2d\x2d\xe1\xc9\xb0\xe3\x14\x8c\x30\x3c\x7b\xf6\x34\x64\x4a\x95\xdb\x42\xa4\x52\xd5\x01\xe6\xb6\x20\xde\xe8\x2e\x7b\x63\xab\x0b\xab\xbd\x89\x47\xdd\xd4\x5a\x64\x7c\x52\x55\xd8\x58\x7b\x55\x03\xe3\x4d\x0c\x9a\x5a\xa2\x6e\x8b\x7d\x42\xc4\x7e\xa7\x6b\x1f\xcf\x49\x51\xa5\x1d\x83\xab\xeb\xc3\xeb\xd3\x4f\xff\x38\xfd\xfd\x4a\xf9\x26\x69\xa9\xda\x4b\x74\xd7\x81\xf4\x4b\xcc\x80\x55\x6f\xaf\x51\xe1\x0e\x1f\xa1\xd5\xd9\x89\xf4\x5b\x4c\x95\xe7\x92\x31\xf1\x84\xd5\x9d\x9c\xe6\x22\x47\x44\xb9\x6a\xaf\x38\x5b\x48\xec\x76\xe2\x5d\x4e\x33\x76\x97\x30\xba\x64\x4b\x3b\xdf\xe9\xcf\xd3\x9d\x3c\xef\xd8\x52\xfb\x79\x2e\xf4\x54\xf7\x18\x3e\xb2\xe4\x53\xaf\xc2\x77\x7e\xb7\x62\x0b\xf0\x66\x8f\x62\xe8\x76\x56\x76\x65\xec\xad\x73\x1b\x06\x9d\x72\x77\xb8\x9b\x56\x5f\x96\x33\x26\x02\x56\x39\x85\x25\x45\x8e\x3e\x57\xd3\x10\xe1\x3b\x90\x72\xe1\xc5\xf4\x73\x55\x6a\x04\x47\x34\xfc\x32\xa3\x9d\xfa\xe1\xf6\xa3\x2d\x2e\xa9\xa1\x0f\xb7\xb6\x8c\x6a\x67\x24\x9e\x38\xf9\x8d\x29\x41\xf0\xe3\xcf\x7c\xf6\x0c\x3c\x1a\x01\xe6\x79\x21\x18\x5f\x25\x1c\x2f\x09\x4a\xb1\x61\xe3\x7a\x64\xe5\x40\xe4\x82\xe0\x11\x44\xff\x21\xcd\xd3\xff\x5e\x5d\xbc\x4d\x0a\xc1\x73\x7a\x93\xcf\x56\xb1\x25\x67\xd8\x1e\xcf\x58\xd0\xcb\xb2\x98\x7f\x1b\xdc\xd6\x00\xc3\xdb\xd9\x58\xef\xcb\x3d\xdb\x62\xce\xee\xec\xf5\xf2\xba\x22\xf5\xc1\x94\xcb\xcc\x96\x3a\x5b\xee\xe2\x58\xf7\x61\xb9\x25\x4d\xb9\x8d\xd7\x7a\x4b\x9a\x04\x0d\xc1\xbb\x5f\x96\x3a\xbf\x6d\x14\x2f\x96\xc2\xac\x19\x8e\x0c\xe2\xa1\x4f\xe8\x11\x5a\xc5\x79\xb6\x8d\x42\xa5\x16\xc6\x90\x67\x7f\x0d\x61\xf8\x3e\x17\x4a\xa7\xb6\xdf\x0b\x77\xf5\x70\x13\x3d\x0f\xeb\xde\x0d\xb3\xf6\xba\x36\x67\x39\x08\x6a\xba\xdc\x0e\xd6\xf7\x97\xe7\x41\x91\xb6\xe4\x44\xbb\xd2\x8b\xa5\x88\xa3\x37\xaa\x27\x15\xde\x5f\x9e\x47\x4e\x38\x56\x35\x66\x84\x24\x38\x3d\xb1\x72\x4e\x10\x0f\xa3\x2c\x93\xda\x40\x1e\x9b\x03\x61\xeb\xfa\x2e\xf2\x1b\x2c\x53\x57\xc0\x82\xfd\xb6\x8b\x34\xdc\x52\xca\x4e\x11\x3d\xbd\xcf\x85\xa7\x72\x02\xb5\x61\x7b\x72\xbd\x6f\xee\x75\x69\x9f\xa1\xc4\xf5\x4f\x55\xc4\xdd\xd8\x49\x33\x95\x51\x81\xa9\x61\xdb\x26\x6f\xed\x9a\x2d\x8f\x10\x97\xae\x76\x61\x14\x43\xd7\xae\x6a\xc7\xc7\x70\x60\x6c\xff\xa8\xbf\x30\xf3\xc1\xb1\x35\xf5\xe9\xb9\xd3\x34\x48\x6d\x9b\xc6\x50\x54\xb3\x3d\xf3\x50\x78\x4b\x0e\xb3\xcc\x03\x5c\x89\xf0\x3a\xcc\xfa\x79\x9b\x6f\xf4\xbb\xeb\xad\x75\x37\xbd\x3f\xe6\x19\xd1\x26\xe3\xd1\x0b\xb0\x61\x2d\x34\x0d\x71\x40\x66\xcd\x09\xa5\xb8\xfb\x1c\x93\x89\xb3\x4e\xaa\x70\x56\xb7\xcc\x5a\x1f\xa0\xa1\xee\x1b\x2b\x8f\xd0\x4a\x29\x4f\x77\x89\x55\xbc\xeb\x8d\x29\xc4\x16\x91\x77\xba\x08\xd5\x35\xaa\x3a\x8a\xda\x76\xeb\xb4\x20\x87\x8d\xe1\x70\x6f\x5b\x7f\xdb\x2e\xa0\x8b\xb1\xd9\xbe\x2d\xa9\xd4\x78\x9b\x0d\xe7\x1b\x73\x03\x67\x74\xc6\xfc\xd4\x80\x06\xe3\xe6\x5a\x4d\x8e\xdd\x93\x51\xa3\xdb\xbc\x17\x0b\xa6\x01\x2a\x60\xb9\x5e\xcf\x96\xed\xcb\xeb\xe7\x0a\xdd\xab\x75\xba\xdc\x5b\xef\x9b\x05\x77\xa9\xdb\xf1\xeb\x7b\x21\xfd\xf2\xaa\x8d\xcc\x6a\xcf\xb7\x6f\x00\x03\xcb\x53\xc8\x18\x2e\x80\x2a\x47\x3d\x2f\x44\xe2\x24\xfa\x83\x66\xe4\x4d\x22\xa6\x74\x66\xaf\xab\x66\x1e\x6d\x8e\x4c\x46\xa5\x03\x54\x43\xe3\x94\xae\xc2\xa9\x6c\x58\xe3\x02\xf4\x20\xc0\x4d\xcc\x3d\xea\xc6\x57\xf9\x93\x2d\x17\xb8\xa6\xa9\x91\x14\x6e\x8f\x60\x14\xd5\x5e\x7b\x5f\x8b\xef\xae\xd3\x55\x4a\x74\xda\x9e\x33\x35\xfa\xec\x6a\xa4\x2d\xc0\x9a\x18\x5d\xaf\xe8\xc0\xa4\x29\x09\x4b\x91\x84\xa0\x64\xd5\x26\x29\x7f\x83\x5f\x83\x14\xa5\xc5\xa9\x37\x2c\xf8\xca\x7c\xf6\x9d\x36\x73\x53\xb5\xad\x5f\x22\x5e\xe0\x00\x7e\xd5\x4c\x68\x2c\x3f\xa8\x6e\x60\x88\xa5\x3f\xb1\xde\xbc\x43\x97\xf8\xe6\xd6\x74\x00\xd3\x15\xbe\xd8\x0e\xc7\x8f\x86\x99\xed\x5d\x8b\x3b\xc6\x6d\x41\x59\x76\xfa\x05\x53\xd5\xf6\x8f\x29\xe6\x71\xa4\x92\x72\x23\xa8\x68\x31\x14\x28\xc9\x3b\xb9\x78\x93\x18\xe7\xa5\x4d\x12\x65\x78\x6c\x0c\xd9\x08\x32\x96\x96\x72\x34\xb9\xc1\xc2\x4c\x38\x5a\x9d\x65\x71\x64\xcc\xa8\xea\x8b\x95\x92\xa5\x43\x6b\xe3\xe2\x7c\xcf\xa7\xcf\x53\xb4\xba\x54\x0c\x28\xfc\xa7\xce\x53\xb4\x3a\x6f\x7b\x15\x3d\x45\x2b\xa7\xc9\x52\xdf\x00\x07\xfc\xb4\x7a\xbd\xf0\xc8\x50\xdb\x5b\xa8\x9f\x42\x1b\xcf\xc4\x29\x5e\x9a\x17\x10\x4f\xf4\x24\xba\x42\xd9\xec\xab\xf4\x16\x5f\xe2\x14\xe7\x5f\xf0\x3b\x49\x82\xcf\xe3\x3a\xcd\xaf\x23\xbc\x5f\xac\x9d\xac\x41\x07\x21\xed\x06\xc4\xd0\x12\x47\x36\x4e\xa7\x79\x2e\xc1\x89\x38\xc6\x66\x0b\x5f\x1f\xc5\x52\x27\xbc\x68\xef\x39\x75\xb4\xd5\x2c\x27\x02\xf3\xaa\xa0\xd0\xd6\x20\x5b\x8c\x20\x3c\x56\x83\x46\x3d\x4a\xb2\x79\x75\x82\x17\xea\xf5\x99\x57\x6a\x88\xb3\x11\xe4\xde\x43\x92\xad\x3e\x9f\xbc\xc8\x39\xbd\x91\x86\x60\xd3\x83\x5c\xcf\x85\x8b\xb3\xd0\xf0\xab\xba\x44\x94\x11\x95\x0d\xcf\x47\x40\x95\xf5\xd5\x19\xe8\xda\x1c\x04\xc5\x07\xf3\x86\xca\xdd\x51\x5d\x09\x02\xa7\xbe\x15\x6e\xba\x7b\x37\xa7\x52\x11\x8e\x6c\x61\x7a\x90\x91\x5d\xa5\x1a\x07\x9e\x49\xd2\x9c\x94\xb2\xb1\x15\x9e\x91\xa7\x1a\xe2\x14\xad\x9c\x02\xed\xb0\xae\x29\x32\x82\x13\xc2\x6e\xe2\x68\xc5\x18\x63\xd1\xc8\xb5\xa5\x56\x0c\x87\xad\xa9\x9e\x5a\x90\x87\xae\xea\xb1\xc4\xb5\xce\xd4\xa7\xcd\xc3\xd3\x7e\xe2\xf3\x96\x2e\x06\x4f\xf2\xcc\xf3\xf0\xf4\x51\x4b\x3e\x78\x67\xcd\xfd\xb3\x0e\xdd\x5d\xbb\xa1\xd6\x52\x5f\xb0\xe3\xde\xc7\x2b\x89\x08\xce\x77\xb3\xb3\x56\x1d\x44\x1b\xa3\x37\xa0\xd5\x25\x6f\x0f\xad\x6a\x1c\x18\xc1\x02\x17\x05\x92\xb1\x63\x0b\x96\x40\xe8\x7a\xc4\xd2\xac\xab\xe0\xa3\x83\xe2\x5d\x6d\x8f\xb7\xd5\x60\x34\xd1\xaf\x71\x20\xba\x73\x3d\xb0\xbb\x3f\x18\x81\xc0\xf7\x62\x0c\x83\x33\xaa\x5e\xaf\x69\xff\x7e\x50\x95\xa5\x82\x1b\xf7\x0d\xb8\x7e\xad\x71\x5d\x50\xfb\x7c\xce\x45\x64\xf9\x1f\x84\xce\x2d\xaf\xf4\xb9\x7f\x47\xf4\x9b\xd4\x89\xf9\xf7\xd9\x33\xfd\x47\x22\xd8\x95\x4a\xa3\xc4\xad\x69\x34\xdf\x6a\x18\x88\xbe\xe1\x30\x1d\x0f\xb5\xe5\xc0\xce\x51\xfa\xce\xac\xb7\xf7\x27\x29\x60\x98\x63\x36\xdc\xab\x8e\x59\x5f\x4a\xc9\xc7\x66\x09\xc5\xbb\xd5\x4f\x49\x04\xd1\x20\xdd\x5e\xa9\xd6\xba\xa9\x1e\x34\xa5\xc6\x56\xe2\xd4\xad\x8d\x9f\x86\x2a\x7b\xdd\x4d\x69\xe9\x2d\xb3\xa7\xd8\x52\x5d\xf2\x54\xf8\x13\xe1\x0f\x9b\x73\x7a\x97\x97\x1a\x4c\x51\x6f\xbf\x9e\xf0\xbc\xfc\x56\x26\x7d\x2a\x46\x3b\x35\x69\x08\xfd\x10\xc7\xf9\x70\xbc\x32\xef\xfd\xac\xff\xfc\xc9\x09\x12\xdc\x6c\x89\x84\x6a\x9f\x6c\x4b\x91\xf0\x17\x25\x39\x4d\x49\x99\xe1\xc2\x3e\x41\xfd\xb7\x8c\x2c\x74\x2a\xf2\x49\x1f\x65\xe9\x23\x7a\xc5\xd2\xb2\xc0\x99\xd1\x31\x3a\x36\x68\x73\x1b\xbf\xe5\x19\x52\x24\xd8\x72\x77\x8a\xb8\xea\x4a\x30\xca\x4f\xb9\xb8\x2f\x21\x02\xc1\x96\x53\xc4\x77\xf5\x48\x4e\x6f\x1a\x0d\xab\x8e\x0b\x60\xd3\xcb\x5b\xcb\xd6\x8d\x1e\x4c\x5f\x3a\x0d\x3d\xbb\xf8\x3e\x17\xdb\xda\x2f\x15\x42\x27\x4b\x33\xf8\x3b\x83\xd7\xac\x7e\x0f\xd4\xb3\xde\xdf\x93\x22\xf7\x7f\x4c\xd3\x41\xd0\x61\x96\x79\xf4\xc8\xdf\x75\x3d\xa2\x17\x59\x83\x9c\x2e\x4b\x11\x36\x91\x54\x44\x98\xcb\x3b\x65\xf7\x03\x37\xd1\xa2\x44\x65\xdc\x51\x2b\x0d\xa4\x49\x86\x3a\x8e\x45\x95\xcb\x8f\x48\xc9\x7b\xae\x36\xb2\xe8\x67\x5d\x4d\x3e\x1c\x37\xdc\x42\x37\x5f\x1e\xe3\x44\x20\x7e\x83\x45\xf2\x05\x91\x12\x3b\x10\xd4\x6f\x8f\x95\x45\x55\x90\x88\xa2\x7a\x9e\x2a\x5d\xce\x19\xc9\x30\x1f\xc3\x40\xc3\x1e\x04\x79\xf4\xf5\xce\xbf\x02\x00\x00\xff\xff\xf4\xcd\xfa\xfb\xec\x4c\x00\x00")

func assetsScriptScriptJsBytes() ([]byte, error) {
	return bindataRead(
		_assetsScriptScriptJs,
		"assets/script/script.js",
	)
}

func assetsScriptScriptJs() (*asset, error) {
	bytes, err := assetsScriptScriptJsBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "assets/script/script.js", size: 19692, mode: os.FileMode(420), modTime: time.Unix(1511576302, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _assetsStyleStyleCss = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xdc\x5a\xcd\x6e\xdb\x38\x10\xbe\xfb\x29\x08\x14\x8b\xa4\x45\xe8\xc8\x8d\x9d\xb6\xca\x65\x0f\x3d\x16\xdb\xc3\xee\x3e\x00\x25\x8d\x6c\x22\x12\x29\x90\x54\x62\x77\xe1\x77\x5f\x88\x14\xf5\xff\x67\x45\x5d\x2f\x8a\x00\x81\x28\x92\x33\xdf\xfc\x70\x38\x33\xb2\xc7\x83\x13\xfa\x67\x85\x50\xc8\x99\xc2\x21\x89\x69\x74\x72\x91\x24\x4c\x62\x09\x82\x86\x4f\x2b\x84\x3c\xe2\x3f\xef\x05\x4f\x59\x80\x7d\x1e\x71\xe1\xa2\x77\xc1\x2e\xfb\x7b\x5a\x9d\x57\x6b\xff\x40\x04\x7e\x15\x24\x49\x20\xd0\x94\x5e\xb9\x08\xf4\x0b\x17\x79\x02\xc8\x33\xce\x5e\x3c\xd9\x09\xfd\xca\xce\x90\x28\xd2\x34\x22\x4e\x02\x10\x7a\x77\x40\x65\x12\x91\x93\x8b\xbc\x88\xfb\xcf\x7a\x1b\x0d\xd4\xc1\x45\x1f\x9d\xe4\x98\x0d\x0f\x40\xf7\x07\x55\x8e\x73\x48\x4a\x10\x26\x13\x22\x80\xa9\x27\x2b\x8e\xa4\x3f\xc0\x45\x4e\x43\x06\x1a\x93\x3d\xb8\x28\x15\xd1\xed\x7a\x7d\xaf\x47\xf2\xde\x20\x58\xcb\x97\xfd\xfb\xc6\x72\x43\x64\xe3\x38\xbf\xe9\x7f\xd9\x2c\x61\x34\x26\x8a\x72\x86\x19\x89\xc1\x45\x82\x2b\xa2\xa0\x3e\x13\xa4\x42\x3f\xb8\x68\x23\xeb\x33\x54\x81\x99\xc2\x3e\x4f\x99\x72\x11\x65\x21\x65\xb4\x49\x40\xd1\x98\xb2\x3d\x0e\x53\xe6\x1b\x3a\x11\x65\x40\x44\xa6\xaf\xdf\x9f\xe1\x14\x0a\x12\x83\xcc\x59\x1b\x0b\x0a\x1e\xeb\x07\x64\x94\x11\x72\x11\x5b\x6c\xb7\x4e\x00\x46\xb2\xf3\x0a\x21\xc5\x7b\xd7\x3d\x3c\x56\x56\x9e\x57\x5e\xaa\x14\x67\x7a\xb5\xd5\xfb\xc3\xa3\xd1\x7b\x06\x07\x37\x5f\x7a\x5c\x04\x20\x5c\xc4\x38\xd3\xe2\x24\x24\x08\x28\xdb\xbb\xc8\x29\xec\x55\xb1\xcc\xe6\x73\xcd\x84\xaf\x87\x5c\x09\x1d\x0e\xf7\xe5\xcb\x17\xbd\x32\x15\x32\x1b\x27\x9c\x32\x05\x5a\x19\x06\xa2\x7b\xe0\x2f\xb9\x07\x75\xec\xfe\xf4\xe9\x93\xf1\x55\xce\x14\x30\x85\x13\xc2\xa0\x67\x6d\x01\x22\xe1\x92\x1a\xc5\x13\x4f\xf2\x28\x35\x6f\x15\x4f\x5c\xb4\xdb\x1a\xdc\x31\x11\x7b\xca\xb0\xc7\x95\xe2\x71\xe6\x23\x56\x09\xc7\x4c\x40\x2d\xb7\x51\x08\xf6\xf8\x51\x1b\x2e\x86\x80\x12\x74\x1b\x93\x23\xce\xdd\xfa\x31\xdb\xf5\x5e\x83\x69\xc3\x2b\x9c\xdf\x27\x91\x7f\xab\x7d\x10\x23\xad\x49\x6d\x21\x84\x22\x08\x55\xc9\xf8\x5c\x65\x41\xd9\x65\x2c\x1e\x9d\x9c\x8a\xa5\xaa\x79\xee\x0c\xcb\x07\xc7\xf2\x3c\x97\xe7\xf5\x4a\x6a\x2c\x5d\xf1\x51\xaf\x1c\x55\x6b\x13\xed\xf2\x5a\xed\xe5\x30\x57\xa9\xd5\x88\x38\xa0\x41\x7b\xa6\xda\xb4\x37\x86\xf4\x79\xb5\x06\x21\xf8\xf5\x4c\x75\xe9\x65\x50\x09\x19\x99\x70\x05\x07\x05\x47\x85\x49\x44\xf7\xcc\x45\x3e\x98\xb3\x5f\x04\x0e\x01\xc1\x04\x37\x68\x28\x62\x79\x2f\xe8\x63\x70\x91\x13\x50\xa9\xf4\xee\xec\x01\x4b\x75\x8a\x00\xab\x53\x02\x65\x48\x35\x26\xc8\xaf\xb5\x32\xbe\x6a\x5b\x27\x44\x4a\xfa\x02\x58\x6f\xa6\x0a\xe2\x86\x03\x09\x88\x88\xa2\x2f\x30\x62\x33\x03\xdb\xdc\x76\x5d\x54\x5d\xc6\xd5\xad\x1b\x11\xa9\xb0\x7f\xa0\x51\x60\xe4\x2f\x88\xe4\xbe\x91\x1c\x91\xe4\x11\x0d\x6a\xd9\xc2\xb2\xc8\x16\x45\x34\x7c\x85\x84\x4e\xf6\xd7\x73\x07\x55\xc4\xfa\x90\x0b\xa6\xe7\x30\xbc\x00\x53\xd2\x1a\xef\xbc\x7a\x17\xf0\x57\x96\x9d\x6d\x79\x8d\xc3\x38\xc7\xa7\x86\x0f\x55\x43\x9e\xc5\xcf\x54\x1f\xfd\x0b\x8e\x54\x85\xc4\xda\x3e\xbe\xdd\xf9\x2a\x6a\xda\xd8\x38\x65\xfe\x3d\xe4\x97\x52\x17\xdf\xf9\x6e\xda\x49\x6d\xbe\xc3\x76\x2a\x65\xb2\xeb\x96\x5b\x8a\x27\x2c\x8b\x3c\x74\xc0\x73\xab\x56\xda\xe5\x36\xaa\xbb\x44\xa1\xe4\x7a\xb2\xbf\x19\x50\x6a\x13\x04\x26\x7e\x66\xcc\x9f\x8c\xa5\x4b\xe7\x7b\x01\xc0\x26\xc3\xa4\xec\x6a\x40\xdf\x79\x9e\x37\x01\x67\x56\xdd\xcc\x2a\xe9\xf2\x2c\xff\xb5\xc8\xd3\x1c\x13\x65\x8a\x10\x62\x23\xf8\x04\x45\x99\x93\x9f\xc7\x3a\x13\xff\x26\xfb\x82\xac\x8e\xe9\x0f\xb8\xbb\x74\x93\x20\xea\xf2\x4d\x69\x52\xc4\x98\x1c\xb6\xa8\x1b\x44\x07\x79\x2c\x13\xe2\xeb\x18\x9c\x29\xf6\xa9\x5a\xfa\x52\xa6\x8b\xab\xbc\x02\x9e\x25\xa9\xeb\x7a\x10\x72\x31\x4f\xe2\xd9\x9b\x8d\xe4\x76\x7b\xd9\x57\xd0\x77\x8e\x8b\xa8\x22\x11\xf5\xdf\x28\x91\xa6\x9a\x97\x31\x2e\xba\xf9\x53\x57\x92\x37\x33\x88\x76\x80\x2d\xc9\xfe\xad\x27\x21\x98\x47\xba\xaa\xc4\x06\xe1\xaf\xdf\x2c\x49\xc6\xf1\x55\xb3\x81\x32\x4c\x4c\x2a\xa3\xda\x78\x97\xbf\xed\xfb\x59\x5c\x72\xe1\xd7\xa8\x1c\x36\x95\x83\xd8\x91\xe1\xb4\xee\xf5\x5a\x5f\x63\xe3\x0c\xd6\x1f\x95\x5e\xc6\x43\xb5\xbd\x61\x03\xdf\x83\x63\xf2\x72\xc5\x13\xec\x91\x66\x39\x17\xd2\x23\x04\x85\x1d\x9d\x32\xae\x77\xc1\xb2\x88\xb6\xdb\xde\xa0\xbe\xdd\x6e\x6b\xdc\xec\x03\x96\x40\x84\x7f\xc8\xec\x3e\x76\xd7\x7c\xee\xaf\x27\xad\x8a\x8b\x76\x5c\xb3\x1f\xf7\x79\xcc\xe1\xca\x8c\x29\x39\x9a\x20\x5e\xef\x06\x3d\x1a\x37\x1c\xc2\xef\x86\xdc\x4f\x8d\x6b\xf0\x54\x65\xa6\xb2\xa5\x4f\x6b\x13\x09\x02\x5c\x69\x5f\x0d\x08\x6d\x1d\xb4\x19\xa5\x73\x41\xb7\x0d\x39\x6b\xe7\xad\xd3\xa3\x9a\x5d\xb0\xb6\xad\x1a\xdd\xca\x69\x3d\xcc\xae\xc2\x63\x40\xec\x32\x8a\x0f\xaf\x22\xa1\xca\xb3\xc8\x32\x4a\xdd\x3c\x75\xb6\x62\xbb\x95\xd8\x1b\xb7\xa6\xe1\x33\x19\x46\xb7\xb2\xf3\x61\xcd\x4c\xc5\x19\x19\x23\x5f\x0a\x96\x53\xef\xb1\x64\xf3\xf8\xd9\x64\xb3\x4d\x1d\x8e\x54\xfd\xea\x4e\x85\xd0\xfd\x07\xf4\xd7\xf7\xaf\xdf\x5d\xc4\x59\x74\xb2\x1d\x66\x63\xab\x7b\xa3\xd3\x0f\xf7\xab\xae\xe6\xf1\x76\x67\x7b\xc7\xf5\xc8\x9f\xeb\x80\xa4\x8a\x8f\xea\x75\xc8\x6b\x6b\xcb\xfe\x5b\xb7\xed\x40\xb8\xa8\xdf\xf6\x88\x36\xd3\x71\xf3\x80\x29\x40\xa6\x91\xfa\x45\x5a\x0d\x5d\x42\x2d\xdf\xc3\x1b\x62\x72\x49\x1f\xaf\x41\xc7\x8e\x0f\x40\x32\x81\x97\xe8\x3f\x74\x55\x58\xb5\x9e\x44\x97\x27\x34\x70\xbc\xa1\x6d\xd6\x43\x38\xb3\x3b\x65\xfb\xbb\xde\x05\x10\x27\xea\x34\x30\x2d\x04\x17\x33\x6b\xce\x52\xfa\x5d\xd1\x39\xee\x47\x3a\x19\xc8\x12\x76\x6a\x15\x40\x83\xa8\x5a\x66\x19\x81\xb9\xbc\x19\x4b\xe9\xeb\x2d\xf6\x11\xb3\x2f\xd2\xd4\x1d\x66\xf1\xd3\x5c\xf6\x2d\xed\xdf\x11\xad\x0c\x37\xd6\x7a\x77\xf3\xc5\x62\x85\xbd\x38\x76\x23\x67\x22\x67\xf9\x13\x74\x9c\xcb\x32\xf1\xbb\xd6\x66\x37\xfe\x5d\xab\x28\xb6\x29\x0b\xf9\x35\xae\xb8\x56\xb0\x1d\xb9\xbf\xda\x80\x97\xbf\xbe\x06\x78\x5c\x72\x7b\xd5\xc9\x94\xc3\x50\xf0\x1f\xc0\x06\xbc\x19\x21\x9e\x10\x9f\xaa\x93\x8b\x9c\xf5\xae\xc3\x4e\xe5\x90\xe8\x9f\x35\xb4\xbb\x7b\x43\x5f\xfc\x26\x90\xab\x64\xe7\x45\xaa\x61\x3b\x86\x8d\xcd\x8a\x78\x11\xd4\x56\x16\x19\x6a\xd7\x42\x15\xb8\x21\x15\xf6\x4c\x94\xcd\xad\xc6\x1d\x5c\xc5\xad\x13\xdf\x8a\xaf\xd4\x1b\x81\xfd\x7c\xf4\xf9\xab\x30\x7b\x3f\xf7\x87\x35\xbd\x86\xa4\x11\xc8\xbb\x91\x79\x7b\x6a\x47\xd7\x95\xb7\x45\xdb\x90\x63\x20\x26\x84\xb9\x22\xa9\xbe\x8c\xe0\x78\xac\xe9\x0d\x2f\xb5\xcc\x7d\x94\xe1\x5b\x72\x96\x29\xdf\xb5\x87\xd9\x23\x32\x93\x75\xb3\x4e\x3a\xaf\xd6\x1e\x39\xfd\x5f\xc2\x69\x5f\x00\x18\x09\xb2\x35\x09\x96\x8f\xaf\xdd\xe4\x2f\x09\xad\x05\x85\xe2\x49\x7f\x66\xb9\xeb\x9c\x91\x00\x01\x08\xd9\x3d\x19\x01\xf8\x07\x10\xb2\xe7\x67\x73\x0d\x03\x7c\xb4\xbe\xdc\x03\xa0\x52\x77\xf7\x03\x19\x5e\x64\x01\xb5\xfb\xff\xb5\x10\x39\x8e\xa1\x51\xd5\xff\xa1\x7f\x64\x77\xd3\xb7\xb3\x81\xad\xf9\x7d\x20\x9f\xed\xdf\xdf\x09\xbb\x24\xf0\xcd\x4e\xf7\x53\x98\xfd\x9d\xec\xbc\xfa\x37\x00\x00\xff\xff\xe9\x40\xfd\x3d\x80\x29\x00\x00")

func assetsStyleStyleCssBytes() ([]byte, error) {
	return bindataRead(
		_assetsStyleStyleCss,
		"assets/style/style.css",
	)
}

func assetsStyleStyleCss() (*asset, error) {
	bytes, err := assetsStyleStyleCssBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "assets/style/style.css", size: 10624, mode: os.FileMode(420), modTime: time.Unix(1511576303, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"assets/index.html": assetsIndexHtml,
	"assets/images/loader.svg": assetsImagesLoaderSvg,
	"assets/script/script.js": assetsScriptScriptJs,
	"assets/style/style.css": assetsStyleStyleCss,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}
var _bintree = &bintree{nil, map[string]*bintree{
	"assets": &bintree{nil, map[string]*bintree{
		"images": &bintree{nil, map[string]*bintree{
			"loader.svg": &bintree{assetsImagesLoaderSvg, map[string]*bintree{}},
		}},
		"index.html": &bintree{assetsIndexHtml, map[string]*bintree{}},
		"script": &bintree{nil, map[string]*bintree{
			"script.js": &bintree{assetsScriptScriptJs, map[string]*bintree{}},
		}},
		"style": &bintree{nil, map[string]*bintree{
			"style.css": &bintree{assetsStyleStyleCss, map[string]*bintree{}},
		}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}


func assetFS() *assetfs.AssetFS {
	assetInfo := func(path string) (os.FileInfo, error) {
		return os.Stat(path)
	}
	for k := range _bintree.Children {
		return &assetfs.AssetFS{Asset: Asset, AssetDir: AssetDir, AssetInfo: assetInfo, Prefix: k}
	}
	panic("unreachable")
}
