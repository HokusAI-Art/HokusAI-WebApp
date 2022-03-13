<div id="top"></div>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/HokusAI-Art/HokusAI-WebApp/blob/main/public/android-chrome-512x512.png?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">HokusAI</h3>

  <p align="center">
    Have an idea but don't know how to draw it? Let HokusAI help you!
    <br />
    <a href="https://dazhizhong.gitbook.io/pixray-docs/docs/primary-settings"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://hokus-ai-app.herokuapp.com">View Demo</a>
    ·
    <a href="https://github.com/HokusAI-Art/HokusAI-WebApp/issues">Report Bug</a>
    ·
    <a href="https://github.com/HokusAI-Art/HokusAI-WebApp/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#color-theme">Color Theme</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![](https://storage.googleapis.com/hokusai-891a9.appspot.com/generated_images/9jK42O8L8cSTA080A3qcwO53TO62_fcc48820-d282-4b42-877c-d0a901378146.png)

Named after the famous painter Katsushika Hokusai (葛飾北斎) – think of the Great Wave painting – HokusAI is built to turn your dreams into reality. Here is an example image we generated from the prompt "a fantasy magical cottage in the woods." Built with pixray, our deep learning architecture leverages state-of-the-art models from OpenAI's Contrastive Language–Image Pre-training (CLIP) architecture and University Heidelberg's Vector Quantized Generative Adversarial Network (VQGAN).

CLIP in particular excells at what is called zero-shot learning, which means it performs very well even if it has no background knowledge

Here's how it works in a simple sense
* CLIP takes in text/images and outputs their similarity
* VQGAN works by putting 2 neural networks in a battle to the end
  * The first neural network is called a Generator, and its job is to produce fake outputs given some input. You can think of this guy as a counterfeiter
  * The second neural network is called a Discriminator, and its job is to make determine whether the its inputs are real or fake. You can think of this guy as the cop
  * These two are locked in a zero-sum game, and eventually, the goal is to have the Generator produce outputs indifferentiable from the original dataset you want to mimic
* Essentially, we have VQGAN generate images and CLIP tells us how good they are. Then, we teach it to do better

![](https://ljvmiranda921.github.io/assets/png/vqgan/gan_inside.png)

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* React Router
* Node.js
* PyTorch
* Firebase
* WebXR
* Pixray
* and much more!

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
Make sure you have node (version 14+) installed.

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/HokusAI-Art/HokusAI-WebApp
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. Create file called '.env.local' with the Firebase JSON credentials for a web application:
    ```text
    REACT_APP_FIREBASE_API_KEY={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"...","measurementId":"..."}
    ```

Make sure your backend is up and running to generate the images! Run the app with `yarn start`

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Color Theme -->
## Color Theme
![](https://blog.depositphotos.com/wp-content/uploads/2020/01/Cyberpunk-color-palettes_10.jpg.webp)


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Richard Luo - [sites.gatech.edu/richard](sites.gatech.edu/richard)

Deepak Ramalingam - [https://rdeepak2002.github.io/#/home](https://rdeepak2002.github.io/#/home)

Lucas Yim - [https://github.com/ldyim](https://github.com/ldyim)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Here are some cool resources to check out!

* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [CLIP](https://openai.com/blog/clip/)
* [VQGAN](https://compvis.github.io/taming-transformers/)
* [Pixray](https://github.com/pixray/pixray)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/HokusAI-Art/HokusAI-WebApp.svg?style=for-the-badge
[contributors-url]: https://github.com/HokusAI-Art/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/HokusAI-Art/HokusAI-WebApp.svg?style=for-the-badge
[stars-url]: https://github.com/HokusAI-Art/HokusAI-WebApp/stargazers
[issues-shield]: https://img.shields.io/github/issues/HokusAI-Art/HokusAI-WebApp.svg?style=for-the-badge
[issues-url]: https://github.com/HokusAI-Art/HokusAI-WebApp/issues
[license-shield]: https://img.shields.io/github/license/HokusAI-Art/HokusAI-WebApp?style=for-the-badge
[license-url]: https://github.com/HokusAI-Art/HokusAI-WebApp/blob/main/LICENSE
