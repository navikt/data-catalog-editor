import * as React from 'react'
import {intl, theme} from '../../util';
import {Block, BlockProps} from 'baseui/block';
import {H6, Paragraph2, Paragraph4} from 'baseui/typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {features} from "../../util/feature-toggle"
import NavLogo from '../../resources/navlogo.svg'
import Slackogo from '../../resources/Slack_Monochrome_White.svg'
import {useLocation} from 'react-router-dom'
import {StyledLink} from "baseui/link";

const sideBarProps: BlockProps = {
  position: 'fixed',
  height: "100%",
  width: '240px',
  backgroundColor: '#3e3832',
}

const items: BlockProps = {
  marginLeft: "1rem",
  paddingLeft: '1rem'
}

const NavItem = (props: { text: string, to: string, active?: boolean }) => {
  return (
    <React.Fragment>
      <StyledLink style={{textDecoration:"none"}} href={props.to}>
        <Block display="flex" alignItems="center">
          <Block marginRight="scale400">
            <FontAwesomeIcon
              icon={useLocation().pathname.includes(props.to) ? faChevronDown : faChevronRight}
              color="white"
              size="lg"/>
          </Block>
          <Paragraph2 color="white">{props.text}</Paragraph2>
        </Block>
      </StyledLink>
    </React.Fragment>
  )
}

const Brand = () => (
  <StyledLink style={{textDecoration:"none"}} href="/">
    <Block display="flex" alignItems="center" padding="1rem" marginTop="1rem">
      <H6 color="white" marginTop="0" marginLeft="5px" marginBottom="2rem">Behandlingskatalog</H6>
    </Block>
  </StyledLink>
)

const SideBar = () => {
  return (
    <Block {...sideBarProps}>
        <Brand/>
      <Block {...items}>
        <NavItem to="/purpose" text={intl.processingActivities}/>
        <NavItem to="/informationtype" text={intl.informationTypes}/>
        <NavItem to="/document" text={intl.documents}/>
        {features.enableThirdParty && <NavItem to="/thirdparty" text={intl.thirdParty}/>}
      </Block>

      <Block position="absolute" bottom="0" width="100%">
        <Block display="flex" justifyContent="center">
          <Block paddingBottom={theme.sizing.scale600} width="40%">
            <img src={NavLogo} alt='NAV logo' width="100%"/>
          </Block>
        </Block>
        <a href="slack://channel?team=T5LNAMWNA&id=CR1B19E6L" style={{textDecoration: "none"}}>
          <Block display="flex" justifyContent="center" paddingBottom={theme.sizing.scale400} alignItems="center">
            <img src={Slackogo} width="60px" alt="slack logo"/>
            <Paragraph4 color={theme.colors.white}>#behandlingskatalogen</Paragraph4>
          </Block>
        </a>
      </Block>
    </Block>
  )
}

export default SideBar
