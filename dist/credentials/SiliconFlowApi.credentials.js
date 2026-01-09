"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiliconFlowApi = void 0;
class SiliconFlowApi {
    constructor() {
        this.name = 'siliconFlowApi';
        this.displayName = 'SiliconFlow API';
        this.documentationUrl = 'https://docs.siliconflow.cn/';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your SiliconFlow API key',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'https://api.siliconflow.cn/v1',
                description: 'The base URL for SiliconFlow API',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/models',
                method: 'GET',
            },
        };
    }
}
exports.SiliconFlowApi = SiliconFlowApi;
