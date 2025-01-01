import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Box } from '@chakra-ui/react';

const WaveformVisualizer = ({ isRecording, audioBlob }) => {
    const canvasRef = useRef(null);
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const analyzerRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafIdRef = useRef(null);

    useEffect(() => {
        if (!waveformRef.current) return;

        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#4db8ff',
            progressColor: '#006bb3',
            cursorColor: '#1aa3ff',
            barWidth: 2,
            barGap: 1,
            height: 100,
            normalize: true,
            responsive: true,
            interact: true,
            backend: 'WebAudio'
        });

        return () => {
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const setupVisualization = async () => {
            if (isRecording && canvasRef.current) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 44100
                        }
                    });
                    mediaStreamRef.current = stream;

                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioContext.createMediaStreamSource(stream);
                    const analyzer = audioContext.createAnalyser();
                    analyzer.fftSize = 2048;
                    source.connect(analyzer);
                    analyzerRef.current = analyzer;

                    const bufferLength = analyzer.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    dataArrayRef.current = dataArray;

                    const canvas = canvasRef.current;
                    const canvasCtx = canvas.getContext('2d');

                    // Set canvas size
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;

                    const draw = () => {
                        rafIdRef.current = requestAnimationFrame(draw);
                        analyzer.getByteTimeDomainData(dataArray);

                        canvasCtx.fillStyle = 'rgb(240, 240, 240)';
                        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
                        canvasCtx.lineWidth = 2;
                        canvasCtx.strokeStyle = '#4db8ff';
                        canvasCtx.beginPath();

                        const sliceWidth = canvas.width * 1.0 / bufferLength;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            const v = dataArray[i] / 128.0;
                            const y = v * canvas.height / 2;

                            if (i === 0) {
                                canvasCtx.moveTo(x, y);
                            } else {
                                canvasCtx.lineTo(x, y);
                            }

                            x += sliceWidth;
                        }

                        canvasCtx.lineTo(canvas.width, canvas.height / 2);
                        canvasCtx.stroke();
                    };

                    draw();
                } catch (err) {
                    console.error('Visualization error:', err);
                }
            } else {
                if (mediaStreamRef.current) {
                    mediaStreamRef.current.getTracks().forEach(track => track.stop());
                }
                if (rafIdRef.current) {
                    cancelAnimationFrame(rafIdRef.current);
                }
            }
        };

        setupVisualization();
    }, [isRecording]);

    useEffect(() => {
        if (audioBlob && wavesurferRef.current && !isRecording) {
            const audioUrl = URL.createObjectURL(audioBlob);
            wavesurferRef.current.load(audioUrl);
            return () => URL.revokeObjectURL(audioUrl);
        }
    }, [audioBlob, isRecording]);

    return (
        <Box position="relative" width="100%" height="120px">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: isRecording ? 'block' : 'none',
                    borderRadius: '8px',
                    backgroundColor: 'rgb(240, 240, 240)',
                }}
            />
            <Box
                ref={waveformRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: isRecording ? 'none' : 'block',
                    borderRadius: '8px',
                    backgroundColor: 'rgb(240, 240, 240)',
                }}
            />
        </Box>
    );
};

export default WaveformVisualizer; 