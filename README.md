# Caption Kirk

Live captioning using the Deepgram live streaming API from a Node.js server.

## Quickstart

### Manual

Follow these steps to get started with this starter application.

#### Clone the repository

Go to GitHub and [clone the repository](https://github.com/pretherford/caption-kirk.git).

#### Install dependencies

Install the project dependencies.

```bash
npm install
```

#### Edit the config file

Copy the code from `sample.env` and create a new file called `.env`. Paste in the code and enter your API key you generated in the [Deepgram console](https://console.deepgram.com/).

```js
DEEPGRAM_API_KEY=%api_key%
```

#### Select branch

The `main` branch demonstrates a native websockets implementation.


#### Run the application

The `start` script will run a web and API server concurrently. Once running, you can [access the application in your browser](http://localhost:3000/).

```bash
npm run start
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. 

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! 

## Author

Paul Retherford

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
