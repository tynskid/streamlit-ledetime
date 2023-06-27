#!/bin/bash

sudo make package
sudo make install
sudo rm -R /usr/local/lib/python3.9/dist-packages/streamlit
sudo cp -R /usr/lib/python3.9/site-packages/streamlit-1.22.0-py3.9.egg/streamlit /usr/local/lib/python3.9/dist-packages
