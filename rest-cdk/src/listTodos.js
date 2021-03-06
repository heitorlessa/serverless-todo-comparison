"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;
exports.handler = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    try {
        const response = await db.scan(params).promise();
        return { statusCode: 200, body: JSON.stringify(response.Items) };
    }
    catch (dbError) {
        console.error('DDB Error', dbError);
        return { statusCode: 500, body: JSON.stringify(dbError) };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdFRvZG9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGlzdFRvZG9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztBQUU3QixRQUFBLE9BQU8sR0FBRyxLQUFLLElBQW9CLEVBQUU7SUFFaEQsTUFBTSxNQUFNLEdBQUc7UUFDYixTQUFTLEVBQUUsVUFBVTtLQUN0QixDQUFDO0lBRUYsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztLQUNsRTtJQUFDLE9BQU8sT0FBTyxFQUFFO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3BDLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUM7S0FDMUQ7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG5jb25zdCBkYiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IFRBQkxFX05BTUUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jICgpIDogUHJvbWlzZSA8YW55PiA9PiB7XG5cbiAgY29uc3QgcGFyYW1zID0ge1xuICAgIFRhYmxlTmFtZTogVEFCTEVfTkFNRVxuICB9O1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBkYi5zY2FuKHBhcmFtcykucHJvbWlzZSgpO1xuICAgIHJldHVybiB7IHN0YXR1c0NvZGU6IDIwMCwgYm9keTogSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UuSXRlbXMpIH07XG4gIH0gY2F0Y2ggKGRiRXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdEREIgRXJyb3InLCBkYkVycm9yKTtcbiAgICByZXR1cm4geyBzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRiRXJyb3IpfTtcbiAgfVxufTtcbiJdfQ==