cd assets && ./build.sh && cd -
go-bindata-assetfs \
  assets/index.html \
  assets/images/*.svg \
  assets/script/script.js \
  assets/style/style.css
