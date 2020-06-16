const tf = require('@tensorflow/tfjs-node');
const { Image } = require("image-js");

global.fetch = require('node-fetch');

const IMAGE_H = 299;
const IMAGE_W = 299;
const NUM_PIXELS = IMAGE_H*IMAGE_W;

const NUMBER_OF_CHANNELS = 3;


// СПИСОК ЗНАЧЕНЬ ХАРАКТЕРИСТИК

const characteristics =
[
    ["black", "brown", "grey", "red", "white"],
    ["blue", "green", "yellow"],
    ["no", "yes"]
];

class NeuronNetwork {
  constructor() {
    this.modelColor = null;
    this.modelEyeColor = null;
    this.modelFluffy = null;
    //this.models = await loadModels();

  }


  async getInfo(path) {
      await this.loadModels();

      const tensor4 = await this.convertImage(path);

        console.log(tensor4);
        const catInfo =
        {
            color : characteristics[0][this.modelColor.predict(tensor4).gather(0).argMax().dataSync()[0]],
            eyeColor : characteristics[1][this.modelEyeColor.predict(tensor4).gather(0).argMax().dataSync()[0]],
            fluffy : characteristics[2][this.modelFluffy.predict(tensor4).gather(0).argMax().dataSync()[0]]
        };

        console.dir(this.modelColor.predict(tensor4));
        return catInfo;
  };

  async loadModels () {
      try{
          this.modelColor = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\color_converted\\model.json");
          this.modelEyeColor = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\eyeColor_converted\\model.json");
          this.modelFluffy = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\fluffy_converted\\model.json");
      }


      catch(error){
          console.log(error);
      }
      return;
  };

  async convertImage(path) {
      const imageCat = await Image.load(path);
          const imageCatResize = imageCat.resize({ width: IMAGE_W, height: IMAGE_H });
          const pixelsAlfa = imageCatResize.data;

           const pixels = new Float32Array(NUM_PIXELS * NUMBER_OF_CHANNELS);

          for (let i = 0; i < NUM_PIXELS; i++) {
              for (let channel = 0; channel < NUMBER_OF_CHANNELS; ++channel) {
  	           pixels[i * NUMBER_OF_CHANNELS + channel] =  pixelsAlfa[i * 4 + channel]/255;
  	       }
          }

          const tensor1 = tf.tensor1d(pixels);
          const tensor4 = tensor1.reshape([1, IMAGE_H, IMAGE_W, NUMBER_OF_CHANNELS]);

          return tensor4;
  };
};

module.exports = NeuronNetwork;
