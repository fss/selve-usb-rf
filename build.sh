#!/usr/bin/env bash
docker buildx buildx build --platform linux/arm/v7 -t stryjek4/selve-usb-rf .
docker push stryjek4/selve-usb-rf:latest
