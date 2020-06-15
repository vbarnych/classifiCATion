//const tf = require("@tensorflow/tfjs"); // тензорфлоу
const tf = require('@tensorflow/tfjs-node');
const { Image } = require("image-js");

global.fetch = require('node-fetch');

const IMAGE_H = 299;
const IMAGE_W = 299;
const NUM_PIXELS = IMAGE_H*IMAGE_W;

const NUMBER_OF_CHANNELS = 3;

const divide255 = 0.00392157; // 1/255


// СПИСОК ЗНАЧЕНЬ ХАРАКТЕРИСТИК

const characteristics =
[
    ["black", "brown", "grey", "red", "white"],
    ["blue", "green", "yellow"],
    ["no", "yes"]
];

let modelColor;
let modelEyeColor;
let modelFluffy;

const loadModels = async() => {
    try{
        modelColor = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\color_converted\\model.json");
        modelEyeColor = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\eyeColor_converted\\model.json");
        modelFluffy = await tf.loadLayersModel("file:///GitLab\\classifiCATion\\fluffy_converted\\model.json");
    }

    catch(error){
        console.log(error);
    }
}


const convertImage = async(path) => {
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
}

const getInfo = async(path) => {
    const tensor4 = await convertImage(path);

    const catInfo =
    {
        color : characteristics[0][modelColor.predict(tensor4).gather(0).argMax().dataSync()[0]],
        eyeColor : characteristics[1][modelEyeColor.predict(tensor4).gather(0).argMax().dataSync()[0]],
        fluffy : characteristics[2][modelFluffy.predict(tensor4).gather(0).argMax().dataSync()[0]]
    };

    console.dir(catInfo);
}

(async() => {
    await loadModels();
    //await getInfo("cat.jpg");

    await getInfo("C:\\GitLab\\classifiCATion\\color_converted\\1.jpg");




})();




/*(async() => {
    try{

        // ЗАГРУЖАЄМО МОДЕЛІ

        const modelColor = await tf.loadLayersModel("file:///Users\\User\\Desktop\\WASinDesktop\\cnnCats\\color_converted\\model.json");
        const modelEyeColor = await tf.loadLayersModel("file:///Users\\User\\Desktop\\WASinDesktop\\cnnCats\\eyeColor_converted\\model.json");
        const modelFluffy = await tf.loadLayersModel("file:///Users\\User\\Desktop\\WASinDesktop\\cnnCats\\fluffy_converted\\model.json");

        // КОНВЕРТУЄМО КАРТИНКУ В ТЕНЗОР ДЛЯ ПРОГНОЗУВАННЯ

       const imageCat = await Image.load('cat.jpg');
        const imageCatResize = imageCat.resize({ width: 299, height: 299 });
        const pixelsAlfa = imageCatResize.data;

         const pixels = new Float32Array(NUM_PIXELS * NUMBER_OF_CHANNELS);

        for (let i = 0; i < NUM_PIXELS; i++) {
            for (let channel = 0; channel < NUMBER_OF_CHANNELS; ++channel) {
	           pixels[i * NUMBER_OF_CHANNELS + channel] =  pixelsAlfa[i * 4 + channel]/255;
	       }
        }
        const tensor1 = tf.tensor1d(pixels);
        const tensor4 = tensor1.reshape([1, IMAGE_H, IMAGE_W, NUMBER_OF_CHANNELS]);




        // ЗАПИС ПРОГНОЗІВ В ОБ'ЄКТ


        const catInfo = {color : "", eyeColor : "", fluffy : ""};

        catInfo.color = characteristics[0][modelColor.predict(tensor4).gather(0).argMax().dataSync()[0]];
        catInfo.eyeColor = characteristics[1][modelEyeColor.predict(tensor4).gather(0).argMax().dataSync()[0]];
        catInfo.fluffy = characteristics[2][modelFluffy.predict(tensor4).gather(0).argMax().dataSync()[0]];

        console.dir(catInfo);

    }
    catch(error){
        //console.error(error);
        console.log(error);
    }
})();*/
