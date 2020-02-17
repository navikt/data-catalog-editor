import { createTheme, lightThemePrimitives } from 'baseui'
import { colors } from "baseui/tokens"
import { ThemePrimitives } from 'baseui/theme'

const primitives: ThemePrimitives = {
  ...lightThemePrimitives,
  primary: "#19548a",
  primary50: "#eaf4fc",
  primary100: colors.blue100,
  primary200: "#99c2e8",
  primary300: colors.blue300,
  primary400: "#19548a",
  primary500: colors.blue500,
  primary600: colors.blue600,
  primary700: colors.blue700,

  accent: colors.platinum700,
  accent50: colors.platinum50,
  accent100: colors.platinum100,
  accent200: colors.platinum200,
  accent300: colors.platinum300,
  accent400: colors.platinum400,
  accent500: colors.platinum500,
  accent600: colors.platinum600,
  accent700: colors.platinum700,
}

const overrides = {
  colors: {
    buttonSecondaryText: primitives.accent600,

    linkVisited: primitives.primary400,
  },
}

export const theme = createTheme(primitives, overrides)
