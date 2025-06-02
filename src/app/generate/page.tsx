"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Textarea,
  useColorMode,
  useColorModeValue,
  VStack,
  useBreakpointValue,
  useDisclosure,
  Tabs,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { FiMenu, FiX, FiFolder, FiUsers, FiHome } from "react-icons/fi";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => <Spinner size="xl" color="primary.500" />,
});

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [selectedProject, setSelectedProject] =
    useState<string>("All in one POS");
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  const projects = [
    "All in one POS",
    "ChatGPT Clone",
    "Ecommerce Front Page Design",
    "License Management Dashboard",
    "Journal App Front Page",
  ];

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe what you want to build",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setCode("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setCode(data.code);
    } catch (error) {
      console.error("Failed to fetch code:", error);
      setCode("// Error generating code. Please try again.");
      toast({
        title: "Generation failed",
        description: "There was an error generating your code",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const SidebarContent = (
    <VStack align="stretch" spacing={4} p={4} h="full">
      <HStack>
        <Heading size="md" color="primary.500">
          co2.dev
        </Heading>
        <Spacer />
        <IconButton
          aria-label="Collapse sidebar"
          icon={<ChevronLeftIcon />}
          size="sm"
          variant="ghost"
          onClick={onToggle}
        />
      </HStack>

      <VStack align="stretch" spacing={1} flex={1} overflowY="auto">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="outline.500"
          px={2}
          textTransform="uppercase"
        >
          Projects
        </Text>
        {projects.map((project) => (
          <Button
            key={project}
            variant={selectedProject === project ? "solid" : "ghost"}
            colorScheme={selectedProject === project ? "primary" : undefined}
            justifyContent="flex-start"
            fontWeight="normal"
            fontSize="sm"
            leftIcon={<FiFolder />}
            onClick={() => setSelectedProject(project)}
          >
            {project}
          </Button>
        ))}
      </VStack>

      <VStack align="stretch" spacing={1}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="outline.500"
          px={2}
          textTransform="uppercase"
        >
          Community
        </Text>
        <Button
          variant="ghost"
          justifyContent="flex-start"
          fontWeight="normal"
          fontSize="sm"
          leftIcon={<FiUsers />}
        >
          Favorite Projects
        </Button>
        <Button
          variant="ghost"
          justifyContent="flex-start"
          fontWeight="normal"
          fontSize="sm"
          leftIcon={<FiUsers />}
        >
          Favorite Chats
        </Button>
      </VStack>

      <Box pt={4}>
        <Button
          leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
          w="full"
        >
          {colorMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </Box>
    </VStack>
  );

  const CollapsedSidebar = (
    <VStack align="center" spacing={4} p={2} h="full">
      <IconButton
        aria-label="Expand sidebar"
        icon={<ChevronRightIcon />}
        variant="ghost"
        onClick={onToggle}
        size="sm"
      />

      <VStack spacing={2} flex={1}>
        <Tooltip label="Projects" placement="right">
          <IconButton
            aria-label="Projects"
            icon={<FiFolder />}
            variant="ghost"
            colorScheme={selectedProject ? "primary" : undefined}
          />
        </Tooltip>
        <Tooltip label="Community" placement="right">
          <IconButton
            aria-label="Community"
            icon={<FiUsers />}
            variant="ghost"
          />
        </Tooltip>
      </VStack>

      <Tooltip
        label={colorMode === "light" ? "Dark Mode" : "Light Mode"}
        placement="right"
      >
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          variant="ghost"
          size="sm"
          onClick={toggleColorMode}
        />
      </Tooltip>
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={useColorModeValue("surface.50", "surface.900")}>
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Box
          w={isOpen ? "240px" : "48px"}
          transition="width 0.2s ease"
          borderRight="1px"
          borderColor={useColorModeValue("outline.200", "outline.700")}
          bg={useColorModeValue("surface.100", "surface.800")}
          flexShrink={0}
        >
          {isOpen ? SidebarContent : CollapsedSidebar}
        </Box>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="240px"
          h="100vh"
          zIndex={20}
          bg={useColorModeValue("surface.100", "surface.800")}
          borderRight="1px"
          borderColor={useColorModeValue("outline.200", "outline.700")}
        >
          {SidebarContent}
        </Box>
      )}

      {/* Main Content */}
      <Box flex={1} py={6} px={[4, 6]} position="relative">
        <Container maxW="6xl" p={0}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack>
              {isMobile && (
                <IconButton
                  aria-label="Toggle sidebar"
                  icon={isOpen ? <FiX /> : <FiMenu />}
                  onClick={onToggle}
                  variant="ghost"
                  size="sm"
                />
              )}
              <Box>
                <Heading size="lg" mb={2}>
                  What can I help you ship?
                </Heading>
                <Text fontSize="md" color="outline.500">
                  Ask co2.dev to build...
                </Text>
              </Box>
              <Spacer />
              {!isMobile && (
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  variant="ghost"
                  onClick={toggleColorMode}
                />
              )}
            </HStack>


            {/* Input and Preview Split View */}
            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              {/* Input Column */}
              <Box flex={1}>
                <Textarea
                  placeholder="Describe what you want to build..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                  mb={4}
                  resize="vertical"
                  bg={useColorModeValue("surface.100", "surface.800")}
                  borderColor={useColorModeValue("outline.300", "outline.600")}
                  _hover={{
                    borderColor: useColorModeValue(
                      "outline.400",
                      "outline.500"
                    ),
                  }}
                  _focus={{
                    borderColor: "primary.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-primary-500)",
                  }}
                />
                <Button
                  isLoading={loading}
                  onClick={generateCode}
                  colorScheme="teal"
                  shadow="md"
                  width="full"
                  size="lg"
                  isDisabled={!prompt.trim()}
                >
                  Generate Code
                </Button>
              </Box>

              {/* Output Column */}
              <Box flex={1} minH="500px">
                <Tabs variant="soft-rounded" colorScheme="teal" h="100%">
                  <TabList>
                    <Tab>Preview</Tab>
                    <Tab>Code</Tab>
                  </TabList>
                  <TabPanels mt={4} h="calc(100% - 42px)">
                    <TabPanel p={0} h="100%">
                      <Box
                        border="1px"
                        borderColor={useColorModeValue(
                          "outline.200",
                          "outline.600"
                        )}
                        rounded="xl"
                        overflow="hidden"
                        h="100%"
                        bg={useColorModeValue("white", "gray.800")}
                      >
                        {code ? (
                          <iframe
                            srcDoc={code}
                            sandbox="allow-scripts allow-same-origin"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "none",
                            }}
                          />
                        ) : (
                          <Flex
                            h="100%"
                            align="center"
                            justify="center"
                            color="outline.500"
                          >
                            <Text>Your generated preview will appear here</Text>
                          </Flex>
                        )}
                      </Box>
                    </TabPanel>
                    <TabPanel p={0} h="100%">
                      <Box
                        h="100%"
                        border="1px"
                        borderColor={useColorModeValue(
                          "outline.200",
                          "outline.600"
                        )}
                        rounded="xl"
                        overflow="hidden"
                      >
                        {loading ? (
                          <Flex h="100%" align="center" justify="center">
                            <Spinner size="xl" color="primary.500" />
                          </Flex>
                        ) : (
                          <CodeEditor
                            value={code}
                            onChange={(value) => setCode(value || "")}
                          />
                        )}
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>
          </VStack>
        </Container>
      </Box>
    </Flex>
  );
}
