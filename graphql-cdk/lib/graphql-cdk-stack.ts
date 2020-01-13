import * as cdk from '@aws-cdk/core';
import {
  CfnGraphQLApi,
  CfnApiKey,
  CfnGraphQLSchema,
  CfnDataSource,
  CfnResolver
} from "@aws-cdk/aws-appsync";
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';
import { Table, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb';
import * as path from "path"
import { readFileSync, createReadStream } from "fs"

export class GraphqlCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Schema and Resolver Definitions
    const todoSchema = path.join(__dirname, "api/schema.graphql")
    const createTodoRequestResolver = path.join(__dirname, "api/resolvers/Mutation.createTodo.req.vtl")
    const createTodoResponseResolver = path.join(__dirname, "api/resolvers/Mutation.createTodo.res.vtl")
    const deleteTodoRequestResolver = path.join(__dirname, "api/resolvers/Mutation.deleteTodo.req.vtl")
    const deleteTodoResponseResolver = path.join(__dirname, "api/resolvers/Mutation.deleteTodo.res.vtl")
    const getTodoRequestResolver = path.join(__dirname, "api/resolvers/Query.getTodo.req.vtl")
    const getTodoResponseResolver = path.join(__dirname, "api/resolvers/Query.getTodo.res.vtl")
    const listTodosRequestResolver = path.join(__dirname, "api/resolvers/Query.listTodos.req.vtl")
    const listTodosResponseResolver = path.join(__dirname, "api/resolvers/Query.listTodos.res.vtl")

    const todoAPI = new CfnGraphQLApi(this, "TodoAPI", {
      name: "TodoApi-CDK",
      authenticationType: "API_KEY"
    })

    new CfnApiKey(this, "AppSync2EventBridgeApiKey", {
      apiId: todoAPI.attrApiId
    });

    const apiSchema = new CfnGraphQLSchema(this, "TodoSchema", {
      apiId: todoAPI.attrApiId,
      definition: readFileSync(todoSchema).toString()
    })

    // Datasource
    const todoTable = new Table(this, "todoTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    const todoDataSourceIAMRole = new Role(this, 'todoDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    todoDataSourceIAMRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
    todoDataSourceIAMRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSAppSyncPushToCloudWatchLogs'));

    const todoDataSource = new CfnDataSource(this, "todoDataSource", {
      name: "todoTable",
      apiId: todoAPI.attrApiId,
      description: "Todo Table",
      dynamoDbConfig: {
        tableName: todoTable.tableName,
        awsRegion: this.region
      },
      type: 'AMAZON_DYNAMODB',
      serviceRoleArn: todoDataSourceIAMRole.roleArn
    })

    // Resolvers
    const createTodoResolver = new CfnResolver(this, "createTodoResolver", {
      apiId: todoAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "createTodo",
      dataSourceName: todoDataSource.name,
      requestMappingTemplate: readFileSync(createTodoRequestResolver).toString(),
      responseMappingTemplate: readFileSync(createTodoResponseResolver).toString()
    })

    const deleteTodoResolver = new CfnResolver(this, "deleteTodoResolver", {
      apiId: todoAPI.attrApiId,
      typeName: "Mutation",
      fieldName: "deleteTodo",
      dataSourceName: todoDataSource.name,
      requestMappingTemplate: readFileSync(deleteTodoRequestResolver).toString(),
      responseMappingTemplate: readFileSync(deleteTodoResponseResolver).toString()
    })

    const getTodoResolver = new CfnResolver(this, "getTodoResolver", {
      apiId: todoAPI.attrApiId,
      typeName: "Query",
      fieldName: "getTodo",
      dataSourceName: todoDataSource.name,
      requestMappingTemplate: readFileSync(getTodoRequestResolver).toString(),
      responseMappingTemplate: readFileSync(getTodoResponseResolver).toString()
    })

    const listTodosResolver = new CfnResolver(this, "listTodosResolver", {
      apiId: todoAPI.attrApiId,
      typeName: "Query",
      fieldName: "listTodos",
      dataSourceName: todoDataSource.name,
      requestMappingTemplate: readFileSync(listTodosRequestResolver).toString(),
      responseMappingTemplate: readFileSync(listTodosResponseResolver).toString()
    })

    createTodoResolver.addDependsOn(todoDataSource)
    deleteTodoResolver.addDependsOn(todoDataSource)
    getTodoResolver.addDependsOn(todoDataSource)
    listTodosResolver.addDependsOn(todoDataSource)
  }
}

