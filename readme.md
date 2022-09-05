# Griffins Scout

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)![SolidJS](https://img.shields.io/badge/SolidJS-2c4f7c?style=for-the-badge&logo=solid&logoColor=c8c9cb)![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)

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
