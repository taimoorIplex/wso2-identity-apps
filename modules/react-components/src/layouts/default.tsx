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

import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode, SyntheticEvent } from "react";
import { Container, Responsive } from "semantic-ui-react";
import { BaseLayout, BaseLayoutInterface } from "./base";

/**
 * Default layout Prop types.
 */
export interface DefaultLayoutPropsInterface extends BaseLayoutInterface {
    /**
     * App footer component.
     */
    footer?: ReactNode;
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
    /**
     * App header component.
     */
    header?: ReactNode;
    /**
     * Content spacing.
     */
    desktopContentTopSpacing?: number;
    /**
     * height of the footer.
     */
    footerHeight: number;
    /**
     * Height of the header.
     */
    headerHeight: number;
    /**
     * Fired on layout update to handle responsiveness.
     * @param {React.SyntheticEvent<HTMLElement>} event - Event.
     * @param {ResponsiveOnUpdateData} data - Metadata.
     */
    onLayoutOnUpdate?: (event: SyntheticEvent<HTMLElement>, data: any) => void;
}

/**
 * Default layout.
 *
 * @param {React.PropsWithChildren<DefaultLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const DefaultLayout: FunctionComponent<PropsWithChildren<DefaultLayoutPropsInterface>> = (
    props: PropsWithChildren<DefaultLayoutPropsInterface>
): ReactElement => {

    const {
        alert,
        children,
        className,
        desktopContentTopSpacing,
        footer,
        footerHeight,
        fluid,
        header,
        headerHeight,
        onLayoutOnUpdate,
        topLoadingBar
    } = props;

    const classes = classNames(
        "layout",
        "default-layout",
        {
            [ "fluid-default-layout" ]: fluid
        },
        className
    );

    const mainLayoutStyles = {
        paddingBottom: `${ footerHeight }px`,
        paddingTop: `${ headerHeight }px`
    };

    const mainContentStyle = {
        minHeight: `calc(100vh - ${ headerHeight + footerHeight }px`,
        paddingTop: `${ desktopContentTopSpacing }px`
    };

    return (
        <BaseLayout
            alert={ alert }
            topLoadingBar={ topLoadingBar }
        >
            <Responsive
                as={ Container }
                fluid={ fluid }
                className={ classes }
                fireOnMount
                onUpdate={ onLayoutOnUpdate }
            >
                { header }
                <div style={ mainLayoutStyles } className="layout-content-wrapper">
                    <div style={ mainContentStyle } className="layout-content">
                        { children }
                    </div>
                </div>
                { footer }
            </Responsive>
        </BaseLayout>
    );
};


/**
 * Default props for the default layout.
 */
DefaultLayout.defaultProps = {
    fluid: true
};
