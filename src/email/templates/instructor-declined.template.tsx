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

export interface InstructorDeclinedTemplateProps {
  firstName: string
  reason?: string
  reapplyUrl: string
}

function InstructorDeclinedTemplate(props: InstructorDeclinedTemplateProps): React.JSX.Element {
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
          <Preview>Update on your instructor application</Preview>
          <Container className="text-center text-black font-[Roboto]">
            <Heading className="text-center" style={{ fontFamily: "'times-new-roman', serif" }}>
              SalingTau
            </Heading>
            <Section>
              <Text className="text-xl font-semibold">Hello, {props.firstName}</Text>
              <Text className="text-lg">Update on Your Instructor Application</Text>
              <Text>
                Thank you for your interest in becoming an instructor on SalingTau. We appreciate the time you took to
                submit your application and complete the verification process.
              </Text>
              <Text>
                Unfortunately, we are unable to approve your instructor application at this time. Our verification
                process requires that all submitted information meets our strict standards to ensure the safety and
                integrity of our platform.
              </Text>
              {props.reason && (
                <Text className="text-left max-w-md mx-auto bg-gray-100 p-4 rounded">
                  <span className="font-semibold">Reason:</span> {props.reason}
                </Text>
              )}
              <Text className="font-semibold">What you can do:</Text>
              <Text className="text-left max-w-md mx-auto">
                • Review the verification requirements carefully
                <br />
                • Ensure all submitted documents are clear and valid
                <br />
                • Make sure your information matches your official documents
                <br />• You may reapply after addressing any issues
              </Text>
              <Button
                className="bg-indigo-600 h-12 cursor-pointer text-white w-full max-w-xs mx-auto rounded-lg"
                style={{ lineHeight: "48px" }}
                href={props.reapplyUrl}
              >
                Learn More About Requirements
              </Button>
              <Text className="text-sm text-gray-600">
                If you believe this decision was made in error or have questions about the verification process, please
                don't hesitate to contact our support team.
              </Text>
            </Section>
            <EmailFooter />
          </Container>
        </Tailwind>
      </Body>
    </Html>
  )
}

export default InstructorDeclinedTemplate
