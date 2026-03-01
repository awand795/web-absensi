import * as faceapi from "face-api.js";

let modelsPromise = null;

export function loadModels() {
    if (!modelsPromise) {
        modelsPromise = Promise.all([
            faceapi.nets.tinyFaceDetector.load('/models'),
            faceapi.nets.ssdMobilenetv1.load('/models'),
            faceapi.nets.faceLandmark68Net.load('/models'),
            faceapi.nets.faceRecognitionNet.load('/models'),
        ]);
    }
    return modelsPromise;
}

export async function detectFace(videoOrImg) {
    // Coba SSD dulu (lebih akurat), fallback ke TinyFaceDetector (lebih cepat)
    let detection = await faceapi
        .detectSingleFace(videoOrImg, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

    if (!detection) {
        detection = await faceapi
            .detectSingleFace(videoOrImg, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 }))
            .withFaceLandmarks()
            .withFaceDescriptor();
    }

    return detection;
}
