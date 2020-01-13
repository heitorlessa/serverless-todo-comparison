#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkServerlessApiStack } from '../lib/cdk-serverless-api-stack';

const app = new cdk.App();
new CdkServerlessApiStack(app, 'CdkServerlessApiStack');
