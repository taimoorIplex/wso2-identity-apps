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
import React, { FunctionComponent, ReactElement } from "react";
import { Accordion, AccordionContentProps, Segment } from "semantic-ui-react";

/**
 * Proptypes for the segmented accordion content component.
 */
export interface SegmentedAccordionContentPropsInterface extends AccordionContentProps, TestableComponentInterface { }

/**
 * Segmented accordion content component.
 *
 * @param {SegmentedAccordionContentPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const SegmentedAccordionContent: FunctionComponent<SegmentedAccordionContentPropsInterface> = (
    props: SegmentedAccordionContentPropsInterface
): ReactElement => {

    const {
        className,
        children,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "segmented-accordion-content",
        "lighter-bg",
        className
    );

    return (
        <Accordion.Content
            as={ Segment }
            className={ classes }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </Accordion.Content>
    );
};

/**
 * Default proptypes for the segmented accordion content component.
 */
SegmentedAccordionContent.defaultProps = {
    attached: "bottom",
    "data-testid": "segmented-accordion-content",
    secondary: true
};
