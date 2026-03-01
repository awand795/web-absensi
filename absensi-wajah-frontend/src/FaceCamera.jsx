import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import api from './api/axios';

const FaceCamera = () => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [allFaces, setAllFaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/');
            return;
        }

        const loadModels = async () => {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.load(MODEL_URL),
                faceapi.nets.faceLandmark68Net.load(MODEL_URL),
                faceapi.nets.faceRecognitionNet.load(MODEL_URL),
            ]);
            setModelsLoaded(true);
        };

        const loadFaces = async () => {
            try {
                const res = await api.get('/users/faces');
                setAllFaces(res.data.data || []);
            } catch (err) {
                console.error('Failed to load faces:', err);
            }
        };

        loadModels();
        loadFaces();
    }, [navigate]);

    const euclideanDistance = (desc1, desc2) => {
        return Math.sqrt(desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0));
    };

    const findMatchingUser = (descriptor) => {
        let bestMatch = null;
        let bestDistance = Infinity;
        const THRESHOLD = 0.6;

        for (const face of allFaces) {
            const embedding = typeof face.face_embedding === 'string'
                ? JSON.parse(face.face_embedding)
                : face.face_embedding;

            const distance = euclideanDistance(descriptor, embedding);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = face;
            }
        }

        if (bestDistance < THRESHOLD) {
            return { user: bestMatch, distance: bestDistance };
        }
        return null;
    };

    const handleAttendance = async () => {
        if (!webcamRef.current) return;

        const imageSrc = webcamRef.current.getScreenshot();
        const img = await faceapi.fetchImage(imageSrc);

        const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (detection) {
            const faceDescriptor = Array.from(detection.descriptor);

            const match = findMatchingUser(faceDescriptor);
            if (!match) {
                alert("Wajah tidak dikenali. Silakan daftarkan wajah terlebih dahulu.");
                return;
            }

            try {
                await api.post('/clock-in', {
                    shift_id: 1,
                    image_path: imageSrc
                });

                alert(`Absen Berhasil! Selamat datang, ${match.user.name}`);
            } catch (err) {
                alert('Absen Gagal: ' + (err.response?.data?.message || err.message));
            }
        } else {
            alert("Wajah tidak terdeteksi");
        }
    };

    return (
        <div>
            {modelsLoaded ? (
                <>
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
                    <button onClick={handleAttendance}>Klik untuk absen</button>
                </>
            ) : (
                <p>Loading model...</p>
            )}
        </div>
    );
};

export default FaceCamera;
