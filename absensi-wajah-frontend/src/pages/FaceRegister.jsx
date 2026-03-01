import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import api from '../api/axios';
import { loadModels, detectFace } from '../lib/faceModels';

const FaceRegister = () => {
    const webcamRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadModels().then(() => setModelsLoaded(true));
    }, []);

    const handleRegister = async () => {
        if (!webcamRef.current || processing) return;
        setProcessing(true);
        setStatus('Mendeteksi wajah...');

        try {
            // Ambil langsung dari video element (lebih cepat daripada screenshot → fetchImage)
            const video = webcamRef.current.video;
            if (!video || video.readyState < 2) {
                setStatus('Kamera belum siap, coba lagi.');
                return;
            }

            const detection = await detectFace(video);

            if (!detection) {
                setStatus('Wajah tidak terdeteksi. Pastikan pencahayaan cukup dan wajah menghadap kamera.');
                return;
            }

            setStatus('Menyimpan data wajah...');
            const faceDescriptor = Array.from(detection.descriptor);
            // Kirim sebagai array, bukan JSON string — karena model UserFace cast ke array otomatis
            await api.put('/users/faces', { face_embedding: faceDescriptor });
            setStatus('Wajah berhasil didaftarkan!');
        } catch (err) {
            setStatus('Gagal: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="page-container">
            <h1>Daftar Wajah</h1>
            <p className="mb-2" style={{ color: '#6b7280' }}>Pastikan wajah terlihat jelas di kamera</p>
            <div className="card">
                {modelsLoaded ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                            style={{ width: '100%', maxWidth: 480, borderRadius: 8 }}
                        />
                        <div className="mt-1">
                            <button onClick={handleRegister} className="btn-primary" disabled={processing}>
                                {processing ? 'Memproses...' : 'Daftarkan Wajah'}
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Loading model...</p>
                )}
                {status && <p className="mt-1" style={{ fontWeight: 500 }}>{status}</p>}
            </div>
        </div>
    );
};

export default FaceRegister;
