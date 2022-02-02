/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from "react";
import { Container, Grid, Responsive } from "semantic-ui-react";
import { SidePanel } from "./side-panel";
import { SidePanelMobile } from "./side-panel-mobile";
import * as UIConstants from "../../constants/ui-constants";

/**
 * Side panel wrapper component Prop types.
 */
interface SidePanelWrapperProps {
    headerHeight: number;
    children?: React.ReactNode;
    onSidePanelItemClick: () => void;
    onSidePanelPusherClick: () => void;
    mobileSidePanelVisibility: boolean;
}

/**
 * Side panel wrapper component.
 *
 * @param {SidePanelWrapperProps} props - Props injected to the side panel wrapper component.
 * @return {JSX.Element}
 */
export const SidePanelWrapper: React.FunctionComponent<SidePanelWrapperProps> = (
    props: SidePanelWrapperProps
): JSX.Element => {

    const {
        headerHeight,
        mobileSidePanelVisibility,
        children,
        onSidePanelPusherClick,
        onSidePanelItemClick
    } = props;

    const mobileContentStyle = {
        padding: `${ UIConstants.MOBILE_CONTENT_PADDING }`
    };

    const desktopContentStyle = {
        paddingTop: `${ UIConstants.DESKTOP_CONTENT_TOP_PADDING }px`
    };

    return (
        <>
            <Responsive { ...Responsive.onlyMobile }>
                <SidePanelMobile
                    headerHeight={ headerHeight }
                    onPusherClick={ onSidePanelPusherClick }
                    visible={ mobileSidePanelVisibility }
                    onSidePanelItemClick={ onSidePanelItemClick }
                >
                    <Container style={ mobileContentStyle }>{ children }</Container>
                </SidePanelMobile>
            </Responsive>
            <Responsive as={ Container } minWidth={ Responsive.onlyTablet.minWidth }>
                <Grid style={ desktopContentStyle }>
                    <Grid.Row className="layout-wrapper-row" columns={ 2 }>
                        <Grid.Column tablet={ 4 } computer={ 3 }>
                            <SidePanel headerHeight={ headerHeight } onSidePanelItemClick={ onSidePanelItemClick }/>
                        </Grid.Column>
                        <Grid.Column tablet={ 12 } computer={ 13 }>
                            { children }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Responsive>
        </>
    );
};
