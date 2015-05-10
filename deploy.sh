#!/bin/sh
#git subtree push --prefix build/ origin gh-pages
git add *
git commit -m "udpate website" .
git push origin `git subtree split --prefix build/ master`:gh-pages --force
