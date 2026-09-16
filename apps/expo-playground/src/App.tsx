import {
  AsheeNativeProvider,
  Badge,
  Button,
  Card,
  Container,
  HStack,
  Input,
  Section,
  Text,
  VStack,
  useBreakpoint,
} from "@asheeui/native";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

/**
 * The playground screen.
 *
 * This is a stress test rather than a demonstration. It renders every component in
 * every state the documentation claims, in combinations a marketing screen would avoid:
 * a label long enough to wrap or truncate, an empty label, two surfaces nested, a
 * counter that forces re-renders. A prop the package does not have, a colour role that
 * does not resolve, or a layout that only works in one direction is supposed to fail
 * here, before a consumer meets it.
 *
 * When this screen fails to typecheck or to render, the framework has a defect or its
 * documentation is wrong. That is the point of it.
 */
export default function App() {
  const [text, setText] = useState("");
  const [presses, setPresses] = useState(0);
  const breakpoint = useBreakpoint();

  const bump = useCallback(() => setPresses((value) => value + 1), []);

  return (
    <AsheeNativeProvider config={{ defaultRadius: "lg" }}>
      <ScrollView className="bg-background">
        {/* The frame the stress test is presented in, built from the native package's
            own layout kit: a band that says what the screen is, above the exhaustive
            coverage. It is not markup with utility classes, because that is the claim
            the screen makes. */}
        <Section spacing="xl">
          <Container size="md">
            <VStack gap="md" align="center">
              <Badge color="primary" variant="faded">
                Playground
              </Badge>
              <Text role="body-lg" tone="muted" align="center">
                Every component the documentation claims, in every state it
                claims, from one source on a device and in a browser. A prop
                that does not exist, a colour role that does not resolve or a
                layout that only works in one direction is meant to fail here,
                before a consumer meets it.
              </Text>
              <HStack gap="sm" justify="center" wrap>
                <Badge color="secondary">Mobile</Badge>
                <Badge color="secondary">Web</Badge>
                <Badge color="secondary">Desktop</Badge>
              </HStack>
            </VStack>
          </Container>
        </Section>
        <Section spacing="lg">
          <VStack gap="lg">
            <Text role="heading-lg">AsheeUI native playground</Text>
            <Text role="body-sm" tone="muted">
              breakpoint {String(breakpoint)} - presses {presses}
            </Text>

            {/* Every semantic role, so a palette that does not resolve shows up here. */}
            <Card
              title="Roles"
              description="Each colour the package documents, in one row.">
              <View className="flex-row flex-wrap gap-2">
                <Badge color="primary">primary</Badge>
                <Badge color="secondary">secondary</Badge>
                <Badge color="danger">danger</Badge>
                <Badge color="warning">warning</Badge>
                <Badge color="success">success</Badge>
              </View>
            </Card>

            {/* Every size and variant, including the ones a real screen never uses. */}
            <Card title="Density" description="The shared axes, exhausted.">
              <View className="gap-2">
                <Button size="sm" onPress={bump}>
                  small
                </Button>
                <Button size="md" onPress={bump}>
                  medium
                </Button>
                <Button size="lg" onPress={bump}>
                  large
                </Button>
                <Button variant="bordered" onPress={bump}>
                  bordered
                </Button>
                <Button variant="ghost" onPress={bump}>
                  ghost
                </Button>
                <Button fullWidth onPress={bump}>
                  full width
                </Button>
                {/* The native control states the disabled state as `isDisabled`, where
                    the web control states it as `disabled`. The same option in the
                    framework's vocabulary, spelled the way each platform spells it, and
                    this screen is where that difference is meant to show up. */}
                <Button isDisabled onPress={bump}>
                  disabled
                </Button>
              </View>
            </Card>

            {/* Labels a screenshot would never show, which is where layout breaks. */}
            <Card title="Awkward content">
              <View className="gap-2">
                <Button onPress={bump}>
                  A label long enough to wrap on a phone, to test whether the
                  control grows or clips
                </Button>
                <Badge color="primary">
                  a badge with a label far longer than a badge usually carries
                </Badge>
                <Input
                  label=""
                  value={text}
                  onChangeText={setText}
                  placeholder=""
                />
                <Input
                  label="A label long enough to wrap onto a second line"
                  value={text}
                  onChangeText={setText}
                  placeholder="And a placeholder long enough to truncate on a narrow screen"
                />
              </View>
            </Card>

            {/* Nested surfaces, to catch a colour that only works one level deep. */}
            <Card title="Nesting">
              <Card title="Inner" description="A card inside a card.">
                <Text className="text-foreground">
                  Text on a surface on a surface.
                </Text>
              </Card>
            </Card>
          </VStack>
        </Section>
      </ScrollView>
    </AsheeNativeProvider>
  );
}
