# Griffins Scout

[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/) [![GitHub license](https://badgen.net/github/license/Naereen/Strapdown.js)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)

A scouting app designed for FRC by Team 1884 but can also be used to scout VEX and FTC.

Paper getting hard to manage? Use scounting client to record teams on your phone and then save the data into a QR code. This is designed for events where wifi coverage is limited.

Currently, this is a work in progress.

- [x] scanner app needs to be able to go next match etc.
- [x] finish controller
- [x] write a giant script that spins everything up at the same time
- [x] escape hatch for scanner app that lets you pick match manually :)
- [ ] Create viewer app
- [ ] add subjective data
- [ ] blue alliance integration
- [ ] app UI redesign, bigger and easier to use buttons
- [ ] import export data

[Old Client](https://github.com/omagarwal25/scouting-client)
[Old Server](httpsL//github.com/omagarwal25/scouting-server)

## Usage

The app consists of four different apps alongside two libraries. Client should be loaded using expo onto all the phones and tablets that will be scouting. Controller, scanner, and viewer should all be running on the same LAN. Viewer is for looking at data. Scanner is for scanning and generating codes and controller handles the server.

In order to use anything you will need to spin up a client which requires a postgres database.

Make sure you run `yarn` before running anything.

Big script that will spin up everything.

```bash
yarn dev
```
