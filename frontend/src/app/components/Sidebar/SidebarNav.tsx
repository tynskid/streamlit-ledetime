import React, { ReactElement, useCallback, useRef, useState } from "react"
import * as reactDeviceDetect from "react-device-detect"
import { ExpandMore, ExpandLess } from "@emotion-icons/material-outlined"

import { IAppPage } from "src/lib/proto"
import Icon, { EmojiIcon } from "src/lib/components/shared/Icon"
import { useIsOverflowing } from "src/lib/util/Hooks"
import { StreamlitEndpoints } from "src/lib/StreamlitEndpoints"

import {
  StyledSidebarNavContainer,
  StyledSidebarNavItems,
  StyledSidebarNavLink,
  StyledSidebarLinkText,
  StyledSidebarNavLinkContainer,
  StyledSidebarNavSeparatorContainer,
  StyledSidebarHeader,
} from "./styled-components"

export interface Props {
  endpoints: StreamlitEndpoints
  appPages: IAppPage[]
  collapseSidebar: () => void
  currentPageScriptHash: string
  hasSidebarElements: boolean
  hideParentScrollbar: (newValue: boolean) => void
  onPageChange: (pageName: string) => void
  pageLinkBaseUrl: string
}

const headerIndices = [1, 3, 6, 9]

const headerText = (index: number): string => {
  switch (index) {
    case 1:
      return "Discover Targets"
    case 3:
      return "Research Tools "
    case 6:
      return "Build Pitches"
    case 9:
      return "Administration"
    default:
      return ""
  }
}


const SidebarNav = ({
  endpoints,
  appPages,
  collapseSidebar,
  currentPageScriptHash,
  hasSidebarElements,
  hideParentScrollbar,
  onPageChange,
  pageLinkBaseUrl,
}: Props): ReactElement | null => {
  const [expanded, setExpanded] = useState(false)
  const navItemsRef = useRef<HTMLUListElement>(null)
  const isOverflowing = useIsOverflowing(navItemsRef)

  const onMouseOver = useCallback(() => {
    if (isOverflowing) {
      hideParentScrollbar(true)
    }
  }, [isOverflowing, hideParentScrollbar])

  const onMouseOut = useCallback(
    () => hideParentScrollbar(false),
    [hideParentScrollbar]
  )

  const toggleExpanded = useCallback(() => {
    if (!expanded && isOverflowing) {
      setExpanded(true)
    } else if (expanded) {
      setExpanded(false)
    }
  }, [expanded, isOverflowing])

  if (appPages.length < 2) {
    return null
  }

  return (
    <StyledSidebarNavContainer data-testid="stSidebarNav">
      <StyledSidebarNavItems
        ref={navItemsRef}
        isExpanded={expanded}
        isOverflowing={isOverflowing}
        hasSidebarElements={hasSidebarElements}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      >
        {appPages.map((page: IAppPage, pageIndex: number) => {
          if (headerIndices.includes(pageIndex)) {
            return (
              <React.Fragment key={`header-${pageIndex}`}>
                <StyledSidebarHeader>
                  {headerText(pageIndex)}
                </StyledSidebarHeader>
                {renderNavItem(page, pageIndex, endpoints, pageLinkBaseUrl, currentPageScriptHash, onPageChange, collapseSidebar)}
              </React.Fragment>
            )
          } else {
            return <React.Fragment key={`navitem-${pageIndex}`}>
              {renderNavItem(page, pageIndex, endpoints, pageLinkBaseUrl, currentPageScriptHash, onPageChange, collapseSidebar)}
            </React.Fragment>
          }
        })}
      </StyledSidebarNavItems>

      {hasSidebarElements && (
        <StyledSidebarNavSeparatorContainer
          isExpanded={expanded}
          isOverflowing={isOverflowing}
          onClick={toggleExpanded}
        >
          {isOverflowing && !expanded && (
            <Icon content={ExpandMore} size="md" />
          )}
          {expanded && <Icon content={ExpandLess} size="md" />}
        </StyledSidebarNavSeparatorContainer>
      )}
    </StyledSidebarNavContainer>
  )
}

const renderNavItem = (
  page: IAppPage,
  pageIndex: number,
  endpoints: StreamlitEndpoints,
  pageLinkBaseUrl: string,
  currentPageScriptHash: string,
  onPageChange: (pageName: string) => void,
  collapseSidebar: () => void
) => {
  const pageUrl = endpoints.buildAppPageURL(
    pageLinkBaseUrl,
    page,
    pageIndex
  )

  const pageName = page.pageName as string
  const tooltipContent = pageName.replace(/_/g, " ")
  const isActive = page.pageScriptHash === currentPageScriptHash

  return (
    <li>
      <StyledSidebarNavLinkContainer>
        <StyledSidebarNavLink
          isActive={isActive}
          href={pageUrl}
          onClick={e => {
            e.preventDefault()
            onPageChange(page.pageScriptHash as string)
            if (reactDeviceDetect.isMobile) {
              collapseSidebar()
            }
          }}
        >
          {page.icon && page.icon.length && (
            <EmojiIcon size="lg">{page.icon}</EmojiIcon>
          )}
          <StyledSidebarLinkText isActive={isActive}>
            {tooltipContent}
          </StyledSidebarLinkText>
        </StyledSidebarNavLink>
      </StyledSidebarNavLinkContainer>
    </li>
  )
}

export default SidebarNav