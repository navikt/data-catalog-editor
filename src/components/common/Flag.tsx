import * as React from "react"
import 'flag-icon-css/css/flag-icon.css'

export const FlagIcon = (props: { country: string }) => <span className={`flag-icon flag-icon-${props.country}`}/>