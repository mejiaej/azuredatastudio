/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ResourceTypeService } from './resourceTypeService';

export class UriHandlerService implements vscode.UriHandler {
	constructor(private _resourceTypeService: ResourceTypeService) { }

	handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
		if (uri.path === '/deploy') {
			const params = uri.query.split('&').map(kv => kv.split('='));
			const paramType = params.find(param => param[0] === 'type')?.[1];
			const wizardParams = JSON.parse(params.find(param => param[0] === 'params')?.[1] ?? '');

			const resourceType = this._resourceTypeService.getResourceTypes().find(type => type.name === paramType);
			if (resourceType) {
				this._resourceTypeService.startDeployment(resourceType, undefined, wizardParams);
			} else {
				return vscode.commands.executeCommand('azdata.resource.deploy');
			}

		}
	}
}
