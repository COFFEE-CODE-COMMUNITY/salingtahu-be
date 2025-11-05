import React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  Font,
  Button
} from "@react-email/components"
import EmailFooter from "../components/email-footer.component"

export interface InstructorVerifiedTemplateProps {
  firstName: string
  dashboardUrl: string
}

function InstructorVerifiedTemplate(props: InstructorVerifiedTemplateProps): React.JSX.Element {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2"
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body>
        <Tailwind>
          <Preview>Congratulations! Your instructor application has been verified</Preview>
          <Container className="text-center text-black font-[Roboto]">
            <Heading className="text-center" style={{ fontFamily: "'times-new-roman', serif" }}>
              SalingTau
            </Heading>
            <Section>
              <Text className="text-xl font-semibold">🎉 Congratulations, {props.firstName}!</Text>
              <Text className="text-lg">Your identity has been successfully verified!</Text>
              <Text>
                We're excited to let you know that your instructor application has been approved. You are now a verified
                instructor on SalingTau and can start creating and sharing courses with our community.
              </Text>
              <Text className="font-semibold">What's next?</Text>
              <Text className="text-left max-w-md mx-auto">
                • Access your instructor dashboard to create your first course
                <br />
                • Set up your instructor profile to showcase your expertise
                <br />
                • Engage with students and build your teaching portfolio
                <br />• Start earning by sharing your knowledge
              </Text>
              <Button
                className="bg-indigo-600 h-12 cursor-pointer text-white w-full max-w-xs mx-auto rounded-lg"
                style={{ lineHeight: "48px" }}
                href={props.dashboardUrl}
              >
                Go to Instructor Dashboard
              </Button>
              <Text className="text-sm text-gray-600">
                Thank you for joining our community of educators. We can't wait to see the amazing courses you'll
                create!
              </Text>
            </Section>
            <EmailFooter />
          </Container>
        </Tailwind>
      </Body>
    </Html>
  )
}

export default InstructorVerifiedTemplate
