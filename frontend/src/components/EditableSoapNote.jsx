import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Textarea,
    VStack,
    HStack,
    useToast,
    IconButton,
    Tooltip,
    useColorModeValue,
    Text,
    Flex,
    Badge,
    Input,
    Icon,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { EditIcon, DownloadIcon, CheckIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import mammoth from 'mammoth';
import { FaUpload, FaFileMedicalAlt } from 'react-icons/fa';

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(66, 153, 225, 0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
`;

const EditableSoapNote = ({ content, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const toast = useToast();
    const fileInputRef = useRef(null);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('blue.100', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const accentColor = useColorModeValue('blue.500', 'blue.300');
    const buttonHoverBg = useColorModeValue('blue.50', 'whiteAlpha.200');
    const downloadButtonHoverBg = useColorModeValue('green.50', 'whiteAlpha.200');

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(content);
    };

    const handleSave = () => {
        onUpdate(editedContent);
        setIsEditing(false);
        toast({
            title: 'SOAP Note Updated',
            description: 'Your changes have been saved successfully.',
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(content);
    };

    const downloadAsWord = async () => {
        try {
            const sections = editedContent.split('\n\n');
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            text: "SOAP Note Report",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 400,
                                before: 400,
                            },
                        }),
                        ...sections.map(section => {
                            return new Paragraph({
                                children: [
                                    new TextRun({
                                        text: section,
                                        size: 24,
                                        font: 'Arial',
                                    }),
                                ],
                                spacing: {
                                    after: 200,
                                    line: 360,
                                },
                            });
                        }),
                    ],
                }],
            });

            const blob = await Packer.toBlob(doc);
            const date = new Date().toISOString().split('T')[0];
            saveAs(blob, `SOAP_Note_${date}.docx`);

            toast({
                title: 'Document Downloaded',
                description: 'SOAP Note has been downloaded successfully.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Download error:', error);
            toast({
                title: 'Download Failed',
                description: 'Failed to generate document. Please try again.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Show loading toast
        const loadingToast = toast({
            title: 'Processing File',
            description: 'Please wait while we process your document...',
            status: 'loading',
            duration: null,
            isClosable: false,
        });

        try {
            let text = '';

            if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // Handle .docx files
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;

                if (!text || text.trim() === '') {
                    throw new Error('The document appears to be empty');
                }
            } else if (file.type === 'text/plain') {
                // Handle .txt files
                text = await file.text();

                if (!text || text.trim() === '') {
                    throw new Error('The text file appears to be empty');
                }
            } else {
                throw new Error(`Unsupported file type: ${file.type}. Please upload a .docx or .txt file.`);
            }

            // Close loading toast
            toast.close(loadingToast);

            // Update content
            if (isEditing) {
                setEditedContent(text);
            } else {
                onUpdate(text);
            }

            // Show success toast
            toast({
                title: 'File Uploaded Successfully',
                description: `Your ${file.type === 'text/plain' ? '.txt' : '.docx'} file has been imported.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top',
            });
        } catch (error) {
            console.error('Upload error:', error);

            // Close loading toast
            toast.close(loadingToast);

            // Show error toast
            toast({
                title: 'Upload Failed',
                description: error.message || 'Failed to import file. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        } finally {
            // Reset file input
            event.target.value = '';
        }
    };

    return (
        <VStack align="stretch" spacing={6} width="100%">
            <Input
                type="file"
                accept=".docx,.txt"
                onChange={handleFileUpload}
                ref={fileInputRef}
                display="none"
            />
            {isEditing ? (
                <>
                    <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        minHeight="500px"
                        fontSize="md"
                        fontFamily="system-ui"
                        whiteSpace="pre-wrap"
                        p={8}
                        borderColor={borderColor}
                        borderWidth="2px"
                        borderRadius="2xl"
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        _hover={{ borderColor: accentColor }}
                        _focus={{
                            borderColor: accentColor,
                            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
                            bg: bgColor
                        }}
                        resize="vertical"
                        transition="all 0.3s ease"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: useColorModeValue('gray.100', 'gray.600'),
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: useColorModeValue('blue.400', 'blue.300'),
                                borderRadius: '8px',
                                '&:hover': {
                                    background: useColorModeValue('blue.500', 'blue.400'),
                                },
                            },
                        }}
                    />
                    <HStack justifyContent="flex-end" spacing={4}>
                        <Button
                            leftIcon={<CheckIcon />}
                            colorScheme="green"
                            onClick={handleSave}
                            size="lg"
                            px={8}
                            h="56px"
                            fontSize="md"
                            fontWeight="600"
                            borderRadius="xl"
                            bgGradient="linear(to-r, green.400, teal.400)"
                            _hover={{
                                transform: 'translateY(-2px)',
                                shadow: 'lg',
                                bgGradient: "linear(to-r, green.500, teal.500)",
                            }}
                            _active={{
                                transform: 'translateY(0)',
                                shadow: 'md',
                            }}
                            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            Save Changes
                        </Button>
                        <Button
                            leftIcon={<CloseIcon />}
                            onClick={handleCancel}
                            size="lg"
                            variant="ghost"
                            h="56px"
                            px={6}
                            fontSize="md"
                            fontWeight="600"
                            borderRadius="xl"
                            color={useColorModeValue('gray.600', 'gray.400')}
                            _hover={{
                                bg: useColorModeValue('gray.100', 'gray.700'),
                                transform: 'translateY(-2px)',
                                color: useColorModeValue('gray.800', 'gray.200'),
                            }}
                            _active={{
                                transform: 'translateY(0)',
                            }}
                            transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                        >
                            Cancel
                        </Button>
                    </HStack>
                </>
            ) : (
                <Box position="relative" width="100%">
                    <Flex
                        justify="space-between"
                        align="center"
                        mb={6}
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        p={6}
                        borderRadius="2xl"
                        boxShadow="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        position="relative"
                        overflow="hidden"
                    >
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            h="2px"
                            bgGradient="linear(to-r, blue.400, purple.400)"
                        />
                        <Badge
                            colorScheme="blue"
                            p={4}
                            borderRadius="xl"
                            fontSize="md"
                            display="flex"
                            alignItems="center"
                            animation={`${pulseAnimation} 3s infinite`}
                            boxShadow="md"
                            bgGradient="linear(to-r, blue.400, purple.400)"
                            color="white"
                        >
                            <HStack spacing={3}>
                                <InfoIcon boxSize={5} />
                                <Text fontWeight="600">Medical Record</Text>
                            </HStack>
                        </Badge>
                        <HStack spacing={4}>
                            <Tooltip
                                label="Upload Document"
                                hasArrow
                                placement="top"
                                bg="purple.500"
                                color="white"
                                px={4}
                                py={2}
                                borderRadius="lg"
                                fontWeight="500"
                            >
                                <IconButton
                                    icon={<Icon as={FaUpload} boxSize={5} />}
                                    onClick={() => fileInputRef.current?.click()}
                                    size="lg"
                                    colorScheme="purple"
                                    variant="ghost"
                                    borderRadius="xl"
                                    h="56px"
                                    w="56px"
                                    bgGradient="linear(to-r, purple.400, blue.400)"
                                    color="white"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg',
                                        bgGradient: "linear(to-r, purple.500, blue.500)",
                                    }}
                                    _active={{
                                        transform: 'translateY(0)',
                                        shadow: 'sm',
                                    }}
                                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                />
                            </Tooltip>
                            <Tooltip
                                label="Edit SOAP Note"
                                hasArrow
                                placement="top"
                                bg={accentColor}
                                color="white"
                                px={4}
                                py={2}
                                borderRadius="lg"
                                fontWeight="500"
                            >
                                <IconButton
                                    icon={<EditIcon boxSize={5} />}
                                    onClick={handleEdit}
                                    size="lg"
                                    colorScheme="blue"
                                    variant="ghost"
                                    borderRadius="xl"
                                    h="56px"
                                    w="56px"
                                    bgGradient="linear(to-r, blue.400, purple.400)"
                                    color="white"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg',
                                        bgGradient: "linear(to-r, blue.500, purple.500)",
                                    }}
                                    _active={{
                                        transform: 'translateY(0)',
                                        shadow: 'sm',
                                    }}
                                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                />
                            </Tooltip>
                            <Tooltip
                                label="Download as Word"
                                hasArrow
                                placement="top"
                                bg="green.500"
                                color="white"
                                px={4}
                                py={2}
                                borderRadius="lg"
                                fontWeight="500"
                            >
                                <IconButton
                                    icon={<DownloadIcon boxSize={5} />}
                                    onClick={downloadAsWord}
                                    size="lg"
                                    colorScheme="green"
                                    variant="ghost"
                                    borderRadius="xl"
                                    h="56px"
                                    w="56px"
                                    bgGradient="linear(to-r, green.400, teal.400)"
                                    color="white"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg',
                                        bgGradient: "linear(to-r, green.500, teal.500)",
                                    }}
                                    _active={{
                                        transform: 'translateY(0)',
                                        shadow: 'sm',
                                    }}
                                    transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                                />
                            </Tooltip>
                        </HStack>
                    </Flex>
                    <Box
                        whiteSpace="pre-wrap"
                        p={8}
                        borderRadius="2xl"
                        fontSize="md"
                        fontFamily="system-ui"
                        minHeight="500px"
                        bg={bgColor}
                        borderWidth="2px"
                        borderColor={borderColor}
                        color={textColor}
                        boxShadow="lg"
                        position="relative"
                        _hover={{
                            borderColor: accentColor,
                            boxShadow: 'xl',
                        }}
                        transition="all 0.3s ease"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '8px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: useColorModeValue('gray.100', 'gray.600'),
                                borderRadius: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: useColorModeValue('blue.400', 'blue.300'),
                                borderRadius: '8px',
                                '&:hover': {
                                    background: useColorModeValue('blue.500', 'blue.400'),
                                },
                            },
                        }}
                    >
                        {content}
                    </Box>
                </Box>
            )}
        </VStack>
    );
};

export default EditableSoapNote; 