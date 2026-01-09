"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiliconFlow = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const axios_1 = __importDefault(require("axios"));
class SiliconFlow {
    constructor() {
        this.description = {
            displayName: 'SiliconFlow',
            name: 'siliconFlow',
            icon: 'file:siliconflow.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with SiliconFlow AI models',
            defaults: {
                name: 'SiliconFlow',
            },
            inputs: ["main" /* NodeConnectionType.Main */],
            outputs: ["main" /* NodeConnectionType.Main */],
            credentials: [
                {
                    name: 'siliconFlowApi',
                    required: true,
                },
            ],
            requestDefaults: {
                baseURL: '={{$credentials.baseUrl}}',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Chat',
                            value: 'chat',
                        },
                        {
                            name: 'Vision',
                            value: 'vision',
                            description: 'Vision language model with image understanding',
                        },
                        {
                            name: 'Embeddings',
                            value: 'embeddings',
                        },
                        {
                            name: 'Rerank',
                            value: 'rerank',
                        },
                    ],
                    default: 'chat',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                        },
                    },
                    options: [
                        {
                            name: 'Complete',
                            value: 'complete',
                            description: 'Create a chat completion',
                            action: 'Create a chat completion',
                        },
                    ],
                    default: 'complete',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['vision'],
                        },
                    },
                    options: [
                        {
                            name: 'Analyze',
                            value: 'analyze',
                            description: 'Analyze images with vision language model',
                            action: 'Analyze images with vision language model',
                        },
                    ],
                    default: 'analyze',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['embeddings'],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create embeddings',
                            action: 'Create embeddings',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['rerank'],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create rerank request',
                            action: 'Create rerank request',
                        },
                    ],
                    default: 'create',
                },
                // Chat completion options
                {
                    displayName: 'Model',
                    name: 'model',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                            operation: ['complete'],
                        },
                    },
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
                    default: 'THUDM/glm-4-plus',
                    required: true,
                },
                {
                    displayName: 'Messages',
                    name: 'messages',
                    type: 'fixedCollection',
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                            operation: ['complete'],
                        },
                    },
                    default: {},
                    typeOptions: {
                        multipleValues: true,
                    },
                    options: [
                        {
                            name: 'messageValues',
                            displayName: 'Message',
                            values: [
                                {
                                    displayName: 'Role',
                                    name: 'role',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'System',
                                            value: 'system',
                                        },
                                        {
                                            name: 'User',
                                            value: 'user',
                                        },
                                        {
                                            name: 'Assistant',
                                            value: 'assistant',
                                        },
                                    ],
                                    default: 'user',
                                },
                                {
                                    displayName: 'Content',
                                    name: 'content',
                                    type: 'string',
                                    default: '',
                                    typeOptions: {
                                        rows: 3,
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Prompt',
                    name: 'prompt',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                            operation: ['complete'],
                        },
                    },
                    default: '',
                    description: 'Simple prompt text (alternative to messages)',
                    typeOptions: {
                        rows: 3,
                    },
                },
                {
                    displayName: 'Output Mode',
                    name: 'outputMode',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                            operation: ['complete'],
                        },
                    },
                    options: [
                        {
                            name: 'Simple (Message Only)',
                            value: 'simple',
                            description: 'Return only the message content as a string',
                        },
                        {
                            name: 'Detailed (With Metadata)',
                            value: 'detailed',
                            description: 'Return structured object with message, usage, and metadata',
                        },
                    ],
                    default: 'simple',
                    description: 'Choose the output format',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['chat'],
                            operation: ['complete'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Max Tokens',
                            name: 'max_tokens',
                            type: 'number',
                            default: 512,
                            typeOptions: {
                                minValue: 1,
                                maxValue: 16384,
                            },
                            description: 'The maximum number of tokens to generate (1-16384)',
                        },
                        {
                            displayName: 'Temperature',
                            name: 'temperature',
                            type: 'number',
                            default: 0.7,
                            typeOptions: {
                                minValue: 0,
                                maxValue: 2,
                                numberPrecision: 2,
                            },
                            description: 'Determines the degree of randomness in the response',
                        },
                        {
                            displayName: 'Top P',
                            name: 'top_p',
                            type: 'number',
                            default: 0.7,
                            typeOptions: {
                                minValue: 0,
                                maxValue: 1,
                                numberPrecision: 2,
                            },
                            description: 'The top_p (nucleus) parameter for dynamic choice adjustment',
                        },
                        {
                            displayName: 'Top K',
                            name: 'top_k',
                            type: 'number',
                            default: 50,
                            description: 'Top-k sampling parameter',
                        },
                        {
                            displayName: 'Min P',
                            name: 'min_p',
                            type: 'number',
                            default: 0.05,
                            typeOptions: {
                                minValue: 0,
                                maxValue: 1,
                                numberPrecision: 3,
                            },
                            description: 'Dynamic filtering threshold for Qwen3 models (0-1)',
                        },
                        {
                            displayName: 'Frequency Penalty',
                            name: 'frequency_penalty',
                            type: 'number',
                            default: 0.5,
                            typeOptions: {
                                numberPrecision: 2,
                            },
                            description: 'Frequency penalty parameter',
                        },
                        {
                            displayName: 'Number of Generations',
                            name: 'n',
                            type: 'number',
                            default: 1,
                            description: 'Number of generations to return',
                        },
                        {
                            displayName: 'Enable Thinking',
                            name: 'enable_thinking',
                            type: 'boolean',
                            default: true,
                            description: 'Switches between thinking and non-thinking modes (applies to Qwen3 and Hunyuan models)',
                        },
                        {
                            displayName: 'Thinking Budget',
                            name: 'thinking_budget',
                            type: 'number',
                            default: 4096,
                            typeOptions: {
                                minValue: 128,
                                maxValue: 32768,
                            },
                            description: 'Maximum tokens for chain-of-thought output (128-32768, applies to reasoning models)',
                        },
                        {
                            displayName: 'Stop Sequences',
                            name: 'stop',
                            type: 'string',
                            default: '',
                            description: 'Up to 4 sequences where the API will stop generating (comma-separated)',
                        },
                        {
                            displayName: 'Stream',
                            name: 'stream',
                            type: 'boolean',
                            default: true,
                            description: 'Whether to stream back partial progress as Server-Sent Events',
                        },
                        {
                            displayName: 'Response Format',
                            name: 'response_format',
                            type: 'fixedCollection',
                            default: {},
                            description: 'Format specification for the model output',
                            options: [
                                {
                                    name: 'formatValues',
                                    displayName: 'Format',
                                    values: [
                                        {
                                            displayName: 'Type',
                                            name: 'type',
                                            type: 'options',
                                            options: [
                                                {
                                                    name: 'Text',
                                                    value: 'text',
                                                },
                                                {
                                                    name: 'JSON Object',
                                                    value: 'json_object',
                                                },
                                            ],
                                            default: 'text',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                // Vision options
                {
                    displayName: 'Model',
                    name: 'visionModel',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['vision'],
                            operation: ['analyze'],
                        },
                    },
                    options: [
                        // Qwen VL 系列
                        {
                            name: 'Qwen2.5-VL-72B-Instruct (最强视觉理解)',
                            value: 'Qwen/Qwen2.5-VL-72B-Instruct',
                        },
                        {
                            name: 'Qwen2.5-VL-32B-Instruct (高性能)',
                            value: 'Qwen/Qwen2.5-VL-32B-Instruct',
                        },
                        {
                            name: 'QVQ-72B-Preview (视觉推理)',
                            value: 'Qwen/QVQ-72B-Preview',
                        },
                        {
                            name: 'Qwen2-VL-72B-Instruct',
                            value: 'Qwen/Qwen2-VL-72B-Instruct',
                        },
                        {
                            name: 'Qwen2-VL-7B-Instruct (Pro)',
                            value: 'Pro/Qwen/Qwen2-VL-7B-Instruct',
                        },
                        {
                            name: 'Qwen2.5-VL-7B-Instruct (Pro)',
                            value: 'Pro/Qwen/Qwen2.5-VL-7B-Instruct',
                        },
                        // DeepSeek VL2 系列
                        {
                            name: 'DeepSeek-VL2 (短上下文优化)',
                            value: 'deepseek-ai/deepseek-vl2',
                        },
                    ],
                    default: 'Qwen/Qwen2.5-VL-32B-Instruct',
                    required: true,
                    description: 'The vision language model to use for image analysis',
                },
                {
                    displayName: 'Images',
                    name: 'images',
                    type: 'fixedCollection',
                    displayOptions: {
                        show: {
                            resource: ['vision'],
                            operation: ['analyze'],
                        },
                    },
                    default: {},
                    description: 'Images to analyze (supports binary data, URLs, or base64)',
                    typeOptions: {
                        multipleValues: true,
                        maxValue: 9,
                    },
                    options: [
                        {
                            name: 'imageValues',
                            displayName: 'Image',
                            values: [
                                {
                                    displayName: 'Image Source',
                                    name: 'imageSource',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Binary Data',
                                            value: 'binary',
                                            description: 'Use binary data from previous node',
                                        },
                                        {
                                            name: 'URL',
                                            value: 'url',
                                            description: 'Use image URL',
                                        },
                                        {
                                            name: 'Base64',
                                            value: 'base64',
                                            description: 'Use base64 encoded image',
                                        },
                                    ],
                                    default: 'binary',
                                },
                                {
                                    displayName: 'Binary Property',
                                    name: 'binaryProperty',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            imageSource: ['binary'],
                                        },
                                    },
                                    default: 'data',
                                    description: 'Name of the binary property containing the image',
                                },
                                {
                                    displayName: 'Image URL',
                                    name: 'imageUrl',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            imageSource: ['url'],
                                        },
                                    },
                                    default: '',
                                    placeholder: 'https://example.com/image.jpg',
                                    description: 'URL of the image to analyze',
                                },
                                {
                                    displayName: 'Base64 Data',
                                    name: 'base64Data',
                                    type: 'string',
                                    displayOptions: {
                                        show: {
                                            imageSource: ['base64'],
                                        },
                                    },
                                    default: '',
                                    description: 'Base64 encoded image data (without data:image prefix)',
                                    typeOptions: {
                                        rows: 4,
                                    },
                                },
                                {
                                    displayName: 'Image Format',
                                    name: 'imageFormat',
                                    type: 'options',
                                    displayOptions: {
                                        show: {
                                            imageSource: ['binary', 'base64'],
                                        },
                                    },
                                    options: [
                                        {
                                            name: 'Auto Detect',
                                            value: 'auto',
                                        },
                                        {
                                            name: 'JPEG',
                                            value: 'jpeg',
                                        },
                                        {
                                            name: 'PNG',
                                            value: 'png',
                                        },
                                        {
                                            name: 'WebP',
                                            value: 'webp',
                                        },
                                        {
                                            name: 'GIF',
                                            value: 'gif',
                                        },
                                    ],
                                    default: 'auto',
                                    description: 'Format of the image data',
                                },
                                {
                                    displayName: 'Detail Level',
                                    name: 'detail',
                                    type: 'options',
                                    options: [
                                        {
                                            name: 'Auto',
                                            value: 'auto',
                                            description: 'Automatic detail level selection',
                                        },
                                        {
                                            name: 'Low',
                                            value: 'low',
                                            description: 'Low resolution (faster, cheaper)',
                                        },
                                        {
                                            name: 'High',
                                            value: 'high',
                                            description: 'High resolution (slower, more detailed)',
                                        },
                                    ],
                                    default: 'auto',
                                    description: 'Level of detail for image processing',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Prompt',
                    name: 'visionPrompt',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['vision'],
                            operation: ['analyze'],
                        },
                    },
                    default: 'Describe what you see in this image.',
                    required: true,
                    description: 'Text prompt describing what you want to know about the image(s)',
                    typeOptions: {
                        rows: 3,
                    },
                },
                {
                    displayName: 'Additional Fields',
                    name: 'visionAdditionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['vision'],
                            operation: ['analyze'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Max Tokens',
                            name: 'max_tokens',
                            type: 'number',
                            default: 1024,
                            typeOptions: {
                                minValue: 1,
                                maxValue: 8192,
                            },
                            description: 'Maximum number of tokens to generate',
                        },
                        {
                            displayName: 'Temperature',
                            name: 'temperature',
                            type: 'number',
                            default: 0.7,
                            typeOptions: {
                                minValue: 0,
                                maxValue: 2,
                                numberPrecision: 2,
                            },
                            description: 'Controls randomness in the response',
                        },
                        {
                            displayName: 'Top P',
                            name: 'top_p',
                            type: 'number',
                            default: 1,
                            typeOptions: {
                                minValue: 0,
                                maxValue: 1,
                                numberPrecision: 2,
                            },
                            description: 'Controls diversity via nucleus sampling',
                        },
                        {
                            displayName: 'Stream',
                            name: 'stream',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to stream the response',
                        },
                    ],
                },
                // Embeddings options
                {
                    displayName: 'Model',
                    name: 'embeddingModel',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['embeddings'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        // BGE系列
                        {
                            name: 'BAAI/bge-large-zh-v1.5 (中文, 512 tokens)',
                            value: 'BAAI/bge-large-zh-v1.5',
                        },
                        {
                            name: 'BAAI/bge-large-en-v1.5 (英文, 512 tokens)',
                            value: 'BAAI/bge-large-en-v1.5',
                        },
                        {
                            name: 'BAAI/bge-m3 (多语言, 8192 tokens)',
                            value: 'BAAI/bge-m3',
                        },
                        {
                            name: 'Pro/BAAI/bge-m3 (多语言专业版, 8192 tokens)',
                            value: 'Pro/BAAI/bge-m3',
                        },
                        // Qwen嵌入系列
                        {
                            name: 'Qwen3-Embedding-8B (32768 tokens)',
                            value: 'Qwen/Qwen3-Embedding-8B',
                        },
                        {
                            name: 'Qwen3-Embedding-4B (32768 tokens)',
                            value: 'Qwen/Qwen3-Embedding-4B',
                        },
                        {
                            name: 'Qwen3-Embedding-0.6B (32768 tokens)',
                            value: 'Qwen/Qwen3-Embedding-0.6B',
                        },
                        // 网易有道
                        {
                            name: 'netease-youdao/bce-embedding-base_v1 (512 tokens)',
                            value: 'netease-youdao/bce-embedding-base_v1',
                        },
                        // 保留原有的sentence-transformers模型
                        {
                            name: 'sentence-transformers/all-MiniLM-L6-v2',
                            value: 'sentence-transformers/all-MiniLM-L6-v2',
                        },
                    ],
                    default: 'BAAI/bge-large-zh-v1.5',
                    required: true,
                    description: 'The model to use for embeddings',
                },
                {
                    displayName: 'Input',
                    name: 'input',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['embeddings'],
                            operation: ['create'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Input text to embed',
                    typeOptions: {
                        rows: 3,
                    },
                },
                {
                    displayName: 'Additional Fields',
                    name: 'embeddingAdditionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['embeddings'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Encoding Format',
                            name: 'encoding_format',
                            type: 'options',
                            options: [
                                {
                                    name: 'Float',
                                    value: 'float',
                                },
                                {
                                    name: 'Base64',
                                    value: 'base64',
                                },
                            ],
                            default: 'float',
                            description: 'The format to return the embeddings in',
                        },
                    ],
                },
                // Rerank options
                {
                    displayName: 'Model',
                    name: 'rerankModel',
                    type: 'options',
                    displayOptions: {
                        show: {
                            resource: ['rerank'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        // Qwen重排序系列
                        {
                            name: 'Qwen3-Reranker-8B',
                            value: 'Qwen/Qwen3-Reranker-8B',
                        },
                        {
                            name: 'Qwen3-Reranker-4B',
                            value: 'Qwen/Qwen3-Reranker-4B',
                        },
                        {
                            name: 'Qwen3-Reranker-0.6B',
                            value: 'Qwen/Qwen3-Reranker-0.6B',
                        },
                        // BAAI BGE重排序系列
                        {
                            name: 'BAAI/bge-reranker-v2-m3',
                            value: 'BAAI/bge-reranker-v2-m3',
                        },
                        {
                            name: 'Pro/BAAI/bge-reranker-v2-m3 (专业版)',
                            value: 'Pro/BAAI/bge-reranker-v2-m3',
                        },
                        // 网易有道
                        {
                            name: 'netease-youdao/bce-reranker-base_v1',
                            value: 'netease-youdao/bce-reranker-base_v1',
                        },
                    ],
                    default: 'BAAI/bge-reranker-v2-m3',
                    required: true,
                    description: 'The model to use for reranking',
                },
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['rerank'],
                            operation: ['create'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The search query',
                    typeOptions: {
                        rows: 2,
                    },
                },
                {
                    displayName: 'Documents',
                    name: 'documents',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: ['rerank'],
                            operation: ['create'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Documents to rerank (one per line or comma-separated)',
                    typeOptions: {
                        rows: 5,
                    },
                },
                {
                    displayName: 'Additional Fields',
                    name: 'rerankAdditionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: ['rerank'],
                            operation: ['create'],
                        },
                    },
                    options: [
                        {
                            displayName: 'Top N',
                            name: 'top_n',
                            type: 'number',
                            default: 4,
                            typeOptions: {
                                minValue: 1,
                            },
                            description: 'Number of most relevant documents to return',
                        },
                        {
                            displayName: 'Return Documents',
                            name: 'return_documents',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include document text in the response',
                        },
                        {
                            displayName: 'Max Chunks Per Doc',
                            name: 'max_chunks_per_doc',
                            type: 'number',
                            default: 10,
                            description: 'Maximum chunks for long documents (BGE/YoudAo models only)',
                        },
                        {
                            displayName: 'Overlap Tokens',
                            name: 'overlap_tokens',
                            type: 'number',
                            default: 20,
                            typeOptions: {
                                maxValue: 80,
                            },
                            description: 'Token overlaps between chunks (BGE/YoudAo models only, max 80)',
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const items = this.getInputData();
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);
        const credentials = await this.getCredentials('siliconFlowApi');
        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'chat' && operation === 'complete') {
                    const model = this.getNodeParameter('model', i);
                    const prompt = this.getNodeParameter('prompt', i);
                    const messagesParam = this.getNodeParameter('messages', i);
                    const additionalFields = this.getNodeParameter('additionalFields', i);
                    let messages = [];
                    // Use messages if provided, otherwise use simple prompt
                    if ((messagesParam === null || messagesParam === void 0 ? void 0 : messagesParam.messageValues) && messagesParam.messageValues.length > 0) {
                        messages = messagesParam.messageValues;
                    }
                    else if (prompt) {
                        messages = [{ role: 'user', content: prompt }];
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Either messages or prompt must be provided');
                    }
                    const requestBody = {
                        model,
                        messages,
                    };
                    // Add optional parameters from additionalFields
                    if (additionalFields.max_tokens !== undefined) {
                        requestBody.max_tokens = additionalFields.max_tokens;
                    }
                    if (additionalFields.temperature !== undefined) {
                        requestBody.temperature = additionalFields.temperature;
                    }
                    if (additionalFields.top_p !== undefined) {
                        requestBody.top_p = additionalFields.top_p;
                    }
                    if (additionalFields.top_k !== undefined) {
                        requestBody.top_k = additionalFields.top_k;
                    }
                    if (additionalFields.min_p !== undefined) {
                        requestBody.min_p = additionalFields.min_p;
                    }
                    if (additionalFields.frequency_penalty !== undefined) {
                        requestBody.frequency_penalty = additionalFields.frequency_penalty;
                    }
                    if (additionalFields.n !== undefined) {
                        requestBody.n = additionalFields.n;
                    }
                    if (additionalFields.enable_thinking !== undefined) {
                        requestBody.enable_thinking = additionalFields.enable_thinking;
                    }
                    if (additionalFields.thinking_budget !== undefined) {
                        requestBody.thinking_budget = additionalFields.thinking_budget;
                    }
                    if (additionalFields.stream !== undefined) {
                        requestBody.stream = additionalFields.stream;
                    }
                    if (additionalFields.stop && additionalFields.stop.trim()) {
                        // Convert comma-separated string to array
                        requestBody.stop = additionalFields.stop
                            .split(',')
                            .map((s) => s.trim())
                            .filter((s) => s);
                    }
                    if (additionalFields.response_format && additionalFields.response_format.formatValues) {
                        requestBody.response_format = {
                            type: additionalFields.response_format.formatValues.type,
                        };
                    }
                    const response = await axios_1.default.post(`${credentials.baseUrl}/chat/completions`, requestBody, {
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    // Extract and format the response data
                    const responseData = response.data;
                    const choice = (_a = responseData.choices) === null || _a === void 0 ? void 0 : _a[0];
                    if (!choice) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response received from the model');
                    }
                    // Check if user wants simple output (just the message content)
                    const outputMode = this.getNodeParameter('outputMode', i, 'simple');
                    let outputData;
                    if (outputMode === 'simple') {
                        // Simple output - just the message content for easy use in workflows
                        outputData = ((_b = choice.message) === null || _b === void 0 ? void 0 : _b.content) || '';
                    }
                    else {
                        // Detailed output - structured data with metadata
                        outputData = {
                            // Main content - what users typically want
                            message: ((_c = choice.message) === null || _c === void 0 ? void 0 : _c.content) || '',
                            // Additional useful information
                            model: responseData.model,
                            finishReason: choice.finish_reason,
                            // Usage statistics
                            usage: responseData.usage,
                            // Include reasoning content if available (for reasoning models)
                            ...(((_d = choice.message) === null || _d === void 0 ? void 0 : _d.reasoning_content) && {
                                reasoning: choice.message.reasoning_content,
                            }),
                            // Include tool calls if any
                            ...(((_e = choice.message) === null || _e === void 0 ? void 0 : _e.tool_calls) && {
                                toolCalls: choice.message.tool_calls,
                            }),
                            // Raw response for advanced users (can be hidden in UI)
                            _rawResponse: responseData,
                        };
                    }
                    returnData.push({
                        json: outputData,
                        pairedItem: { item: i },
                    });
                }
                else if (resource === 'vision' && operation === 'analyze') {
                    const model = this.getNodeParameter('visionModel', i);
                    const prompt = this.getNodeParameter('visionPrompt', i);
                    const imagesParam = this.getNodeParameter('images', i);
                    const additionalFields = this.getNodeParameter('visionAdditionalFields', i);
                    // Build content array for the message
                    const content = [];
                    // Process images first
                    if ((imagesParam === null || imagesParam === void 0 ? void 0 : imagesParam.imageValues) && imagesParam.imageValues.length > 0) {
                        for (const imageConfig of imagesParam.imageValues) {
                            const { imageSource, detail = 'auto' } = imageConfig;
                            let imageUrl = '';
                            if (imageSource === 'url') {
                                imageUrl = imageConfig.imageUrl;
                                if (!imageUrl) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Image URL is required when using URL source');
                                }
                            }
                            else if (imageSource === 'base64') {
                                const base64Data = imageConfig.base64Data;
                                const imageFormat = imageConfig.imageFormat || 'auto';
                                if (!base64Data) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Base64 data is required when using base64 source');
                                }
                                // Clean base64 data (remove whitespace and data URL prefix if present)
                                let cleanedBase64 = base64Data.trim();
                                // Remove data URL prefix if present
                                if (cleanedBase64.startsWith('data:')) {
                                    const base64Index = cleanedBase64.indexOf('base64,');
                                    if (base64Index !== -1) {
                                        cleanedBase64 = cleanedBase64.substring(base64Index + 7);
                                    }
                                }
                                // Remove any remaining whitespace
                                cleanedBase64 = cleanedBase64.replace(/\s/g, '');
                                // Validate base64 format
                                if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanedBase64)) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid base64 data format');
                                }
                                // Determine MIME type
                                let mimeType = 'image/jpeg'; // default
                                if (imageFormat === 'png')
                                    mimeType = 'image/png';
                                else if (imageFormat === 'webp')
                                    mimeType = 'image/webp';
                                else if (imageFormat === 'gif')
                                    mimeType = 'image/gif';
                                else if (imageFormat === 'jpeg')
                                    mimeType = 'image/jpeg';
                                imageUrl = `data:${mimeType};base64,${cleanedBase64}`;
                            }
                            else if (imageSource === 'binary') {
                                const binaryProperty = imageConfig.binaryProperty || 'data';
                                const binaryData = (_f = items[i].binary) === null || _f === void 0 ? void 0 : _f[binaryProperty];
                                if (!binaryData) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data found in property "${binaryProperty}". Available properties: ${Object.keys(items[i].binary || {}).join(', ')}`);
                                }
                                // Convert binary data to base64
                                const imageFormat = imageConfig.imageFormat || 'auto';
                                let mimeType = binaryData.mimeType || 'image/jpeg';
                                // Normalize MIME type
                                if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
                                    mimeType = 'image/jpeg';
                                }
                                else if (mimeType.includes('png')) {
                                    mimeType = 'image/png';
                                }
                                else if (mimeType.includes('webp')) {
                                    mimeType = 'image/webp';
                                }
                                else if (mimeType.includes('gif')) {
                                    mimeType = 'image/gif';
                                }
                                else {
                                    // Default to jpeg for unknown types
                                    mimeType = 'image/jpeg';
                                }
                                // Override mime type if format is specified
                                if (imageFormat !== 'auto') {
                                    mimeType = `image/${imageFormat}`;
                                }
                                // Get base64 data from binary
                                let base64Data = '';
                                if (binaryData.data) {
                                    // Data is already base64, ensure it's clean
                                    base64Data = binaryData.data.replace(/\s/g, ''); // Remove any whitespace
                                    // Validate base64 format
                                    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
                                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Invalid base64 data format in binary property');
                                    }
                                }
                                else {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Binary data does not contain valid image data');
                                }
                                imageUrl = `data:${mimeType};base64,${base64Data}`;
                            }
                            // Add image to content
                            const imageContent = {
                                type: 'image_url',
                                image_url: {
                                    url: imageUrl,
                                },
                            };
                            // Add detail parameter if specified (only for high/low, not auto)
                            if (detail === 'high' || detail === 'low') {
                                imageContent.image_url.detail = detail;
                            }
                            content.push(imageContent);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one image must be provided for vision analysis');
                    }
                    // Add text prompt to content (after images for better results with InternVL models)
                    content.push({
                        type: 'text',
                        text: prompt,
                    });
                    // Build the request body
                    const requestBody = {
                        model,
                        messages: [
                            {
                                role: 'user',
                                content,
                            },
                        ],
                    };
                    // Add optional parameters from additionalFields
                    if (additionalFields.max_tokens !== undefined) {
                        requestBody.max_tokens = additionalFields.max_tokens;
                    }
                    if (additionalFields.temperature !== undefined) {
                        requestBody.temperature = additionalFields.temperature;
                    }
                    if (additionalFields.top_p !== undefined) {
                        requestBody.top_p = additionalFields.top_p;
                    }
                    if (additionalFields.stream !== undefined) {
                        requestBody.stream = additionalFields.stream;
                    }
                    try {
                        // Validate the request before sending
                        const imageContents = content.filter((c) => c.type === 'image_url');
                        if (imageContents.length === 0) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No valid images found in the request content');
                        }
                        // Validate each image URL
                        for (let idx = 0; idx < imageContents.length; idx++) {
                            const imgContent = imageContents[idx];
                            const url = (_g = imgContent.image_url) === null || _g === void 0 ? void 0 : _g.url;
                            if (!url) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Image ${idx + 1} has no URL`);
                            }
                            // Check if it's a data URL with proper format
                            if (url.startsWith('data:')) {
                                if (!url.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/]+=*$/)) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Image ${idx + 1} has invalid data URL format. Expected: data:image/TYPE;base64,BASE64_DATA`);
                                }
                            }
                        }
                        // Make the API request
                        const response = await axios_1.default.post(`${credentials.baseUrl}/chat/completions`, requestBody, {
                            headers: {
                                Authorization: `Bearer ${credentials.apiKey}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        // Extract and format the response data
                        const responseData = response.data;
                        const choice = (_h = responseData.choices) === null || _h === void 0 ? void 0 : _h[0];
                        if (!choice) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No response received from the vision model');
                        }
                        // Prepare output data
                        const outputData = {
                            // Main content - the vision analysis result
                            analysis: ((_j = choice.message) === null || _j === void 0 ? void 0 : _j.content) || '',
                            // Model information
                            model: responseData.model,
                            finishReason: choice.finish_reason,
                            // Usage statistics
                            usage: responseData.usage,
                            // Input information for reference
                            imageCount: ((_k = imagesParam === null || imagesParam === void 0 ? void 0 : imagesParam.imageValues) === null || _k === void 0 ? void 0 : _k.length) || 0,
                            prompt: prompt,
                            // Raw response for advanced users
                            _rawResponse: responseData,
                        };
                        returnData.push({
                            json: outputData,
                            pairedItem: { item: i },
                        });
                    }
                    catch (error) {
                        // Enhanced error handling for vision requests
                        let errorMessage = 'Vision analysis failed';
                        if ((_l = error.response) === null || _l === void 0 ? void 0 : _l.data) {
                            const errorData = error.response.data;
                            if ((_m = errorData.error) === null || _m === void 0 ? void 0 : _m.message) {
                                errorMessage = `Vision API Error: ${errorData.error.message}`;
                            }
                            else if (errorData.message) {
                                errorMessage = `Vision API Error: ${errorData.message}`;
                            }
                            else {
                                errorMessage = `Vision API Error: ${JSON.stringify(errorData)}`;
                            }
                        }
                        else if (error.message) {
                            errorMessage = `Vision Request Error: ${error.message}`;
                        }
                        // Add request details for debugging
                        errorMessage += `\nRequest details: Model=${model}, Images=${content.filter((c) => c.type === 'image_url').length}, ContentSize=${JSON.stringify(requestBody).length} chars`;
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), errorMessage);
                    }
                }
                else if (resource === 'embeddings' && operation === 'create') {
                    const model = this.getNodeParameter('embeddingModel', i);
                    const input = this.getNodeParameter('input', i);
                    const additionalFields = this.getNodeParameter('embeddingAdditionalFields', i);
                    const requestBody = {
                        model,
                        input,
                    };
                    // Add optional parameters from additionalFields
                    if (additionalFields.encoding_format !== undefined) {
                        requestBody.encoding_format = additionalFields.encoding_format;
                    }
                    const response = await axios_1.default.post(`${credentials.baseUrl}/embeddings`, requestBody, {
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    // Extract and format the embedding response
                    const responseData = response.data;
                    const outputData = {
                        // Main embedding data
                        embeddings: ((_o = responseData.data) === null || _o === void 0 ? void 0 : _o.map((item) => item.embedding)) || [],
                        // Metadata
                        model: responseData.model,
                        usage: responseData.usage,
                        // Raw response for advanced users
                        _rawResponse: responseData,
                    };
                    returnData.push({
                        json: outputData,
                        pairedItem: { item: i },
                    });
                }
                else if (resource === 'rerank' && operation === 'create') {
                    const model = this.getNodeParameter('rerankModel', i);
                    const query = this.getNodeParameter('query', i);
                    const documentsParam = this.getNodeParameter('documents', i);
                    const additionalFields = this.getNodeParameter('rerankAdditionalFields', i);
                    // Parse documents - support both newline and comma-separated formats
                    let documents = [];
                    if (documentsParam.includes('\n')) {
                        documents = documentsParam
                            .split('\n')
                            .map((doc) => doc.trim())
                            .filter((doc) => doc);
                    }
                    else {
                        documents = documentsParam
                            .split(',')
                            .map((doc) => doc.trim())
                            .filter((doc) => doc);
                    }
                    if (documents.length === 0) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least one document must be provided');
                    }
                    const requestBody = {
                        model,
                        query,
                        documents,
                    };
                    // Add optional parameters from additionalFields
                    if (additionalFields.top_n !== undefined) {
                        requestBody.top_n = additionalFields.top_n;
                    }
                    if (additionalFields.return_documents !== undefined) {
                        requestBody.return_documents = additionalFields.return_documents;
                    }
                    if (additionalFields.max_chunks_per_doc !== undefined) {
                        requestBody.max_chunks_per_doc = additionalFields.max_chunks_per_doc;
                    }
                    if (additionalFields.overlap_tokens !== undefined) {
                        requestBody.overlap_tokens = additionalFields.overlap_tokens;
                    }
                    const response = await axios_1.default.post(`${credentials.baseUrl}/rerank`, requestBody, {
                        headers: {
                            Authorization: `Bearer ${credentials.apiKey}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    // Extract and format the rerank response
                    const responseData = response.data;
                    const outputData = {
                        // Main results - sorted by relevance
                        results: responseData.results || [],
                        // Metadata
                        query: query,
                        documentsCount: documents.length,
                        // Usage information
                        usage: responseData.tokens,
                        // Raw response for advanced users
                        _rawResponse: responseData,
                    };
                    returnData.push({
                        json: outputData,
                        pairedItem: { item: i },
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                    returnData.push({
                        json: { error: errorMessage },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.SiliconFlow = SiliconFlow;
