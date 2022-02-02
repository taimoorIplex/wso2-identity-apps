/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Tab, TabPaneProps } from "semantic-ui-react";

/**
 * Resource tab pane component Prop types.
 */
export interface ResourceTabPanePropsInterface extends TabPaneProps, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Is the content segmentation handled from outside. 
     */
    controlledSegmentation?: boolean;
}


/**
 * Resource tab pane component.
 *
 * @param {ResourceTabPanePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ResourceTabPane: FunctionComponent<PropsWithChildren<ResourceTabPanePropsInterface>> = (
    props: PropsWithChildren<ResourceTabPanePropsInterface>
): ReactElement => {

    const {
        children,
        className,
        controlledSegmentation,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "resource-tab-pane",
        {
            "controlled-segments": controlledSegmentation
        },
        className
    );

    return (
        <Tab.Pane className={ classes } attached={ false } data-testid={ testId } { ...rest }>{ children }</Tab.Pane>
    );
};

/**
 * Default props for the resource tab pane component.
 */
ResourceTabPane.defaultProps = {
    attached: false,
    controlledSegmentation: false,
    "data-testid": "resource-tab-pane"
};
