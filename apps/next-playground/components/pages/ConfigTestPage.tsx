"use client";

import { Accordion } from "asheeui/accordion";
import { Button } from "asheeui/button";
import { Card } from "asheeui/card";
import { Carousel } from "asheeui/carousel";
import { Chip } from "asheeui/chip";
import { Container } from "asheeui/container";
import { DatePicker } from "asheeui/date-picker";
import {
  Drawer,
  type DrawerPlacement,
  type DrawerSizeKey,
} from "asheeui/drawer";
import { Flex } from "asheeui/flex";
import { Grid } from "asheeui/grid";
import { Heading } from "asheeui/heading";
import { Image } from "asheeui/image";
import { Input, PasswordInput } from "asheeui/input";
import { Link } from "asheeui/link";
import { Radio, RadioGroup } from "asheeui/radio";
import { Select, type SelectOption } from "asheeui/select";
import { Switch } from "asheeui/switch";
import { Text } from "asheeui/text";
import { TextArea } from "asheeui/textarea";
import { useState } from "react";

export default function ConfigTestPage() {
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [timeValue, setTimeValue] = useState<Date | null>(new Date());
  const [dateTimeValue, setDateTimeValue] = useState<Date | null>(new Date());
  const [subscriptionPlan, setSubscriptionPlan] = useState<string>("pro");
  const [communicationPref, setCommunicationPref] = useState<string>("email");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State management for controlled selects
  const [selectedCountry, setSelectedCountry] = useState<string | number>("GH");
  const [selectedFramework, setSelectedFramework] = useState<string | number>(
    "",
  );
  const [selectedRole, setSelectedRole] = useState<string | number>("");

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isOpen, setIsOpen] = useState(false);

  // Configurable Parameters for Live Testing
  const [placement, setPlacement] = useState<DrawerPlacement>("right");
  const [size, setSize] = useState<DrawerSizeKey>("md");
  const [closeOnOverlayClick, setCloseOnOverlayClick] = useState(true);
  const [closeOnEsc, setCloseOnEsc] = useState(true);

  // Helper to open drawer with a specific placement
  const handleOpen = (selectedPlacement: DrawerPlacement) => {
    setPlacement(selectedPlacement);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@")) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }
    setErrors({});
    console.log("Form Submitted:", formData);
  };

  const COUNTRY_OPTIONS: SelectOption[] = [
    { label: "Ghana", value: "GH" },
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "UK" },
    { label: "Canada", value: "CA" },
    { label: "Germany", value: "DE" },
    { label: "Japan", value: "JP" },
    { label: "Nigeria", value: "NG" },
    { label: "Australia", value: "AU" },
  ];

  const FRAMEWORK_OPTIONS: SelectOption[] = [
    { label: "Next.js (React)", value: "nextjs" },
    { label: "Vite (React)", value: "vite" },
    { label: "Nuxt (Vue)", value: "nuxt" },
    { label: "SvelteKit", value: "sveltekit" },
    { label: "SolidStart", value: "solid" },
    { label: "Astro", value: "astro" },
  ];

  const ROLE_OPTIONS: SelectOption[] = [
    { label: "Full-Stack Developer", value: "fullstack" },
    { label: "Frontend Engineer", value: "frontend" },
    { label: "Backend Engineer", value: "backend" },
    { label: "DevOps Engineer", value: "devops" },
    { label: "UI/UX Designer", value: "designer", disabled: true },
  ];

  return (
    <main className="max-w-4xl mx-auto p-8 overflow-y-hidden">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          Playground: Config-Driven Defaults
        </h1>
        <p className="text-muted-foreground">
          Testing components using system context/defaults without local prop
          overrides.
        </p>
      </header>

      {/* Chip */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Chip (Config)
        </Heading>
        <Container className="flex gap-2">
          <Chip variant="bordered" animation={"none"}>
            Default Chip
          </Chip>
          <Chip>Configured Style</Chip>
        </Container>
      </Container>

      {/* Link */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Link (Config)
        </Heading>
        <Container>
          <Link href="/dashboard">Navigate to Dashboard</Link>
        </Container>
      </Container>

      {/* Card */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Card (Config)
        </Heading>
        <Card
          title="Configured Card Title"
          isClickable
          description="Default card description text using global settings">
          <p>
            Card body content relying on default padding, gap, and variants.
          </p>
        </Card>
      </Container>

      {/* Image */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Image (Config)
        </Heading>
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          alt="Abstract config test image"
        />
      </Container>

      {/* Accordion */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Accordion (Config)
        </Heading>
        <Accordion
          variant="ghost"
          items={[
            {
              id: "item-1",
              title: "Configured ContContainer 1",
              content:
                "ContContainer content using global spacing and default animation.",
            },
            {
              id: "item-2",
              title: "Configured ContContainer 2",
              content: "Additional panel content driven by configuration.",
            },
          ]}
        />
      </Container>

      {/* Carousel */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Carousel (Config)
        </Heading>
        <Carousel
          items={[
            {
              id: "1",
              content: (
                <Container className="bg-muted p-8 text-center rounded-lg">
                  Slide 1
                </Container>
              ),
            },
            {
              id: "2",
              content: (
                <Container className="bg-muted p-8 text-center rounded-lg">
                  Slide 2
                </Container>
              ),
            },
          ]}
        />
      </Container>

      <Container>
        <Heading level={4} className="text-lg font-semibold">
          DatePicker Component Test
        </Heading>

        {/* Date Mode */}
        <Container className="space-y-1.5">
          <DatePicker
            label="Date Mode"
            mode="date"
            selected={dateValue}
            onChange={setDateValue}
            isClearable
            description="Pick a single date"
          />
          <p className="text-[11px] font-mono text-muted-foreground">
            Value: {dateValue ? dateValue.toISOString() : "null"}
          </p>
        </Container>

        {/* Time Mode */}
        <Container className="space-y-1.5">
          <DatePicker
            label="Time Mode"
            mode="time"
            selected={timeValue}
            onChange={setTimeValue}
            isClearable
            description="Pick hours and minutes"
          />
          <p className="text-[11px] font-mono text-muted-foreground">
            Value: {timeValue ? timeValue.toTimeString() : "null"}
          </p>
        </Container>

        {/* DateTime Mode */}
        <Container className="space-y-1.5">
          <DatePicker
            label="Date & Time Mode"
            mode="datetime"
            selected={dateTimeValue}
            onChange={setDateTimeValue}
            isClearable
            description="Combined date and time picker"
          />
          <p className="text-[11px] font-mono text-muted-foreground">
            Value: {dateTimeValue ? dateTimeValue.toLocaleString() : "null"}
          </p>
        </Container>
      </Container>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 p-6 border rounded-xl bg-background">
        <Heading level={4} className="text-xl font-bold mb-4">
          Create Account
        </Heading>

        {/* Standard Input */}
        <Input
          label="Username"
          placeholder="johndoe"
          required
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        {/* Input with Validation Status & Message */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          status={errors.email ? "error" : "default"}
          message={errors.email}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Password Input with built-in toggle */}
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          required
          description="Must be at least 8 characters long."
          value={formData.password}
          variant="underlined"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* TextArea Component */}
        <TextArea
          label="Bio"
          placeholder="Tell us a little bit about yourself..."
          rows={4}
          description="Optional profile bio."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />

        <Button
          type="submit"
          size="md"
          // className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Register
        </Button>
      </form>

      {/* SECTION 2: Radio & RadioGroup Demo */}
      <Container>
        <Flex direction="col">
          <Heading level={4}>Radio & RadioGroup</Heading>
          <Text>
            Demonstrating default stacked list and card grid variants.
          </Text>
        </Flex>

        <Flex direction="col">
          {/* Radio Card Variant (Horizontal Grid) */}
          <RadioGroup
            label="Select Subscription Tier"
            description="Cards inherit the active color and border radius automatically"
            value={subscriptionPlan}
            onChange={setSubscriptionPlan}
            variant="card"
            orientation="horizontal"
            size="md">
            <Radio
              value="free"
              label="Free Plan"
              description="Basic features with community support."
              className="flex-1 min-w-52"
            />
            <Radio
              value="pro"
              label="Pro ($19/mo)"
              description="Advanced analytics, priority support, and team seats."
              className="flex-1 min-w-52"
            />
            <Radio
              value="enterprise"
              label="Enterprise"
              description="Custom integrations, dedicated SLA, and unlimited scale."
              className="flex-1 min-w-52"
            />
          </RadioGroup>

          {/* Standard Radio List (Vertical) */}
          <RadioGroup
            label="Notification Preference"
            value={communicationPref}
            onChange={setCommunicationPref}
            variant="default"
            color="success"
            orientation="vertical"
            size="sm">
            <Radio
              value="email"
              label="Email Notifications"
              description="Receive daily digests and account updates"
            />
            <Radio
              value="sms"
              label="SMS Alerts"
              description="Get urgent account activity alerts via SMS"
            />
            <Radio
              value="none"
              label="Do Not Disturb"
              description="Turn off all automated communications"
            />
          </RadioGroup>
        </Flex>
      </Container>

      <section className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">
            1. Basic & Searchable Select
          </h2>
          <p className="text-xs text-muted-foreground">
            Supports live search filtering and custom option lists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Searchable Select */}
          <Select
            label="Country / Region"
            description="Type to filter through countries"
            options={COUNTRY_OPTIONS}
            value={selectedCountry}
            onValueChange={setSelectedCountry}
            isSearch
            searchPlaceholder="Search country name..."
            placeholder="Choose country..."
            required
          />

          {/* Basic Select with Disabled Item */}
          <Select
            label="Primary Role"
            description="Select your engineering specialty"
            options={ROLE_OPTIONS}
            value={selectedRole}
            onValueChange={setSelectedRole}
            placeholder="Select a role..."
          />
        </div>
      </section>

      {/* SECTION 2: Custom Dropdown Content & Actions */}
      <Container className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <Flex>
          <Heading level={4} className="text-lg font-semibold">
            Select with `belowList` Action
          </Heading>
          <Text className="text-xs text-muted-foreground">
            Embed custom components or action buttons at the bottom of the
            dropdown list.
          </Text>
        </Flex>

        <div className="max-w-md">
          <Select
            label="Project Framework"
            description="Choose a framework or add a new custom option"
            options={FRAMEWORK_OPTIONS}
            value={selectedFramework}
            onValueChange={setSelectedFramework}
            isSearch
            placeholder="Select framework..."
            belowList={
              <button
                type="button"
                onClick={() =>
                  alert("Redirecting to create custom framework...")
                }
                className="w-full text-left px-3 py-2 text-xs text-primary font-medium hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1">
                + Add Custom Framework
              </button>
            }
          />
        </div>
      </Container>

      {/* SECTION 3: Validation & Field States */}
      <Container className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <Flex align="center" justify="between">
          <Flex>
            <Heading level={4}>Statuses & Loading State</Heading>
            <Text className="text-xs text-muted-foreground">
              Error, warning, success states and simulated loading spinners.
            </Text>
          </Flex>
          <Button
            type="button"
            onClick={() => setIsLoading(!isLoading)}
            className="px-3 py-1 text-xs border border-border rounded-md bg-secondary hover:bg-secondary/80">
            Toggle Loading ({isLoading ? "ON" : "OFF"})
          </Button>
        </Flex>
      </Container>

      <Container>
        <Heading level={4}>Controlled Component</Heading>

        <Switch
          label="Push Notifications"
          description="Receive real-time updates on your workspace activity."
          checked={isNotificationsEnabled}
          onChange={(checked) => setIsNotificationsEnabled(checked)}
        />

        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
          Current State:{" "}
          <strong>
            {isNotificationsEnabled ? "Active (true)" : "Inactive (false)"}
          </strong>
        </p>
      </Container>

      {/* ── 2. Colors & Sizes ──────────────────────────────────── */}
      <Container className="space-y-4">
        <Heading level={4}>Colors & Sizes</Heading>

        <Switch
          label="Dark Mode (Success - Large)"
          size="lg"
          color="success"
          checked={isDarkMode}
          onChange={(checked) => setIsDarkMode(checked)}
        />

        <Switch
          label="Auto-delete Logs (Danger - Small)"
          size="sm"
          color="danger"
          defaultChecked
        />

        <Switch
          label="Maintenance Mode (Warning)"
          color="warning"
          defaultChecked
        />
      </Container>

      <Container>
        {/* ── Page Header ────────────────────────────────────────── */}
        <Container>
          <Heading level={4}>Drawer Component Test</Heading>
          <Text>Interactive test harness for Ashee UI Drawer</Text>
        </Container>

        {/* ── 1. Placement Triggers ────────────────────────────── */}
        <Container>
          <Heading level={4}>1. Test Placements</Heading>
          <Grid columns={4}>
            <Button
              type="button"
              onClick={() => handleOpen("left")}
              className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer">
              Open Left
            </Button>
            <Button
              type="button"
              onClick={() => handleOpen("right")}
              className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer">
              Open Right
            </Button>
            <Button
              type="button"
              onClick={() => handleOpen("top")}
              className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer">
              Open Top
            </Button>
            <Button
              type="button"
              onClick={() => handleOpen("bottom")}
              className="px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted font-medium text-sm transition-colors cursor-pointer">
              Open Bottom
            </Button>
          </Grid>
        </Container>

        {/* ── 2. Size & Option Controls ────────────────────────── */}
        <Container>
          <Heading level={4}>2. Configuration Options</Heading>

          {/* Size Selection */}
          <Container>
            <Text as="label">Drawer Size Key</Text>
            <div className="flex flex-wrap gap-2">
              {(["sm", "md", "lg", "xl"] as DrawerSizeKey[]).map((s) => (
                <Button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    size === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border border-border hover:bg-muted"
                  }`}>
                  {s.toUpperCase()}
                </Button>
              ))}
            </div>
          </Container>

          {/* Behavior Toggles */}
          <Container className="flex flex-wrap gap-6 pt-2">
            <Text as="label">
              <input
                type="checkbox"
                checked={closeOnOverlayClick}
                onChange={(e) => setCloseOnOverlayClick(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Close on Overlay Click
            </Text>

            <Text as="label">
              <input
                type="checkbox"
                checked={closeOnEsc}
                onChange={(e) => setCloseOnEsc(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              Close on ESC Key
            </Text>
          </Container>
        </Container>

        {/* ── 3. Active State Debug Readout ─────────────────────── */}
        <Flex align="center" justify="between">
          <span>
            Drawer Open: <strong>{String(isOpen)}</strong>
          </span>
          <span>
            Placement: <strong>{placement}</strong>
          </span>
          <span>
            Size: <strong>{size}</strong>
          </span>
        </Flex>

        {/* ── Drawer Component Instance ────────────────────────── */}
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          placement={placement}
          size={size}
          closeOnOverlayClick={closeOnOverlayClick}
          closeOnEsc={closeOnEsc}>
          {/* Drawer Header */}
          <Flex>
            <Flex>
              <Heading level={5}>
                {placement.charAt(0).toUpperCase() + placement.slice(1)} Drawer
              </Heading>
              <Text>
                Configured with size: <span className="font-mono">{size}</span>
              </Text>
            </Flex>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close drawer"
              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              ✕
            </Button>
          </Flex>

          {/* Drawer Body */}
          <Container className="flex-1 overflow-y-auto p-4 space-y-4">
            <Text className="text-sm text-foreground/80 leading-relaxed">
              This surface rendered smoothly using Framer Motion and `asheeui`
              responsive CSS variables.
            </Text>

            <Container>
              <Text as="label">Example Field inside Drawer</Text>
              <Input
                type="text"
                placeholder="Type something here..."
                className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Container>

            <Container className="p-3 bg-muted/50 rounded-lg text-xs space-y-1">
              <p className="font-semibold">Test Checklist:</p>
              <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                <li>
                  Press{" "}
                  <kbd className="px-1 py-0.5 border rounded bg-background">
                    ESC
                  </kbd>{" "}
                  to dismiss
                </li>
                <li>Click overlay outside to dismiss</li>
                <li>Observe slide & backdrop animation</li>
              </ul>
            </Container>
          </Container>

          {/* Drawer Footer */}
          <Flex direction="row">
            <Button
              color="danger"
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors cursor-pointer">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer">
              Save Changes
            </Button>
          </Flex>
        </Drawer>
      </Container>

      <Container>
        <Heading level={4}>Controlled Component</Heading>

        <Switch
          label="Push Notifications"
          description="Receive real-time updates on your workspace activity."
          checked={isNotificationsEnabled}
          onChange={(checked) => setIsNotificationsEnabled(checked)}
        />

        <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
          Current State:{" "}
          <strong>
            {isNotificationsEnabled ? "Active (true)" : "Inactive (false)"}
          </strong>
        </p>
      </Container>
    </main>
  );
}
