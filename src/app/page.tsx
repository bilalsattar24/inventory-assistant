"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Stack,
  Heading,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FiBarChart2,
  FiBox,
  FiSmartphone,
  FiCheckCircle,
  FiUsers,
  FiShield,
  FiStar,
} from "react-icons/fi";

const themeColors = {
  primary: {
    main: "#2D3250",
    light: "#424769",
    dark: "#1B1F31",
    gradient: "linear-gradient(135deg, #2D3250 0%, #1B1F31 100%)",
  },
  accent: {
    orange: "#F6B17A",
    peach: "#FFD9B7",
  },
};

export default function LandingPage() {
  const bgGradient = useColorModeValue(
    themeColors.primary.gradient,
    themeColors.primary.gradient
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        color="white"
        py={{ base: 8, md: 12 }}
        position="relative"
        overflow="hidden">
        <Container maxW="container.xl">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Optimize Your Amazon
              <Box as="span" color={themeColors.accent.orange}>
                Inventory Management
              </Box>
            </Heading>
            <Text fontSize="xl" maxW="2xl" mb={8}>
              Make data-driven restocking decisions and never run out of
              inventory again. Perfect timing, optimal quantities, maximum
              profits.
            </Text>
            <Button
              as={Link}
              href="/dashboard"
              size="lg"
              colorScheme="orange"
              bg={themeColors.accent.orange}
              _hover={{ bg: themeColors.accent.peach }}>
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <FeatureCard
            icon={FiBarChart2}
            title="Smart Reorder Predictions"
            description="AI-powered algorithms calculate optimal reorder dates based on your sales velocity and lead times."
          />
          <FeatureCard
            icon={FiBox}
            title="Inventory Optimization"
            description="Balance storage costs and stockout risks with intelligent inventory level recommendations."
          />
          <FeatureCard
            icon={FiSmartphone}
            title="Real-time Monitoring"
            description="Track your inventory levels across all Amazon warehouses in real-time."
          />
        </SimpleGrid>
      </Container>

      {/* Benefits Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading textAlign="center" mb={8}>
              Why Choose Our Platform?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <BenefitItem
                icon={FiCheckCircle}
                title="Reduce Stockouts"
                description="Our predictive analytics help you maintain optimal inventory levels, reducing stockouts by up to 95%."
              />
              <BenefitItem
                icon={FiShield}
                title="Save Time & Money"
                description="Automated calculations and recommendations save hours of manual work each week."
              />
              <BenefitItem
                icon={FiStar}
                title="Increase Profits"
                description="Better inventory management leads to reduced storage fees and improved cash flow."
              />
              <BenefitItem
                icon={FiUsers}
                title="Easy to Use"
                description="Intuitive interface requires no technical expertise. Get started in minutes."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        bg="gray.50"
        py={16}
        position="relative"
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "radial-gradient(circle at bottom right, rgba(246, 177, 122, 0.1), transparent 70%)",
        }}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading textAlign="center" mb={8}>
              What Our Users Say
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <TestimonialCard
                quote="This tool has completely transformed how we manage our Amazon inventory. We've reduced our stockouts by 90%."
                author="Sarah Johnson"
                role="E-commerce Manager"
              />
              <TestimonialCard
                quote="The predictive analytics are spot-on. We've saved thousands in storage fees and improved our cash flow."
                author="Michael Chen"
                role="Business Owner"
              />
              <TestimonialCard
                quote="Setup was quick and the interface is intuitive. This is exactly what we needed for our Amazon business."
                author="David Smith"
                role="Operations Director"
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <Heading textAlign="center" mb={8}>
            Simple, Transparent Pricing
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <PricingCard
              title="Starter"
              price="$49"
              period="/month"
              features={[
                "Up to 100 SKUs",
                "Basic Analytics",
                "Email Support",
                "7-Day History",
              ]}
            />
            <PricingCard
              title="Professional"
              price="$99"
              period="/month"
              featured={true}
              features={[
                "Unlimited SKUs",
                "Advanced Analytics",
                "Priority Support",
                "30-Day History",
                "Custom Parameters",
              ]}
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="gray.50" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Heading textAlign="center" mb={8}>
              Ready to Optimize Your Amazon Business?
            </Heading>
            <Button
              as={Link}
              href="/dashboard"
              size="lg"
              colorScheme="orange"
              bg={themeColors.accent.orange}
              _hover={{ bg: themeColors.accent.peach }}>
              Try It Free
            </Button>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <Card>
      <CardBody>
        <VStack spacing={4} align="center" textAlign="center">
          <Icon as={icon} boxSize={10} color="primary.main" />
          <Heading size="md">{title}</Heading>
          <Text>{description}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
}

function BenefitItem({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <HStack spacing={4} align="start">
      <Icon as={icon} boxSize={6} color="primary.main" />
      <VStack align="start" spacing={2}>
        <Heading size="sm">{title}</Heading>
        <Text>{description}</Text>
      </VStack>
    </HStack>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Card>
      <CardBody>
        <Text fontSize="lg" mb={4} fontStyle="italic">
          "{quote}"
        </Text>
        <Heading size="sm" mb={2}>
          {author}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {role}
        </Text>
      </CardBody>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  featured = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <Card
      bg={featured ? "white" : "gray.100"}
      border={featured ? "2px solid orange.500" : "1px solid gray.200"}
      boxShadow={featured ? "0 0 10px rgba(0, 0, 0, 0.1)" : "none"}>
      <CardBody>
        <Heading size="lg" mb={4}>
          {title}
        </Heading>
        <Heading size="xl" mb={4}>
          {price}
          <Text fontSize="md" color="gray.500">
            {period}
          </Text>
        </Heading>
        <List spacing={4}>
          {features.map((feature, index) => (
            <ListItem key={index}>
              <ListIcon as={FiCheckCircle} color="green.500" />
              <Text>{feature}</Text>
            </ListItem>
          ))}
        </List>
        <Button
          mt={8}
          size="lg"
          colorScheme={featured ? "orange" : "gray"}
          bg={featured ? "orange.500" : "gray.200"}
          _hover={{ bg: featured ? "orange.600" : "gray.300" }}>
          Get Started
        </Button>
      </CardBody>
    </Card>
  );
}
