# selve-usb-rf
Simple service for use with Selve USB-RF module

To run in Docker, given our stick is accessible via `/dev/ttyUSB0`, execute the following:

`docker run -d -p 8080:8080 --device=/dev/ttyUSB0 --restart=always --name=selve-usb stryjek4/selve-usb-rf`
