#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { GraphqlCdkStack } from '../lib/graphql-cdk-stack';

const app = new cdk.App();
new GraphqlCdkStack(app, 'GraphqlCdkStack', {
    stackName: "graphql-cdk-tko"
});
