import {
    Box,
    VStack,
    Icon,
    Tooltip,
    useColorModeValue,
    HStack,
    Text,
    Avatar,
    Divider,
} from '@chakra-ui/react';
import {
    FaColumns,
    FaFileAlt,
    FaRegClipboard,
    FaCog,
    FaQuestionCircle,
    FaUserMd,
} from 'react-icons/fa';

const Sidebar = () => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const iconColor = useColorModeValue('gray.600', 'gray.400');
    const hoverBg = useColorModeValue('teal.50', 'gray.700');
    const activeColor = useColorModeValue('teal.500', 'teal.300');

    const menuItems = [
        { icon: FaColumns, label: 'Dashboard' },
        { icon: FaFileAlt, label: 'SOAP Notes' },
        { icon: FaRegClipboard, label: 'Templates' },
        { icon: FaCog, label: 'Settings' },
        { icon: FaQuestionCircle, label: 'Help & Support' },
    ];

    return (
        <Box
            position="fixed"
            left={0}
            top={0}
            bottom={0}
            w="80px"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            boxShadow="sm"
            zIndex={100}
        >
            <VStack spacing={6} align="center" py={6} h="full">
                {/* Profile Section */}
                <Avatar
                    icon={<Icon as={FaUserMd} fontSize="1.5rem" />}
                    bg="teal.500"
                    color="white"
                    size="md"
                />

                <Divider />

                {/* Navigation Items */}
                <VStack spacing={4} align="center">
                    {menuItems.map((item, index) => (
                        <Tooltip
                            key={index}
                            label={item.label}
                            placement="right"
                            hasArrow
                            bg="teal.500"
                            color="white"
                        >
                            <Box
                                p={3}
                                borderRadius="xl"
                                cursor="pointer"
                                color={index === 0 ? activeColor : iconColor}
                                _hover={{
                                    bg: hoverBg,
                                    color: activeColor,
                                    transform: 'translateY(-2px)',
                                }}
                                transition="all 0.2s"
                            >
                                <Icon as={item.icon} boxSize={6} />
                            </Box>
                        </Tooltip>
                    ))}
                </VStack>

                <Box flex={1} />

                {/* Status Indicator */}
                <HStack
                    spacing={2}
                    p={2}
                    borderRadius="full"
                    bg={useColorModeValue('green.100', 'green.800')}
                >
                    <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={useColorModeValue('green.500', 'green.300')}
                    />
                    <Text fontSize="xs" color={useColorModeValue('green.800', 'green.100')}>
                        Online
                    </Text>
                </HStack>
            </VStack>
        </Box>
    );
};

export default Sidebar; 