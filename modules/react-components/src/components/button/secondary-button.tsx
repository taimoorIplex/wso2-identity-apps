/*
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
import React, { FunctionComponent, ReactElement } from "react";
import { ButtonProps, Button as SemanticButton } from "semantic-ui-react";

/**
 * Secondary button component Prop types.
 */
export interface SecondaryButtonPropsInterface extends ButtonProps, TestableComponentInterface { }

/**
 * Secondary button component.
 *
 * @param {SecondaryButtonPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const SecondaryButton: FunctionComponent<SecondaryButtonPropsInterface> = (
    props: SecondaryButtonPropsInterface
): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    return (
        <SemanticButton { ...props } secondary data-testid={ testId } />
    );
};

/**
 * Prop types for the secondary button component.
 */
SecondaryButton.defaultProps = {
    "data-testid": "secondary-button"
};
