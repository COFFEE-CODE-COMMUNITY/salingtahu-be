import React from "react"
import { Hr, Section, Text } from "@react-email/components"

function EmailFooter(): React.JSX.Element {
  return (
    <>
      <Hr />
      <Section className="mt-3 text-center text-sm text-gray-500 bg-gray-100">
        <Text className="text-xs my-2">1234 Tanah Sareal Rd, Suite 500</Text>
        <Text className="text-xs my-2">Ngawi, East Java, 6969, Indonesia</Text>
        <Text className="text-xs my-2">Phone: +62 21 555 0123</Text>
        <Text className="mt-2 text-xs">
          If you have any questions, please{" "}
          <a href="mailto:support@salingtau.com" className="text-indigo-600 underline">
            contact us
          </a>
          .
        </Text>
        <Text className="mt-4 text-xs text-gray-400">
          Copyright © {new Date().getFullYear()} SalingTau Inc. All rights reserved.
        </Text>
      </Section>
    </>
  )
}

export default EmailFooter
