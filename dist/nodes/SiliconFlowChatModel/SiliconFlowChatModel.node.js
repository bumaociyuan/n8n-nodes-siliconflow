"use strict";
/* eslint-disable n8n-nodes-base/node-dirname-against-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiliconFlowChatModel = void 0;
const openai_1 = require("@langchain/openai");
class SiliconFlowChatModel {
    constructor() {
        this.description = {
            displayName: 'SiliconFlow Chat Model',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-name-miscased
            name: 'siliconFlowChatModel',
            icon: 'file:siliconflow.svg',
            group: ['ai'],
            version: [1],
            description: 'LangChain-compatible SiliconFlow chat model for AI agents',
            defaults: {
                name: 'SiliconFlow Chat Model',
            },
            // 添加 LangChain 兼容标识
            codex: {
                categories: ['AI'],
                subcategories: {
                    AI: ['Language Models', 'Root Nodes'],
                    'Language Models': ['Chat Models (Recommended)'],
                },
                resources: {
                    primaryDocumentation: [
                        {
                            url: 'https://docs.siliconflow.cn/',
                        },
                    ],
                },
            },
            // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
            inputs: [],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
            outputs: ["ai_languageModel" /* NodeConnectionType.AiLanguageModel */],
            outputNames: ['Model'],
            // 添加 LangChain Chat Model 标识
            subtitle: '={{$parameter["model"]}}',
            credentials: [
                {
                    name: 'siliconFlowApi',
                    required: true,
                },
            ],
            requestDefaults: {
                ignoreHttpStatusErrors: true,
                baseURL: '={{ $credentials?.baseUrl }}',
            },
            properties: [
                {
                    displayName: 'Connect to AI Agent, Tools Agent, or AI Chain to use this node',
                    name: 'notice',
                    type: 'notice',
                    default: '',
                },
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    description: 'The model which will generate the completion. All models support tools calling.',
                    typeOptions: {
                        loadOptions: {
                            routing: {
                                request: {
                                    method: 'GET',
                                    url: '/models?sub_type=chat',
                                },
                                output: {
                                    postReceive: [
                                        {
                                            type: 'rootProperty',
                                            properties: {
                                                property: 'data',
                                            },
                                        },
                                        {
                                            type: 'setKeyValue',
                                            properties: {
                                                name: '={{$responseItem.id}}',
                                                value: '={{$responseItem.id}}',
                                            },
                                        },
                                        {
                                            type: 'sort',
                                            properties: {
                                                key: 'name',
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    routing: {
                        send: {
                            type: 'body',
                            property: 'model',
                        },
                    },
                    default: 'THUDM/glm-4-plus',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    placeholder: 'Add Option',
                    description: 'Additional options to add',
                    type: 'collection',
                    default: {},
                    options: [
                        {
                            displayName: 'Frequency Penalty',
                            name: 'frequencyPenalty',
                            default: 0.5,
                            typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                            description: "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim",
                            type: 'number',
                        },
                        {
                            displayName: 'Maximum Number of Tokens',
                            name: 'maxTokens',
                            default: -1,
                            description: 'The maximum number of tokens to generate in the completion.',
                            type: 'number',
                            typeOptions: {
                                maxValue: 32768,
                                minValue: -1,
                            },
                        },
                        {
                            displayName: 'Presence Penalty',
                            name: 'presencePenalty',
                            default: 0,
                            typeOptions: { maxValue: 2, minValue: -2, numberPrecision: 1 },
                            description: "Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics",
                            type: 'number',
                        },
                        {
                            displayName: 'Sampling Temperature',
                            name: 'temperature',
                            default: 0.7,
                            typeOptions: { maxValue: 2, minValue: 0, numberPrecision: 1 },
                            description: 'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
                            type: 'number',
                        },
                        {
                            displayName: 'Timeout',
                            name: 'timeout',
                            default: 60000,
                            description: 'Maximum amount of time a request is allowed to take in milliseconds',
                            type: 'number',
                        },
                        {
                            displayName: 'Max Retries',
                            name: 'maxRetries',
                            default: 2,
                            description: 'Maximum number of retries to attempt',
                            type: 'number',
                        },
                        {
                            displayName: 'Top P',
                            name: 'topP',
                            default: 1,
                            typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 1 },
                            description: 'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered. We generally recommend altering this or temperature but not both.',
                            type: 'number',
                        },
                        {
                            displayName: 'Min P',
                            name: 'minP',
                            default: 0.05,
                            typeOptions: { maxValue: 1, minValue: 0, numberPrecision: 3 },
                            description: 'Dynamic filtering threshold that adapts based on token probabilities. Only applies to Qwen3 models.',
                            type: 'number',
                        },
                        {
                            displayName: 'Top K',
                            name: 'topK',
                            default: 50,
                            typeOptions: { maxValue: 100, minValue: 1 },
                            description: 'Limits the number of tokens to consider for each step.',
                            type: 'number',
                        },
                        {
                            displayName: 'Number of Generations',
                            name: 'n',
                            default: 1,
                            typeOptions: { maxValue: 10, minValue: 1 },
                            description: 'Number of generations to return.',
                            type: 'number',
                        },
                        {
                            displayName: 'Stop Sequences',
                            name: 'stop',
                            default: [],
                            description: 'Up to 4 sequences where the API will stop generating further tokens.',
                            type: 'fixedCollection',
                            typeOptions: {
                                multipleValues: true,
                                maxValue: 4,
                            },
                            options: [
                                {
                                    name: 'values',
                                    displayName: 'Stop Sequence',
                                    values: [
                                        {
                                            displayName: 'Stop Sequence',
                                            name: 'sequence',
                                            type: 'string',
                                            default: '',
                                            placeholder: 'Enter stop sequence',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            displayName: 'Enable Thinking (推理模型)',
                            name: 'enableThinking',
                            default: false,
                            description: 'Enable chain-of-thought reasoning for supported models',
                            type: 'boolean',
                        },
                        {
                            displayName: 'Thinking Budget',
                            name: 'thinkingBudget',
                            default: 4096,
                            typeOptions: { maxValue: 32768, minValue: 128 },
                            description: 'Maximum tokens for reasoning process',
                            type: 'number',
                            displayOptions: {
                                show: {
                                    enableThinking: [true],
                                },
                            },
                        },
                    ],
                },
            ],
        };
    }
    async supplyData(itemIndex) {
        var _a, _b, _c, _d, _e, _f;
        const credentials = await this.getCredentials('siliconFlowApi');
        const modelName = this.getNodeParameter('model', itemIndex);
        const options = this.getNodeParameter('options', itemIndex, {});
        const configuration = {
            baseURL: credentials.baseUrl,
            apiKey: credentials.apiKey,
        };
        // Prepare model kwargs for SiliconFlow specific features
        const modelKwargs = {};
        // Add reasoning parameters for reasoning models
        if (options.enableThinking && (modelName.includes('QwQ') || modelName.includes('R1'))) {
            modelKwargs.enable_thinking = true;
            modelKwargs.thinking_budget = options.thinkingBudget || 4096;
        }
        // Add SiliconFlow specific parameters
        if (options.topK !== undefined) {
            modelKwargs.top_k = options.topK;
        }
        if (options.minP !== undefined && modelName.includes('Qwen3')) {
            modelKwargs.min_p = options.minP;
        }
        if (options.n !== undefined && options.n > 1) {
            modelKwargs.n = options.n;
        }
        // Process stop sequences
        let stopSequences;
        if (options.stop && options.stop.length > 0) {
            stopSequences = options.stop
                .flatMap((item) => { var _a; return (_a = item.values) === null || _a === void 0 ? void 0 : _a.map((v) => v.sequence); })
                .filter((seq) => seq && seq.trim().length > 0);
        }
        const model = new openai_1.ChatOpenAI({
            apiKey: credentials.apiKey,
            openAIApiKey: credentials.apiKey,
            model: modelName,
            maxTokens: options.maxTokens || -1,
            temperature: (_a = options.temperature) !== null && _a !== void 0 ? _a : 0.7,
            topP: (_b = options.topP) !== null && _b !== void 0 ? _b : 1,
            frequencyPenalty: (_c = options.frequencyPenalty) !== null && _c !== void 0 ? _c : 0.5,
            presencePenalty: (_d = options.presencePenalty) !== null && _d !== void 0 ? _d : 0,
            timeout: (_e = options.timeout) !== null && _e !== void 0 ? _e : 60000,
            maxRetries: (_f = options.maxRetries) !== null && _f !== void 0 ? _f : 2,
            stop: stopSequences,
            configuration,
            modelKwargs: Object.keys(modelKwargs).length > 0 ? modelKwargs : undefined,
        });
        return {
            response: model,
        };
    }
}
exports.SiliconFlowChatModel = SiliconFlowChatModel;
