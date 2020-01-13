import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
export declare class CdkServerlessApiStack extends cdk.Stack {
    constructor(app: cdk.App, id: string);
}
export declare function addCorsOptions(apiResource: apigateway.IResource): void;
