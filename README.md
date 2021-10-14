<p align="center">
  <img
    width="400"
    src="https://github.com/HiberFile/HiberFile/raw/main/assets/images/png/logos/transparentGradient.png"
    alt="HiberFile"
  />
</p>
<p align="center">
  <a href="https://github.com/hiberfile/hiberapi/stargazers"
    ><img
      src="https://img.shields.io/github/stars/hiberfile/hiberapi?style=flat-square"
      alt="GitHub Stars"
  /></a> 
  <a href="LICENSE"
    ><img
      src="https://img.shields.io/github/license/hiberfile/hiberapi?style=flat-square"
      alt="GPL-3.0 License"
  /></a>  
  <a href=""
    ><img
      src="https://img.shields.io/github/languages/top/hiberfile/hiberapi?style=flat-square"
          alt="Top language"/></a>
  <a href="https://twitter.com/HiberFile"
    ><img
      src="https://img.shields.io/badge/twitter-@HiberFile-1DA1F3?style=flat-square"
      alt="Follow @HiberFile on Twitter"
  /></a> 
</p>

<p align="center">
  <a href="https://hiberfile.com">Website</a>
  ·
  <a href="#🚀-quick-start">Quick start</a>
</p>

**The API of [HiberFile](https://github.com/hiberfile/hiberfile).**

## 🚀 Quick start

### Prerequisites

- [Node.js and npm](https://nodejs.org/en/download/) installed on your computer.

### Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/hiberfile/hiberapi.git
   ```

2. Install dependancies:

   ```sh
   cd hiberapi && npm install
   ```
   
3. Generate and download your AWS credentials. You must have a file `credentials` in the `.aws` directory.

   > You can follow [this official guide](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html).
   
4. Create the .env file and edit it (here is [an example](/.env.example)):

   ```sh
   cp .env.example .env
   nano .env
   ```
   
   > Note that you can use your favorite editor instead of `nano`, like `vi` or `mcedit`.
   
5. Check that the endpoint of the S3.

   ```sh
   nano src/utils/s3.ts
   ```
   Then, on the 19th line, check the endpoint.

6. Launch the dev server (optional):

   ```sh
   npm run dev
   ```

7. Start the server:

   ```sh
   npm run start
   ```

## 🤝 Contributing

If you are interested in helping contribute to **HiberFile**, feel free to open a pull request.

### Code Contributors

<!-- This project exists thanks to all the people who [contribute](https://github.com/hiberfile/hiberapi/graphs/contributors). -->

<a href="https://github.com/hiberfile/hiberapi/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hiberfile/hiberapi" />
</a>

## 📝 License

© 2021 HiberFile Team

This project is [GPL-3.0](https://github.com/hiberfile/hiberfile/blob/master/LICENSE) licensed.
