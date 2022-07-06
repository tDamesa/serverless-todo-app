import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    private readonly docClient: DocumentClient;
    private readonly todosTable;

    constructor() {
        this.docClient = !process.env.IS_OFFLIN ? new XAWS.DynamoDB.DocumentClient() : new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        });
        this.todosTable = process.env.TODOS_TABLE;
    }

    async createTodo(todo) {
        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: todo,
            })
            .promise();
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient
            .scan({
                TableName: this.todosTable,
                FilterExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                },
            })
            .promise();

        const items = result.Items;
        return items as TodoItem[];
    }

    // async getAllTodos(): Promise<TodoItem[]> {
    //     const result = await this.docClient
    //         .scan({ TableName: this.todosTable }).promise();

    //     const items = result.Items;
    //     return items as TodoItem[];
    // }

    async deleteTodo(userId: string, todoId: string) {
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
            })
            .promise();
    }

    async updateTodo(userId: string, todoId: string, todo: TodoUpdate) {
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
                ExpressionAttributeNames: {
                    '#name': 'name',
                },
                ExpressionAttributeValues: {
                    ':name': todo.name,
                    ':dueDate': todo.dueDate,
                    ':done': todo.done,
                },
            })
            .promise();
    }
}