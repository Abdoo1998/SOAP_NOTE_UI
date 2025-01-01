import { useState, useRef, useCallback, useEffect } from 'react'
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    useToast,
    Card,
    CardBody,
    Progress,
    Flex,
    HStack,
    Icon,
    Badge,
    Divider,
    useColorModeValue,
    Input,
    VisuallyHidden,
    Image,
    Tooltip,
    SimpleGrid,
    Stack,
    ButtonGroup,
    IconButton,
    InputGroup,
    InputLeftElement,
    Select,
    Avatar,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react';
import {
    FaMicrophone,
    FaStop,
    FaUpload,
    FaTrash,
    FaClock,
    FaPlay,
    FaPause,
    FaFile,
    FaLanguage,
    FaHospital,
    FaUserMd,
    FaNotesMedical,
    FaStethoscope,
    FaHeartbeat,
    FaPrescription,
    FaFileMedical,
    FaFileMedicalAlt,
    FaMedkit,
    FaCheckCircle,
    FaChartBar,
    FaSearch,
    FaBell,
    FaCog,
    FaCalendar,
    FaDownload,
    FaEdit,
    FaEllipsisV,
    FaLungs,
    FaBrain,
    FaBone,
    FaPlus,
} from 'react-icons/fa'
import axios from 'axios'
import WaveformVisualizer from './components/WaveformVisualizer'
import EditableSoapNote from './components/EditableSoapNote'
import Sidebar from './components/Sidebar'
import EnhancedRecorder from './components/EnhancedRecorder'

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(66, 153, 225, 0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
  70% { box-shadow: 0 0 20px 10px rgba(66, 153, 225, 0.2); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
`;

function App() {
    const [isRecording, setIsRecording] = useState(false)
    const [soapNote, setSoapNote] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0)

    // Add new states for stats and notes history
    const [stats, setStats] = useState({
        totalRecords: 0,
        processingTime: 0,
        successRate: 0,
        totalNotes: 0
    })
    const [previousNotes, setPreviousNotes] = useState([])
    const [selectedNoteId, setSelectedNoteId] = useState(null)

    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])
    const audioRef = useRef(null)
    const recordingStartTimeRef = useRef(null)
    const toast = useToast()
    const timerIntervalRef = useRef(null)
    const fileInputRef = useRef(null);

    const bgGradient = useColorModeValue(
        'linear(to-br, blue.50, teal.50)',
        'linear(to-br, gray.900, blue.900)'
    )
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('blue.100', 'gray.700')
    const accentColor = useColorModeValue('blue.500', 'blue.300')
    const textColor = useColorModeValue('gray.700', 'gray.100')
    const subTextColor = useColorModeValue('gray.600', 'gray.400')
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700')

    // Add template states
    const [templates] = useState({
        cardiology: {
            name: "Cardiology Template",
            description: "Standard heart examination",
            icon: FaHeartbeat,
            template: `
==============================================
                SOAP NOTE
==============================================
Date: [Current Date]
Provider: Dr. [Name]
Specialty: Cardiology
==============================================

SUBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Chief Complaint:
  ▢ Cardiac symptoms
  ▢ Duration and severity

• Cardiovascular Review:
  ▢ Chest pain/pressure
  ▢ Palpitations
  ▢ Dyspnea
  ▢ Edema
  ▢ Syncope

• Risk Factors:
  ▢ Hypertension
  ▢ Diabetes
  ▢ Smoking
  ▢ Family history
  ▢ Hyperlipidemia

OBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Vital Signs:
  ▢ Blood pressure
  ▢ Heart rate
  ▢ Respiratory rate
  ▢ Temperature
  ▢ O2 saturation

• Cardiovascular Examination:
  ▢ Heart sounds
  ▢ Rhythm
  ▢ Murmurs
  ▢ JVD
  ▢ Peripheral pulses
  ▢ Edema

• Diagnostic Results:
  ▢ ECG findings
  ▢ Chest X-ray
  ▢ Recent labs
  ▢ Echo results

ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Primary Cardiac Diagnosis:
  ▢ Condition
  ▢ Severity
  ▢ Stability

• Risk Stratification:
  ▢ Cardiovascular risk
  ▢ Comorbidities
  ▢ Complications

PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Medications:
  ▢ Antihypertensives
  ▢ Antiarrhythmics
  ▢ Anticoagulation
  ▢ Other cardiac meds

• Procedures/Testing:
  ▢ Scheduled tests
  ▢ Referrals
  ▢ Monitoring plan

• Patient Education:
  ▢ Lifestyle modifications
  ▢ Diet/exercise
  ▢ Medication compliance
  ▢ Warning signs

• Follow-up:
  ▢ Next appointment
  ▢ Monitoring parameters
  ▢ Emergency instructions`
        },
        pulmonary: {
            name: "Pulmonary Template",
            description: "Respiratory assessment",
            icon: FaLungs,
            template: "... pulmonary template content ..."
        },
        neurology: {
            name: "Neurology Template",
            description: "Neurological examination",
            icon: FaBrain,
            template: "... neurology template content ..."
        },
        orthopedic: {
            name: "Orthopedic Template",
            description: "Musculoskeletal exam",
            icon: FaBone,
            template: "... orthopedic template content ..."
        },
        gastro: {
            name: "Gastro Template",
            description: "Digestive system exam",
            icon: FaHospital,
            template: `
==============================================
                SOAP NOTE
==============================================
Date: [Current Date]
Provider: Dr. [Name]
Specialty: Gastroenterology
==============================================

SUBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Chief Complaint:
  ▢ Gastrointestinal symptoms
  ▢ Duration and severity

• GI Review:
  ▢ Abdominal pain
  ▢ Nausea/vomiting
  ▢ Changes in appetite
  ▢ Bowel habits
  ▢ Weight changes

• Diet History:
  ▢ Current diet
  ▢ Food triggers
  ▢ Dietary restrictions
  ▢ Recent changes

OBJECTIVE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Vital Signs:
  ▢ Blood pressure
  ▢ Heart rate
  ▢ Temperature
  ▢ Weight
  ▢ BMI

• Abdominal Examination:
  ▢ Inspection
  ▢ Auscultation
  ▢ Palpation
  ▢ Tenderness
  ▢ Masses
  ▢ Organomegaly

• Diagnostic Results:
  ▢ Lab findings
  ▢ Imaging results
  ▢ Endoscopy findings
  ▢ Other tests

ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Primary GI Diagnosis:
  ▢ Condition
  ▢ Severity
  ▢ Stage

• Differential Diagnoses:
  ▢ Alternative conditions
  ▢ Rule-outs
  ▢ Complications

PLAN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Medications:
  ▢ Current medications
  ▢ New prescriptions
  ▢ Adjustments
  ▢ OTC recommendations

• Procedures/Testing:
  ▢ Scheduled procedures
  ▢ Lab orders
  ▢ Imaging orders
  ▢ Referrals

• Diet/Lifestyle:
  ▢ Dietary modifications
  ▢ Lifestyle changes
  ▢ Trigger avoidance
  ▢ Exercise recommendations

• Follow-up:
  ▢ Next appointment
  ▢ Monitoring plan
  ▢ Emergency instructions
  ▢ Patient education`
        },
        general: {
            name: "General Template",
            description: "Basic examination",
            icon: FaPlus,
            template: "... general template content ..."
        }
    });

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob)
            const audio = new Audio(url)

            const handleLoadedMetadata = () => {
                if (audio.duration && !isNaN(audio.duration)) {
                    setDuration(audio.duration);
                }
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioRef.current = audio;

            // If the audio is already loaded, set duration immediately
            if (audio.duration && !isNaN(audio.duration)) {
                setDuration(audio.duration);
            }

            return () => {
                URL.revokeObjectURL(url);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current = null;
                }
            }
        }
    }, [audioBlob]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            })
            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            })
            chunksRef.current = []
            setElapsedTime(0)

            timerIntervalRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1)
            }, 1000)

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data)
                }
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
                setAudioBlob(blob)
                if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current)
                    timerIntervalRef.current = null
                }
            }

            mediaRecorderRef.current.start(100)
            setIsRecording(true)
            setSoapNote('')
        } catch (error) {
            console.error('Recording error:', error)
            toast({
                title: 'Error',
                description: 'Could not access microphone. Please check permissions.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
            // Timer will be stopped in onstop handler
        }
    }

    const togglePlayback = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => setIsPlaying(false)
        }
    }, [audioRef.current])

    // Function to generate unique ID
    const generateId = () => {
        return 'note_' + Math.random().toString(36).substr(2, 9);
    }

    // Function to update stats after successful note generation
    const updateStats = (processingTime) => {
        setStats(prev => ({
            totalRecords: prev.totalRecords + 1,
            processingTime: (prev.processingTime + processingTime) / 2, // Average processing time
            successRate: ((prev.successRate * prev.totalNotes) + 100) / (prev.totalNotes + 1), // Update success rate
            totalNotes: prev.totalNotes + 1
        }));
    }

    // Modified handleUpload to include stats and note history
    const handleUpload = async () => {
        if (!audioBlob) {
            toast({
                title: 'No Audio',
                description: 'Please record or upload an audio file first.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        const startTime = Date.now();
        const formData = new FormData();

        try {
            formData.append('file', audioBlob, 'recording.webm');
            const response = await axios.post('http://localhost:8000/transcribe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            if (!response.data.soap_note) {
                throw new Error('No SOAP note generated from the server');
            }

            const processingTime = (Date.now() - startTime) / 1000; // in seconds
            const noteId = generateId();
            const newNote = {
                id: noteId,
                content: response.data.soap_note,
                timestamp: new Date().toISOString(),
                patientId: `P${Math.floor(Math.random() * 10000)}`, // In real app, this would come from patient selection
                processingTime
            };

            setPreviousNotes(prev => [newNote, ...prev]);
            setSoapNote(response.data.soap_note);
            setSelectedNoteId(noteId);
            updateStats(processingTime);

            toast({
                title: 'Success',
                description: 'Recording processed successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to process the recording',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Function to load a previous note
    const handleNoteSelect = (noteId) => {
        const note = previousNotes.find(n => n.id === noteId);
        if (note) {
            setSoapNote(note.content);
            setSelectedNoteId(noteId);
        }
    };

    const resetRecording = useCallback(() => {
        setAudioBlob(null)
        setIsPlaying(false)
        setDuration(0)
        setElapsedTime(0)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current = null
        }
        setSoapNote('')
    }, [])

    const handleSoapNoteUpdate = (updatedContent) => {
        setSoapNote(updatedContent);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        };
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if file is an audio file
        if (!file.type.startsWith('audio/')) {
            toast({
                title: 'Invalid File Type',
                description: 'Please upload an audio file (WAV, MP3, etc.)',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        // Check file size (limit to 50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast({
                title: 'File Too Large',
                description: 'Please upload an audio file smaller than 50MB',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            // Reset states
            setDuration(0);
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            // Create blob and set it
            const blob = new Blob([await file.arrayBuffer()], { type: file.type });
            setAudioBlob(blob);

            toast({
                title: 'File Uploaded',
                description: 'Audio file uploaded successfully. Click "Process Audio" to generate the SOAP note.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error('File upload error:', error);
            toast({
                title: 'Upload Error',
                description: 'Failed to process the audio file. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Add template selection handler
    const handleTemplateSelect = (templateKey) => {
        const template = templates[templateKey];
        if (template) {
            setSoapNote(template.template);
            toast({
                title: `${template.name} Loaded`,
                description: 'Template has been loaded successfully.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
            {/* Left Sidebar */}
            <Box
                position="fixed"
                left={0}
                w="280px"
                h="100vh"
                bg={useColorModeValue('gray.900', 'gray.900')}
                borderRight="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                overflowY="auto"
                css={{
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        width: '6px',
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: useColorModeValue('gray.700', 'gray.600'),
                        borderRadius: '24px',
                    },
                }}
            >
                {/* Logo Section */}
                <Box p={6} borderBottom="1px" borderColor="whiteAlpha.100">
                    <HStack spacing={3}>
                        <Icon as={FaStethoscope} w={8} h={8} color="blue.400" />
                        <Heading size="lg" color="white" fontWeight="semibold">SOAP Note Generator</Heading>
                    </HStack>
                </Box>

                {/* Menu Section */}
                <VStack spacing={1} align="stretch" p={4}>
                    <Text color="gray.500" fontSize="xs" fontWeight="semibold" mb={2} px={4}>
                        MENU
                    </Text>

                    <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={FaChartBar} boxSize={4} />}
                        color="gray.400"
                        fontWeight="medium"
                        _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                        _active={{ bg: 'whiteAlpha.200', color: 'white' }}
                        fontSize="sm"
                        py={6}
                        px={4}
                        borderRadius="lg"
                    >
                        Dashboard
                    </Button>

                    <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={FaMicrophone} boxSize={4} />}
                        color="white"
                        bg="whiteAlpha.100"
                        fontWeight="medium"
                        _hover={{ bg: 'whiteAlpha.200' }}
                        fontSize="sm"
                        py={6}
                        px={4}
                        borderRadius="lg"
                    >
                        Voice Records
                    </Button>

                    <Button
                        variant="ghost"
                        justifyContent="flex-start"
                        leftIcon={<Icon as={FaNotesMedical} boxSize={4} />}
                        color="gray.400"
                        fontWeight="medium"
                        _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                        _active={{ bg: 'whiteAlpha.200', color: 'white' }}
                        fontSize="sm"
                        py={6}
                        px={4}
                        borderRadius="lg"
                    >
                        SOAP Notes
                    </Button>
                </VStack>

                {/* Medical Templates Section */}
                <Box p={4} borderTop="1px" borderColor="whiteAlpha.100">
                    <Text color="gray.500" fontSize="xs" fontWeight="semibold" mb={3} px={4}>
                        MEDICAL TEMPLATES
                    </Text>
                    <VStack align="stretch" spacing={1}>
                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaHeartbeat} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('cardiology')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.cardiology.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.cardiology.description}</Text>
                            </VStack>
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaLungs} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('pulmonary')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.pulmonary.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.pulmonary.description}</Text>
                            </VStack>
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaBrain} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('neurology')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.neurology.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.neurology.description}</Text>
                            </VStack>
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaBone} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('orthopedic')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.orthopedic.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.orthopedic.description}</Text>
                            </VStack>
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaHospital} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('gastro')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.gastro.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.gastro.description}</Text>
                            </VStack>
                        </Button>

                        <Button
                            variant="ghost"
                            justifyContent="flex-start"
                            leftIcon={<Icon as={FaPlus} boxSize={4} />}
                            color="gray.400"
                            fontWeight="medium"
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            fontSize="sm"
                            py={4}
                            px={4}
                            borderRadius="lg"
                            onClick={() => handleTemplateSelect('general')}
                        >
                            <VStack align="start" spacing={0} w="full">
                                <Text>{templates.general.name}</Text>
                                <Text fontSize="xs" color="gray.500">{templates.general.description}</Text>
                            </VStack>
                        </Button>
                    </VStack>
                </Box>

                {/* Previous Notes Section */}
                <Box p={4} borderTop="1px" borderColor="whiteAlpha.100">
                    <Text color="gray.500" fontSize="xs" fontWeight="semibold" mb={3} px={4}>
                        PREVIOUS NOTES
                    </Text>
                    <VStack
                        align="stretch"
                        spacing={1}
                        maxH="calc(100vh - 600px)"
                        overflowY="auto"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                width: '6px',
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: useColorModeValue('gray.700', 'gray.600'),
                                borderRadius: '24px',
                            },
                        }}
                    >
                        {previousNotes.map((note) => (
                            <Button
                                key={note.id}
                                variant="ghost"
                                justifyContent="flex-start"
                                color="gray.400"
                                bg={selectedNoteId === note.id ? 'whiteAlpha.100' : 'transparent'}
                                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                                onClick={() => handleNoteSelect(note.id)}
                                p={4}
                                borderRadius="lg"
                            >
                                <VStack align="start" spacing={1} w="full">
                                    <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" fontWeight="medium">
                                            Patient ID: {note.patientId}
                                        </Text>
                                        <Badge
                                            colorScheme="blue"
                                            variant="subtle"
                                            fontSize="xs"
                                        >
                                            {note.processingTime.toFixed(1)}s
                                        </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                        {new Date(note.timestamp).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </VStack>
                            </Button>
                        ))}
                    </VStack>
                </Box>

                {/* User Section */}
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={4}
                    borderTop="1px"
                    borderColor="whiteAlpha.100"
                    bg="gray.900"
                >
                    <HStack spacing={3} px={4}>
                        <Avatar size="sm" name="User Name" src="https://bit.ly/dan-abramov" />
                        <Box flex={1}>
                            <Text color="white" fontSize="sm" fontWeight="medium">Dr. Thomas</Text>
                            <Text color="gray.400" fontSize="xs">Cardiologist</Text>
                        </Box>
                        <IconButton
                            icon={<Icon as={FaCog} />}
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                            size="sm"
                            aria-label="Settings"
                        />
                    </HStack>
                </Box>
            </Box>

            {/* Main Content */}
            <Box ml="280px" p={8}>
                {/* Header */}
                <Flex justify="space-between" align="center" mb={8}>
                    <HStack>
                        <InputGroup maxW="400px">
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FaSearch} color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Type to search..."
                                bg={useColorModeValue('white', 'gray.700')}
                                border="none"
                                boxShadow="sm"
                            />
                        </InputGroup>
                    </HStack>
                    <HStack spacing={4}>
                        <IconButton
                            icon={<Icon as={FaBell} />}
                            variant="ghost"
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top={2}
                                right={2}
                                w={2}
                                h={2}
                                bg="red.500"
                                borderRadius="full"
                            />
                        </IconButton>
                        <IconButton
                            icon={<Icon as={FaCog} />}
                            variant="ghost"
                        />
                        <Avatar size="sm" name="User Name" src="https://bit.ly/dan-abramov" />
                    </HStack>
                </Flex>

                {/* Date Range Selector */}
                <HStack mb={8} spacing={4}>
                    <Button
                        leftIcon={<Icon as={FaCalendar} />}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                    >
                        Last 7 Days
                    </Button>
                    <Select
                        maxW="200px"
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        border="none"
                        defaultValue="daily"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </Select>
                </HStack>

                {/* Stats Grid with Dynamic Data */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                    <Card
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500">Total Records</Text>
                            <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold">{stats.totalRecords}</Text>
                                <Badge colorScheme="green" variant="subtle">
                                    {stats.totalRecords > 0 ? '+100%' : '0%'}
                                </Badge>
                            </HStack>
                        </VStack>
                    </Card>
                    <Card
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500">Processing Time</Text>
                            <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold">
                                    {stats.processingTime.toFixed(1)}s
                                </Text>
                                <Badge colorScheme="green" variant="subtle">
                                    {stats.processingTime > 0 ? '+12%' : '0%'}
                                </Badge>
                            </HStack>
                        </VStack>
                    </Card>
                    <Card
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500">Success Rate</Text>
                            <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold">
                                    {stats.successRate.toFixed(1)}%
                                </Text>
                                <Badge colorScheme="green" variant="subtle">
                                    {stats.successRate > 0 ? '+5%' : '0%'}
                                </Badge>
                            </HStack>
                        </VStack>
                    </Card>
                    <Card
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.500">Total Notes</Text>
                            <HStack spacing={2}>
                                <Text fontSize="2xl" fontWeight="bold">{stats.totalNotes}</Text>
                                <Badge colorScheme="green" variant="subtle">
                                    {stats.totalNotes > 0 ? '+100%' : '0%'}
                                </Badge>
                            </HStack>
                        </VStack>
                    </Card>
                </SimpleGrid>

                {/* Main Content Area */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    {/* Recording Controls */}
                    <Card
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack spacing={6}>
                            <HStack justify="space-between" w="full">
                                <Heading size="md">Voice Recording</Heading>
                                <IconButton
                                    icon={<Icon as={FaEllipsisV} />}
                                    variant="ghost"
                                    aria-label="More options"
                                />
                            </HStack>

                            {!audioBlob && !isRecording && (
                                <VStack spacing={6} py={8}>
                                    <Box
                                        position="relative"
                                        w="120px"
                                        h="120px"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        borderRadius="full"
                                        bg="blue.50"
                                        _dark={{ bg: 'blue.900' }}
                                    >
                                        <Box
                                            position="absolute"
                                            top="0"
                                            left="0"
                                            right="0"
                                            bottom="0"
                                            borderRadius="full"
                                            bg="blue.100"
                                            _dark={{ bg: 'blue.800' }}
                                            opacity="0.5"
                                            animation={`${pulseAnimation} 2s infinite`}
                                        />
                                        <Icon
                                            as={FaMicrophone}
                                            w={12}
                                            h={12}
                                            color="blue.500"
                                            _dark={{ color: 'blue.200' }}
                                            filter="drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))"
                                        />
                                    </Box>
                                    <ButtonGroup spacing={4}>
                                        <Button
                                            colorScheme="blue"
                                            leftIcon={<Icon as={FaMicrophone} />}
                                            onClick={startRecording}
                                            size="lg"
                                            px={8}
                                            py={6}
                                            fontSize="md"
                                            fontWeight="medium"
                                            boxShadow="md"
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'lg',
                                            }}
                                            _active={{
                                                transform: 'translateY(0)',
                                                boxShadow: 'sm',
                                            }}
                                            transition="all 0.2s"
                                        >
                                            Start Recording
                                        </Button>
                                        <Button
                                            variant="outline"
                                            leftIcon={<Icon as={FaUpload} />}
                                            onClick={() => fileInputRef.current?.click()}
                                            size="lg"
                                            px={8}
                                            py={6}
                                            fontSize="md"
                                            fontWeight="medium"
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                boxShadow: 'sm',
                                            }}
                                            _active={{
                                                transform: 'translateY(0)',
                                            }}
                                            transition="all 0.2s"
                                        >
                                            Upload Audio
                                        </Button>
                                    </ButtonGroup>
                                </VStack>
                            )}

                            {(isRecording || audioBlob) && (
                                <VStack spacing={6} w="full">
                                    <Box w="full" bg={useColorModeValue('gray.50', 'gray.600')} p={4} borderRadius="lg">
                                        <WaveformVisualizer
                                            audioBlob={audioBlob}
                                            isRecording={isRecording}
                                        />
                                    </Box>
                                    <HStack spacing={4}>
                                        {isRecording ? (
                                            <Button
                                                colorScheme="red"
                                                leftIcon={<Icon as={FaStop} />}
                                                onClick={stopRecording}
                                                size="lg"
                                            >
                                                Stop Recording
                                            </Button>
                                        ) : audioBlob && (
                                            <ButtonGroup spacing={4}>
                                                <Button
                                                    colorScheme="blue"
                                                    leftIcon={<Icon as={isPlaying ? FaPause : FaPlay} />}
                                                    onClick={togglePlayback}
                                                >
                                                    {isPlaying ? 'Pause' : 'Play'}
                                                </Button>
                                                <Button
                                                    colorScheme="green"
                                                    leftIcon={<Icon as={FaUpload} />}
                                                    onClick={handleUpload}
                                                    isLoading={isLoading}
                                                    loadingText="Processing"
                                                >
                                                    Generate Note
                                                </Button>
                                                <IconButton
                                                    icon={<Icon as={FaTrash} />}
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    onClick={resetRecording}
                                                />
                                            </ButtonGroup>
                                        )}
                                    </HStack>
                                </VStack>
                            )}
                        </VStack>
                    </Card>

                    {/* Recording Status */}
                    <EnhancedRecorder isRecording={isRecording} />
                </SimpleGrid>

                {/* SOAP Note Section */}
                {soapNote && (
                    <Card
                        mt={8}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                    >
                        <Box p={6}>
                            <HStack justify="space-between" mb={6}>
                                <HStack spacing={4}>
                                    <Icon as={FaNotesMedical} w={6} h={6} color="blue.400" />
                                    <Heading size="md">Generated SOAP Note</Heading>
                                </HStack>
                                <ButtonGroup>
                                    <IconButton
                                        icon={<Icon as={FaDownload} />}
                                        variant="ghost"
                                        aria-label="Download"
                                    />
                                    <IconButton
                                        icon={<Icon as={FaEdit} />}
                                        variant="ghost"
                                        aria-label="Edit"
                                    />
                                    <IconButton
                                        icon={<Icon as={FaEllipsisV} />}
                                        variant="ghost"
                                        aria-label="More options"
                                    />
                                </ButtonGroup>
                            </HStack>
                            <Box
                                bg={useColorModeValue('gray.50', 'gray.600')}
                                p={6}
                                borderRadius="lg"
                            >
                                <EditableSoapNote
                                    content={soapNote}
                                    onUpdate={handleSoapNoteUpdate}
                                />
                            </Box>
                        </Box>
                    </Card>
                )}

                {/* Loading State */}
                {isLoading && (
                    <Card
                        mt={8}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow="sm"
                        borderRadius="lg"
                        p={6}
                    >
                        <VStack spacing={4}>
                            <Text fontSize="lg" fontWeight="medium">Processing your recording...</Text>
                            <Progress
                                size="xs"
                                isIndeterminate
                                colorScheme="blue"
                                w="full"
                                borderRadius="full"
                            />
                        </VStack>
                    </Card>
                )}

                <VisuallyHidden>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="audio/*"
                        onChange={handleFileUpload}
                    />
                </VisuallyHidden>
            </Box>
        </Box>
    );
}

export default App 