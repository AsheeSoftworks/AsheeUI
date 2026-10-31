/**
 * The Expo application.
 *
 * A device has no editor and no room for a top bar, so this shell differs from the web
 * one in exactly two ways: the navigation is at the bottom, and the settings entry is in
 * the header. The screens themselves are the same package.
 */
import {
  DashboardScreen,
  NutritionScreen,
  ProgressScreen,
  SettingsScreen,
  StudioScreen,
  WorkoutDetailScreen,
  WorkoutsScreen,
  destinations,
  workouts,
  type RouteKey,
} from "@asheeui/fitness-shared";
import {
  Avatar,
  Badge,
  Button,
  Card,
  HStack,
  Page,
  Typography,
  VStack,
} from "asheeui";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** The five destinations the bottom bar carries; settings sits in the header. */
const PRIMARY = destinations.filter((destination) => destination.key !== "settings");

/** The mobile shell. */
export function MobileShell() {
  const insets = useSafeAreaInsets();
  const [route, setRoute] = useState<RouteKey>("dashboard");
  const [workoutId, setWorkoutId] = useState<string | undefined>();

  const go = (next: RouteKey) => {
    setWorkoutId(undefined);
    setRoute(next);
  };

  const openWorkout = (id: string) => setWorkoutId(id);

  const screen = (() => {
    if (workoutId) {
      const workout = workouts.find((candidate) => candidate.id === workoutId);
      if (workout) {
        return (
          <WorkoutDetailScreen
            workout={workout}
            onBack={() => setWorkoutId(undefined)}
            onFinish={() => setWorkoutId(undefined)}
          />
        );
      }
    }

    switch (route) {
      case "dashboard":
        return <DashboardScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      case "workouts":
        return <WorkoutsScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      case "nutrition":
        return <NutritionScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      case "progress":
        return <ProgressScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      case "studio":
        return <StudioScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      case "settings":
        return <SettingsScreen onNavigate={go} onOpenWorkout={openWorkout} />;
      default:
        return <DashboardScreen onNavigate={go} onOpenWorkout={openWorkout} />;
    }
  })();

  return (
    <Page>
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
          <HStack justify="between" align="center" gap="sm">
            <HStack gap="sm" align="center">
              <Avatar name="Pulse" size="sm" />
              <VStack gap="xs">
                <Typography role="heading-sm">Pulse</Typography>
                <Typography role="caption" tone="muted">
                  {destinations.find((item) => item.key === route)?.label ?? "Today"}
                </Typography>
              </VStack>
            </HStack>
            <HStack gap="sm" align="center">
              <Badge color="success" variant="faded" size="sm">
                day 12
              </Badge>
              <Button
                size="sm"
                variant={route === "settings" ? "solid" : "ghost"}
                accessibilityLabel="Settings"
                onPress={() => go("settings")}
              >
                ⚙
              </Button>
            </HStack>
          </HStack>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 120 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {screen}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 8 + insets.bottom,
          }}
        >
          <Card variant="elevated" size="sm">
            <HStack justify="between" align="center" gap="xs">
              {PRIMARY.map((destination) => (
                <Button
                  key={destination.key}
                  size="sm"
                  variant={route === destination.key ? "solid" : "ghost"}
                  accessibilityLabel={destination.label}
                  onPress={() => go(destination.key)}
                >
                  {destination.glyph}
                </Button>
              ))}
            </HStack>
          </Card>
        </View>
      </View>
    </Page>
  );
}
