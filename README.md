# Aleastory Server

Node js server that runs on a Raspberry Pi and serves random stories when someone pushes a button.

* Controls the thermal printer from Adafruit, LEDs and button.
* Serves a random story (image or text) when button is pushed.
* If there's an available internet connexion, fetches data from a webservice and synchronizes it with local data
* Parses markdown in text stories
* Format text to display well on paper (only ~30 characters per line)
* Serves an web interface in debug environment that interacts with the printer

## Material

* Raspberry Pi
* Thermal Printer from Adafruit or Sparkfun
* Push button
* Green LED
* Red LED

## Run

`TODO`

## Install

You should have a working Raspberry Pi environment with nodejs and git installed.

1. Clone this repo : `git clone https://github.com/3000d/aleastory-server.git`
1. Run `cd aleastory-server`
1. Run `npm install`

## GPIO

`TODO`
