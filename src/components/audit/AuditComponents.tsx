import { Block, BlockProps } from "baseui/block"
import { Label2, Label3 } from "baseui/typography"
import React from "react"
import { AuditAction } from "../../constants"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { PLACEMENT, StatefulTooltip } from "baseui/tooltip"
import { faInfoCircle, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons"
import { intl, theme } from "../../util"

const labelBlockProps: BlockProps = {
    display: ['flex', 'block', 'block', 'flex'],
    width: ['20%', '100%', '100%', '20%'],
    alignSelf: 'flex-start',
}

export const AuditLabel = (props: { label: string, children: any }) => {
    return (
        <Block display={['flex', 'block', 'block', 'flex']}>
            <Block {...labelBlockProps}>
                <Label2>{props.label}</Label2>
            </Block>
            <Block>
                <Label3>{props.children}</Label3>
            </Block>
        </Block>
    )
}

export const AuditActionIcon = (props: { action: AuditAction, withText?: boolean }) => {
    const icon =
        (props.action === AuditAction.CREATE && {icon: faPlusCircle, color: theme.colors.positive300}) ||
        (props.action === AuditAction.UPDATE && {icon: faInfoCircle, color: theme.colors.warning300}) ||
        (props.action === AuditAction.DELETE && {icon: faMinusCircle, color: theme.colors.negative400}) ||
        {icon: undefined, color: undefined}

    return (
        <StatefulTooltip content={() => intl[props.action]} placement={PLACEMENT.top}>
            <Block marginRight=".5rem" display="inline">
                <FontAwesomeIcon icon={icon.icon!} color={icon.color}/> {props.withText && intl[props.action]}
            </Block>
        </StatefulTooltip>
    )
}
