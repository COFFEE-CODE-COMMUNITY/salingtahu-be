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
  Button,
} from "@react-email/components"
import EmailFooter from "../components/email-footer.component"

export interface PasswordResetTemplateProps {
  setPasswordUrl: string
}

function PasswordResetTemplate(props: PasswordResetTemplateProps): React.JSX.Element {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body>
        <Tailwind>
          <Preview>Reset your SalingTau password</Preview>
          <Container className="text-center text-black font-[Roboto]">
            <Heading className="text-center" style={{ fontFamily: "'times-new-roman', serif" }}>
              SalingTau
            </Heading>
            <Section>
              <Text className="text-xl font-semibold">You're almost there, just set a new password</Text>
              <Text>
                We received a request to reset your SalingTau password. No worries, it happens! Click the button below
                to set up a new one.
              </Text>
              <Button
                className="bg-indigo-600 h-12 cursor-pointer text-white w-full max-w-xs mx-auto rounded-lg"
                style={{ lineHeight: "48px" }}
                href={props.setPasswordUrl}
              >
                Reset Password
              </Button>
              <Text>
                If you didn't ask to reset your password, you don't need to do anything. You can safely ignore this
                email, and your account will remain secure.
              </Text>
            </Section>
            <EmailFooter />
          </Container>
        </Tailwind>
      </Body>
    </Html>
  )
}

export default PasswordResetTemplate
