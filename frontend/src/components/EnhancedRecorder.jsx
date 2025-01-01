import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    Progress,
    Icon,
    Badge,
    useColorModeValue,
    Tooltip,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
} from '@chakra-ui/react';
import {
    FaMicrophone,
    FaVolumeUp,
    FaExclamationTriangle,
    FaCheckCircle,
    FaWaveSquare,
} from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const EnhancedRecorder = ({ isRecording, audioLevel = 0 }) => {
    const [noiseLevel, setNoiseLevel] = useState(0);
    const [clarity, setClarity] = useState(85);
    const [storageLeft, setStorageLeft] = useState(95);

    // Simulate changing values for demo
    useEffect(() => {
        if (isRecording) {
            const interval = setInterval(() => {
                setNoiseLevel(Math.random() * 30);
                setClarity(85 + Math.random() * 10);
                setStorageLeft(prev => Math.max(prev - 0.1, 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRecording]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    const getNoiseStatus = () => {
        if (noiseLevel < 10) return { color: 'green', text: 'Excellent' };
        if (noiseLevel < 20) return { color: 'yellow', text: 'Good' };
        return { color: 'red', text: 'High' };
    };

    const getClarityStatus = () => {
        if (clarity > 90) return { color: 'green', text: 'Excellent' };
        if (clarity > 80) return { color: 'yellow', text: 'Good' };
        return { color: 'red', text: 'Poor' };
    };

    return (
        <Box
            bg={bgColor}
            borderRadius="2xl"
            p={6}
            borderWidth="1px"
            borderColor={borderColor}
            boxShadow="xl"
            position="relative"
            overflow="hidden"
        >
            {/* Top Status Bar */}
            <HStack spacing={4} mb={6}>
                <Badge
                    colorScheme={isRecording ? 'red' : 'gray'}
                    p={2}
                    borderRadius="md"
                    animation={isRecording ? `${pulseAnimation} 2s infinite` : 'none'}
                >
                    {isRecording ? 'Recording' : 'Ready'}
                </Badge>
                <Text color={textColor} fontSize="sm">
                    Room Status Check
                </Text>
            </HStack>

            {/* Main Stats Grid */}
            <SimpleGrid columns={2} spacing={6} mb={6}>
                {/* Noise Level */}
                <Stat>
                    <StatLabel color={textColor}>Background Noise</StatLabel>
                    <StatNumber>
                        <HStack spacing={2}>
                            <Icon as={FaVolumeUp} color={getNoiseStatus().color + '.500'} />
                            <Text>{Math.round(noiseLevel)}dB</Text>
                        </HStack>
                    </StatNumber>
                    <StatHelpText color={getNoiseStatus().color + '.500'}>
                        {getNoiseStatus().text}
                    </StatHelpText>
                    <Progress
                        value={noiseLevel}
                        max={30}
                        colorScheme={getNoiseStatus().color}
                        size="sm"
                        borderRadius="full"
                    />
                </Stat>

                {/* Voice Clarity */}
                <Stat>
                    <StatLabel color={textColor}>Voice Clarity</StatLabel>
                    <StatNumber>
                        <HStack spacing={2}>
                            <Icon as={FaWaveSquare} color={getClarityStatus().color + '.500'} />
                            <Text>{Math.round(clarity)}%</Text>
                        </HStack>
                    </StatNumber>
                    <StatHelpText color={getClarityStatus().color + '.500'}>
                        {getClarityStatus().text}
                    </StatHelpText>
                    <Progress
                        value={clarity}
                        colorScheme={getClarityStatus().color}
                        size="sm"
                        borderRadius="full"
                    />
                </Stat>
            </SimpleGrid>

            {/* Status Indicators */}
            <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                    <HStack>
                        <Icon
                            as={FaMicrophone}
                            color={isRecording ? 'green.500' : 'gray.500'}
                        />
                        <Text color={textColor}>Microphone</Text>
                    </HStack>
                    <Badge colorScheme={isRecording ? 'green' : 'gray'}>
                        {isRecording ? 'Active' : 'Standby'}
                    </Badge>
                </HStack>

                <HStack justify="space-between">
                    <HStack>
                        <Icon
                            as={noiseLevel < 20 ? FaCheckCircle : FaExclamationTriangle}
                            color={noiseLevel < 20 ? 'green.500' : 'yellow.500'}
                        />
                        <Text color={textColor}>Noise Suppression</Text>
                    </HStack>
                    <Badge colorScheme={noiseLevel < 20 ? 'green' : 'yellow'}>
                        {noiseLevel < 20 ? 'Optimal' : 'Active'}
                    </Badge>
                </HStack>

                <HStack justify="space-between">
                    <Text color={textColor}>Storage Available</Text>
                    <Tooltip
                        label={`${Math.round(storageLeft)}% storage remaining`}
                        hasArrow
                    >
                        <Box w="100px">
                            <Progress
                                value={storageLeft}
                                size="sm"
                                borderRadius="full"
                                colorScheme={storageLeft > 20 ? 'green' : 'red'}
                            />
                        </Box>
                    </Tooltip>
                </HStack>
            </VStack>
        </Box>
    );
};

export default EnhancedRecorder; 