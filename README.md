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

`TODO`

## Install

You should have a working Raspberry Pi environment with Node.js v5
or higher and git installed.

1. Clone this repo : `git clone https://github.com/3000d/aleastory-server.git`
1. Run `cd aleastory-server`
1. Run `npm install`

## Run

- In dev env : `npm run dev`
- In prod env : `npm run prod`

## HTTP Server for debug

A HTTP Server is available for you to play with the printer. run `cd src/web && node run.js`.
The default port is 8080, so you can access it with `http://localhost:8080`.
You can change it in `src/config/config.js`.

### Note on Raspbian Wheezy

On ARM architecture, addons are compiled on install.
To compile addons for Node.js v4 or higher on Raspbian Wheezy,
gcc/g++ 4.8 or higher are required. Raspbian Wheezy ships with
gcc/g++ 4.6. On a Raspberry Pi, one easy way to get gcc/g++ 4.9 is to use Raspbian Jessie
rather that Raspbian Wheezy. Raspbian Jessie is available for download at
raspberrypi.org. Alternatively, optional gcc/g++ compilers are available for
Raspbian Wheezy and can be installed as described in [this link](https://github.com/fivdi/onoff/wiki/Node.js-v4-and-native-addons)



## GPIO

`TODO`
