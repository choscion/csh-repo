import { colors } from "../Colors"
import type { TextProps } from "."
import { Text } from "."

const meta = {
  title: "base/Text",
  component: Text,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: Object.keys(colors),
      },
      description: "텍스트 색상",
    },
    size: {
      control: {
        type: "select",
        options: ["t1", "t2", "t3", "t4", "t5"],
      },
    },
    bold: {
      control: { type: "boolean" },
    },
    text: {
      control: { type: "text" },
    },
  },
}

export default meta

export const 텍스트 = ({ color, size, bold, text = "Text입니다." }: TextProps & { text: string }) => {
  return (
    <Text color={color} size={size} bold={bold}>
      {text}
    </Text>
  )
}
