import { ErrorMessage } from "formik";
import { Block } from "baseui/block";
import { KIND as NKIND, Notification } from "baseui/notification";
import { Label2 } from "baseui/typography";
import * as React from "react";
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { theme } from "../../util"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"


export const Error = (props: { fieldName: string, fullWidth?: boolean }) => (
  <ErrorMessage name={props.fieldName}>
    {msg => (
      <Block display="flex" width="100%" marginTop=".2rem">
        {!props.fullWidth && <ModalLabel/>}
        <Block width="100%">
          <Notification overrides={{Body: {style: {width: 'auto', padding: 0, marginTop: 0}}}} kind={NKIND.negative}>{msg}</Notification>
        </Block>
      </Block>
    )}
  </ErrorMessage>
);

export const ModalLabel = (props: { label?: string, tooltip?: string }) => {
  return (
    <Block width="25%" alignSelf="center" paddingRight=".5rem">
      {props.tooltip ?
        <StatefulTooltip content={props.tooltip} placement={PLACEMENT.top}>
          <Label2 font="font300" display="flex" justifyContent="space-between" width="100%">
            <>{props.label}</>
            <FontAwesomeIcon style={{marginRight: ".5rem", alignSelf: "center"}}
                             icon={faExclamationCircle} color={theme.colors.accent400} size="sm"/>
          </Label2>
        </StatefulTooltip>
        : <Label2 font="font300">{props.label}</Label2>
      }
    </Block>
  )
};
