import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import { Duration } from '@aws-cdk/core';

export class CdkServerlessApiStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const dynamoTable = new dynamodb.Table(this, 'todosTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'todos',

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to 
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const getTodoLambda = new lambda.Function(this, 'getTodoFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'getTodo.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'id'
      }
    });

    const listTodosLambda = new lambda.Function(this, 'listTodosFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'listTodos.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'id'
      }
    });

    const createTodoLambda = new lambda.Function(this, 'createTodoFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'createTodo.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'id'
      }
    });

    const updateTodoLambda = new lambda.Function(this, 'updateTodoFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'updateTodo.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'id'
      }
    });

    const deleteTodoLambda = new lambda.Function(this, 'deleteTodoFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'deleteTodo.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'id'
      }
    });
    
    dynamoTable.grantReadWriteData(listTodosLambda);
    dynamoTable.grantReadWriteData(getTodoLambda);
    dynamoTable.grantReadWriteData(createTodoLambda);
    dynamoTable.grantReadWriteData(updateTodoLambda);
    dynamoTable.grantReadWriteData(deleteTodoLambda);

    const api = new apigateway.RestApi(this, 'todosApi', {
      restApiName: 'ServerlessTodosApi'
    });

    const todos = api.root.addResource('todos');
    const listTodosIntegration = new apigateway.LambdaIntegration(listTodosLambda);
    todos.addMethod('GET', listTodosIntegration);

    const createTodoIntegration = new apigateway.LambdaIntegration(createTodoLambda);
    todos.addMethod('POST', createTodoIntegration);
    addCorsOptions(todos);

    const singleTodo = todos.addResource('{id}');
    const getTodoIntegration = new apigateway.LambdaIntegration(getTodoLambda);
    singleTodo.addMethod('GET', getTodoIntegration);

    const updateTodoIntegration = new apigateway.LambdaIntegration(updateTodoLambda);
    singleTodo.addMethod('PUT', updateTodoIntegration);

    const deleteTodoIntegration = new apigateway.LambdaIntegration(deleteTodoLambda);
    singleTodo.addMethod('DELETE', deleteTodoIntegration);
    addCorsOptions(singleTodo);
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },  
    }]
  })
}

const app = new cdk.App();
new CdkServerlessApiStack(app, 'CdkServerlessApi');
app.synth();
